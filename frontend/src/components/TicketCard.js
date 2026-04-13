import React, { useState } from 'react';
import API from '../api';

const PRIORITY_STYLES = {
  High:   { bg: '#FAECE7', color: '#993C1D', icon: '▲' },
  Medium: { bg: '#FAEEDA', color: '#854F0B', icon: '●' },
  Low:    { bg: '#EAF3DE', color: '#3B6D11', icon: '▼' },
};

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21];

const POINTS_STYLE = (points) => {
  if (points <= 2)  return { bg: '#EAF3DE', color: '#3B6D11' };
  if (points <= 5)  return { bg: '#FAEEDA', color: '#854F0B' };
  if (points <= 13) return { bg: '#FAECE7', color: '#993C1D' };
  return { bg: '#FCEBEB', color: '#A32D2D' };
};

function TicketCard({ ticket, refresh }) {
  const [loadingAC,  setLoadingAC]  = useState(false);
  const [loadingPri, setLoadingPri] = useState(false);
  const [loadingCx,  setLoadingCx]  = useState(false);

  const [editing,     setEditing]     = useState(false);
  const [editTitle,   setEditTitle]   = useState(ticket.title);
  const [editDesc,    setEditDesc]    = useState(ticket.description);
  const [saving,      setSaving]      = useState(false);

  const [complexity,  setComplexity]  = useState(null);

  const deleteTicket = async () => {
    await API.delete(`/tickets/${ticket._id}`);
    refresh();
  };

  const moveTicket = async (newStatus) => {
    await API.put(`/tickets/${ticket._id}`, { ...ticket, status: newStatus });
    refresh();
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      await API.put(`/tickets/${ticket._id}`, {
        ...ticket,
        title: editTitle,
        description: editDesc,
      });
      refresh();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditTitle(ticket.title);
    setEditDesc(ticket.description);
    setEditing(false);
  };

  const generateAC = async () => {
    setLoadingAC(true);
    try {
      const res = await API.post('/ai/acceptance-criteria', {
        title: ticket.title,
        description: ticket.description,
      });
      await API.put(`/tickets/${ticket._id}`, {
        ...ticket,
        acceptanceCriteria: res.data.criteria,
      });
      refresh();
    } finally {
      setLoadingAC(false);
    }
  };

  const suggestPriority = async () => {
    setLoadingPri(true);
    try {
      const res = await API.post('/ai/suggest-priority', {
        title: ticket.title,
        description: ticket.description,
      });
      await API.put(`/tickets/${ticket._id}`, {
        ...ticket,
        priority: res.data.priority,
      });
      refresh();
    } finally {
      setLoadingPri(false);
    }
  };

  const estimateComplexity = async () => {
    setLoadingCx(true);
    setComplexity(null);
    try {
      const res = await API.post('/ai/estimate-complexity', {
        title: ticket.title,
        description: ticket.description,
      });
      setComplexity(res.data);
      await API.put(`/tickets/${ticket._id}`, {
        ...ticket,
        storyPoints: res.data.points,
      });
      refresh();
    } finally {
      setLoadingCx(false);
    }
  };

  const pri = PRIORITY_STYLES[ticket.priority];
  const ptStyle = ticket.storyPoints ? POINTS_STYLE(ticket.storyPoints) : null;

  return (
    <div style={{
      background: 'var(--color-background-primary, #fff)',
      border: '0.5px solid var(--color-border-tertiary, #e5e5e5)',
      borderRadius: 12,
      padding: '12px',
      marginBottom: 10,
      fontFamily: 'sans-serif',
    }}>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {pri && (
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '2px 8px',
            borderRadius: 6, background: pri.bg, color: pri.color,
          }}>
            {pri.icon} {ticket.priority} priority
          </span>
        )}
        {ticket.storyPoints && (
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '2px 8px',
            borderRadius: 6,
            background: ptStyle.bg, color: ptStyle.color,
          }}>
            {ticket.storyPoints} pts
          </span>
        )}
      </div>

      {/* Edit mode */}
      {editing ? (
        <div style={{ marginBottom: 10 }}>
          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            style={{
              width: '100%', padding: '7px 10px', fontSize: 14,
              border: '0.5px solid #378ADD', borderRadius: 8,
              fontFamily: 'sans-serif', marginBottom: 6, outline: 'none',
              background: 'var(--color-background-secondary, #f5f5f5)',
              color: 'var(--color-text-primary)',
            }}
          />
          <textarea
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
            rows={3}
            style={{
              width: '100%', padding: '7px 10px', fontSize: 13,
              border: '0.5px solid #378ADD', borderRadius: 8,
              fontFamily: 'sans-serif', resize: 'vertical', outline: 'none',
              background: 'var(--color-background-secondary, #f5f5f5)',
              color: 'var(--color-text-primary)',
            }}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button onClick={saveEdit} disabled={saving} style={{
              ...aiBtnStyle, background: '#378ADD', color: '#E6F1FB', border: 'none',
            }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancelEdit} style={btnStyle}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
            {ticket.title}
          </div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 10, lineHeight: 1.4 }}>
            {ticket.description}
          </div>
        </>
      )}

      {/* Acceptance criteria */}
      {ticket.acceptanceCriteria?.length > 0 && (
        <div style={{
          background: 'var(--color-background-secondary, #f7f9fc)',
          borderRadius: 8, padding: '8px 10px', marginBottom: 10,
          fontSize: 12, color: '#555', lineHeight: 1.6,
          borderLeft: '2px solid #378ADD',
        }}>
          <strong style={{ color: 'var(--color-text-primary)', display: 'block', marginBottom: 2 }}>
            Acceptance criteria
          </strong>
          {ticket.acceptanceCriteria.map((c, i) => (
            <div key={i}>· {c}</div>
          ))}
        </div>
      )}

      {/* Complexity result panel */}
      {complexity && (
        <div style={{
          background: 'var(--color-background-secondary, #f7f9fc)',
          borderRadius: 8, padding: '8px 10px', marginBottom: 10,
          fontSize: 12, lineHeight: 1.6,
          borderLeft: '2px solid #EF9F27',
        }}>
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: 'var(--color-text-primary)', marginRight: 6 }}>
              Complexity estimate
            </strong>
            {/* Fibonacci scale visual */}
            <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
              {FIBONACCI.map(n => (
                <span key={n} style={{
                  width: 28, height: 28, borderRadius: 6,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 500,
                  background: n === complexity.points ? '#378ADD' : 'var(--color-background-primary, #fff)',
                  color: n === complexity.points ? '#fff' : '#888',
                  border: n === complexity.points ? 'none' : '0.5px solid #e5e5e5',
                }}>
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div style={{ color: '#555', marginTop: 6 }}>{complexity.reasoning}</div>
          {complexity.suggestion && (
            <div style={{
              marginTop: 8, padding: '6px 8px',
              background: '#FAECE7', borderRadius: 6,
              color: '#993C1D', fontSize: 11,
            }}>
              ⚠ {complexity.suggestion}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      {!editing && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {ticket.status !== 'To Do' && (
            <button onClick={() => moveTicket('To Do')} style={btnStyle}>← To Do</button>
          )}
          {ticket.status !== 'In Progress' && (
            <button onClick={() => moveTicket('In Progress')} style={btnStyle}>→ In Progress</button>
          )}
          {ticket.status !== 'Done' && (
            <button onClick={() => moveTicket('Done')} style={btnStyle}>✓ Done</button>
          )}

          <button onClick={() => setEditing(true)} style={btnStyle}>✎ Edit</button>

          <button onClick={generateAC} disabled={loadingAC} style={aiBtnStyle}>
            {loadingAC ? '…' : '✦ ' + (ticket.acceptanceCriteria?.length ? 'Refine AC' : 'Generate AC')}
          </button>

          {!ticket.priority && (
            <button onClick={suggestPriority} disabled={loadingPri} style={aiBtnStyle}>
              {loadingPri ? '…' : '✦ Suggest priority'}
            </button>
          )}

          <button onClick={estimateComplexity} disabled={loadingCx} style={aiBtnStyle}>
            {loadingCx ? '…' : '✦ ' + (ticket.storyPoints ? 'Re-estimate' : 'Estimate complexity')}
          </button>

          <button onClick={deleteTicket} style={{ ...btnStyle, marginLeft: 'auto', color: '#A32D2D' }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  fontSize: 11, padding: '4px 8px',
  border: '0.5px solid #ccc', borderRadius: 6,
  background: 'transparent', color: '#555',
  cursor: 'pointer', fontFamily: 'sans-serif',
};

const aiBtnStyle = {
  ...btnStyle,
  border: '0.5px solid #378ADD',
  color: '#185FA5',
};

export default TicketCard;
import React, { useState } from 'react';
import API from '../api';

function TicketForm({ refresh }) {
  const [title, setTitle]       = useState('');
  const [description, setDesc]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await API.post('/tickets', { title, description, status: 'To Do' });
    setTitle(''); setDesc('');
    refresh();
  };

  return (
    <div style={{
      background: 'var(--color-background-primary, #fff)',
      border: '0.5px solid var(--color-border-tertiary, #e5e5e5)',
      borderRadius: 12,
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-end',
      flexWrap: 'wrap',
    }}>
      <input
        placeholder="Ticket title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{
          width: 200, padding: '8px 10px', fontSize: 14,
          border: '0.5px solid #ccc', borderRadius: 8,
          background: 'var(--color-background-secondary, #f5f5f5)',
          color: 'var(--color-text-primary)',
          fontFamily: 'sans-serif', outline: 'none',
        }}
      />
      <textarea
        placeholder="Description…"
        value={description}
        onChange={e => setDesc(e.target.value)}
        rows={1}
        style={{
          flex: 1, minWidth: 200, padding: '8px 10px', fontSize: 14,
          border: '0.5px solid #ccc', borderRadius: 8,
          background: 'var(--color-background-secondary, #f5f5f5)',
          color: 'var(--color-text-primary)',
          fontFamily: 'sans-serif', resize: 'none', outline: 'none',
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          background: '#378ADD', color: '#E6F1FB',
          border: 'none', padding: '8px 16px',
          borderRadius: 8, fontSize: 13, fontWeight: 500,
          cursor: 'pointer', height: 36,
        }}
      >
        + Add ticket
      </button>
    </div>
  );
}

export default TicketForm;
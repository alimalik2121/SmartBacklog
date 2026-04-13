import React from 'react';
import TicketCard from './TicketCard';

const COL_COLORS = {
  'To Do':       '#378ADD',
  'In Progress': '#EF9F27',
  'Done':        '#639922',
};

function Column({ title, status, tickets, refresh }) {
  const filtered = tickets.filter(t => t.status === status);
  return (
    <div style={{
      background: 'var(--color-background-secondary, #f5f5f5)',
      borderRadius: 12,
      border: '0.5px solid var(--color-border-tertiary, #e5e5e5)',
      padding: '1rem',
      minHeight: 400,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: COL_COLORS[title] || '#888',
        }} />
        <span style={{ fontSize: 14, fontWeight: 500 }}>{title}</span>
        <span style={{
          marginLeft: 'auto', fontSize: 12, color: '#888',
          background: 'var(--color-background-primary, #fff)',
          border: '0.5px solid #e5e5e5',
          borderRadius: 6, padding: '1px 8px',
        }}>
          {filtered.length}
        </span>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 13, paddingTop: '2rem' }}>
          No tickets
        </div>
      )}

      {filtered.map(ticket => (
        <TicketCard key={ticket._id} ticket={ticket} refresh={refresh} />
      ))}
    </div>
  );
}

export default Column;
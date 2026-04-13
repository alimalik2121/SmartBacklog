import React, { useEffect, useState } from 'react';
import API from './api';
import Board from './components/Board';
import TicketForm from './components/TicketForm';

function App() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await API.get('/tickets');
    setTickets(res.data);
  };

  useEffect(() => { fetchTickets(); }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background-tertiary, #f0f0f0)',
      padding: '1.5rem',
      fontFamily: 'sans-serif',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '1.5rem',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 500 }}>SmartBacklog</h1>
        <span style={{
          fontSize: 13, color: '#888',
          background: '#fff', border: '0.5px solid #e5e5e5',
          borderRadius: 8, padding: '4px 10px',
        }}>
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </span>
      </div>
      <TicketForm refresh={fetchTickets} />
      <Board tickets={tickets} refresh={fetchTickets} />
    </div>
  );
}

export default App;
import React from 'react';
import Column from './Column';

function Board({ tickets, refresh }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
      <Column title="To Do"       status="To Do"       tickets={tickets} refresh={refresh} />
      <Column title="In Progress" status="In Progress" tickets={tickets} refresh={refresh} />
      <Column title="Done"        status="Done"        tickets={tickets} refresh={refresh} />
    </div>
  );
}

export default Board;
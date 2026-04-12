import React from "react";
import Column from "./Column";

function Board({ tickets, refresh }) {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Column title="To Do" status="To Do" tickets={tickets} refresh={refresh} />
      <Column title="In Progress" status="inprogress" tickets={tickets} refresh={refresh} />
      <Column title="Done" status="done" tickets={tickets} refresh={refresh} />
    </div>
  );
}

export default Board;
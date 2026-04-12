import React from "react";
import TicketCard from "./TicketCard";

function Column({ title, status, tickets, refresh }) {
  return (
    <div>
      <h2>{title}</h2>
      {tickets
        .filter((t) => t.status === status)
        .map((ticket) => (
          <TicketCard key={ticket._id} ticket={ticket} refresh={refresh} />
        ))}
    </div>
  );
}

export default Column;
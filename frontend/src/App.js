import React, { useEffect, useState } from "react";
import API from "./api";
import Board from "./components/Board";
import TicketForm from "./components/TicketForm";

function App() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await API.get("/tickets");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <h1>SmartBacklog</h1>
      <TicketForm refresh={fetchTickets} />
      <Board tickets={tickets} refresh={fetchTickets} />
    </div>
  );
}

export default App;
import React from "react";
import API from "../api";

function TicketCard({ ticket, refresh }) {
    const deleteTicket = async () => {
        await API.delete(`/tickets/${ticket._id}`);
        refresh();
    };

    const moveTicket = async (newStatus) => {
        await API.put(`/tickets/${ticket._id}`, { ...ticket, status: newStatus });
        refresh();
    };

    return (
        <div style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
           <h4>{ticket.title}</h4>
           <p>{ticket.description}</p>

           <button onClick={() => moveTicket("todo")}>To Do</button>
           <button onClick={() => moveTicket("inprogress")}>In Progress</button>
           <button onClick={() => moveTicket("done")}>Done</button>

           <button onClick={deleteTicket}>Delete</button>
        </div> 
    );
}

export default TicketCard;
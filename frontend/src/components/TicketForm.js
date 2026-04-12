import React, {useState} from 'react';
import API from '../api';

function TicketForm({ refresh }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await API.post("/tickets", { 
          title, 
          description,
          status: "To Do"   
    });
        setTitle('');
        setDescription('');
        refresh();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
            placeholder= "Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <input
            placeholder= "Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Ticket</button>
        </form>
    );
}

export default TicketForm;
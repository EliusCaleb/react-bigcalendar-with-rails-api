import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);


const Calendars = () => {
  const [events, setEvents] = useState([]);
  //const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch('http://localhost:3000/api/events')
      .then((response) => response.json())
      .then((data) => {
        // Convert date strings to JavaScript Date objects
        const formattedEvents = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const handleSelect = ({ start, end }) => {
   
    const title = window.prompt('Enter event title:');
    if (title) {
      const newEvent = {
        title,
        start,
        end,
      };

     
      fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      })
        .then(() => fetchEvents())
        .catch((error) => console.error('Error creating event:', error));
    }
  };

  const handleSelectEvent = (event) => {
   
    const action = window.confirm('Do you want to edit or delete this event?')
      ? 'edit'
      : 'delete';

    if (action === 'edit') {
      const newTitle = window.prompt('Edit event title:', event.title);
      if (newTitle) {
        const updatedEvent = { ...event, title: newTitle };

        
        fetch(`http://localhost:3000/api/events/${event.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEvent),
        })
          .then(() => fetchEvents())
          .catch((error) => console.error('Error updating event:', error));
      }
    } else {
    
      fetch(`http://localhost:3000/api/events/${event.id}`, {
        method: 'DELETE',
      })
        .then(() => fetchEvents())
        .catch((error) => console.error('Error deleting event:', error));
    }
  };
  return (
    <div  style={{ height: '500px', padding: '20px' }}>
       <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  )
}

export default Calendars
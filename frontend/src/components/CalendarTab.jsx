import React from 'react';

export default function CalendarTab({
  calendarEvents,
  handleEventClick,
  newEvent,
  setNewEvent,
  handleAddEvent,
  eventStatus
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
      {/* Calendar Grid View */}
      <div className="card">
        <div className="flex-between margin-b-24">
          <h3>Event Calendar - July 2026</h3>
          <span className="font-14 text-muted">Weekly Sync Enabled</span>
        </div>

        <div className="calendar-grid">
          {/* Header Days */}
          <div className="calendar-header-day">Mon</div>
          <div className="calendar-header-day">Tue</div>
          <div className="calendar-header-day">Wed</div>
          <div className="calendar-header-day">Thu</div>
          <div className="calendar-header-day">Fri</div>
          <div className="calendar-header-day">Sat</div>
          <div className="calendar-header-day">Sun</div>

          {/* Day Cells (Mocks for July 6th - July 12th) */}
          {[
            { date: 6, active: true, events: [] },
            { date: 7, active: true, today: true, events: [] },
            { date: 8, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 1) : null].filter(Boolean) },
            { date: 9, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 2) : null].filter(Boolean) },
            { date: 10, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 3) : null].filter(Boolean) },
            { date: 11, active: true, events: [] },
            { date: 12, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 4) : null].filter(Boolean) }
          ].map((cell, idx) => (
            <div key={idx} className={`calendar-day-cell ${cell.active ? 'active-month' : ''} ${cell.today ? 'today' : ''}`}>
              <span className="calendar-day-number">{cell.date}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {cell.events.map(ev => (
                  <div 
                    key={ev.id} 
                    className={`calendar-event-item ${ev.eventType?.toLowerCase() || 'content_posting'}`}
                    title={`${ev.title}\nClick to draft a post inspired by this event.`}
                    onClick={() => handleEventClick(ev)}
                    style={{ cursor: 'pointer' }}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="font-12 text-muted" style={{ marginTop: '16px' }}>
          💡 <strong>Agentic Tip:</strong> Click on any scheduled calendar event box (like the sync meeting or webinar) to automatically generate ideas and draft social content inspired by it.
        </p>
      </div>

      {/* Add Event Form */}
      <div className="card">
        <h3 className="margin-b-24">Add Event / Activity</h3>
        <form onSubmit={handleAddEvent}>
          <div className="form-group">
            <label>Event Title</label>
            <input 
              type="text" 
              value={newEvent.title} 
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
              placeholder="e.g. Sync meeting with founder" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Description / Context</label>
            <textarea 
              value={newEvent.description} 
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
              placeholder="Provide details about the meeting or event..." 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Start Date & Time</label>
              <input 
                type="datetime-local" 
                value={newEvent.startTime} 
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>End Date & Time</label>
              <input 
                type="datetime-local" 
                value={newEvent.endTime} 
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Event Type</label>
              <select value={newEvent.eventType} onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}>
                <option value="CONTENT_POSTING">Content Posting</option>
                <option value="MEETING">Meeting</option>
                <option value="ANALYTICS_REVIEW">Analytics Review</option>
                <option value="MEETING">Webinar/Event</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Platform</label>
              <select value={newEvent.platform} onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="TWITTER">Twitter/X</option>
                <option value="INSTAGRAM">Instagram</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary" disabled={eventStatus === 'saving'}>
              {eventStatus === 'saving' && <div className="loading-spinner" />}
              Add Event
            </button>
            {eventStatus === 'success' && <span className="font-14" style={{ color: 'var(--accent-teal)' }}>Event added!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

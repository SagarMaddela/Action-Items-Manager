/**
 * Generate ICS (iCalendar) file content for calendar invites
 * @param {Object} event - Event details
 * @param {string} event.title - Event title
 * @param {string} event.description - Event description
 * @param {Date} event.startTime - Event start time
 * @param {Date} event.endTime - Event end time (optional, defaults to 1 hour after start)
 * @param {string} event.location - Event location (optional)
 */
const generateICS = ({ title, description, startTime, endTime, location }) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour

    // Format dates to ICS format (YYYYMMDDTHHMMSSZ)
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Apogee//Action Items//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@apogee.com`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        `SUMMARY:${title}`,
        description ? `DESCRIPTION:${description.replace(/\n/g, '\\n')}` : '',
        location ? `LOCATION:${location}` : '',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
    ].filter(line => line).join('\r\n');

    return icsContent;
};

/**
 * Generate ICS file from action item metadata
 */
const generateActionCalendarInvite = (action, metadata) => {
    const title = action.title;
    const description = action.description || '';
    const startTime = metadata.calendar_start || action.due_at;
    const endTime = metadata.calendar_end;
    const location = metadata.calendar_location;

    if (!startTime) {
        throw new Error('Calendar start time not specified');
    }

    return generateICS({ title, description, startTime, endTime, location });
};

module.exports = {
    generateICS,
    generateActionCalendarInvite
};

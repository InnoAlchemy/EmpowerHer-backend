// helpers/timeHelper.js

// Helper function to format time to 12-hour format
function formatTimeTo12Hour(time) {
    const [hour, minute] = time.split(':');
    let formattedHour = parseInt(hour, 10);
    const ampm = formattedHour >= 12 ? 'PM' : 'AM';
    formattedHour = formattedHour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour}:${minute} ${ampm}`;
  }
  
  module.exports = formatTimeTo12Hour;
  
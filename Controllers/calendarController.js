const { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } = require('date-fns');

exports.getCalendar = function(request, response, next){
    try {
        // Define the API endpoint for generating the calendar
        const { year, month } = request.params;
        const startDate = startOfMonth(new Date(year, month - 1));
        const endDate = endOfMonth(new Date(year, month - 1));
        const startWeek = startOfWeek(startDate);
        const endWeek = endOfWeek(endDate);

        const days = eachDayOfInterval({ start: startWeek, end: endWeek }); //generates an array of all the dates within the interval defined by the start and end week.

        const calendar = []; // empty array to hold the calendar data
        let week = []; // empty array to represent a week.
        for (const day of days) {
            if (day.getMonth() === startDate.getMonth()) { // checks if the month of the current day is the same as the month of the start date. This ensures that only the days belonging to the specified month are added to the calendar.
                week.push(format(day, 'dd')); // if the day belongs to the specified month, formats the day with the 'dd' format (e.g., '01', '02', etc.), and adds it to the week array.
            } else {
                week.push('');
            }
            if (week.length === 7) {//If the week array is full, calendar.push(week); adds the week array to the calendar array, representing a complete week.  
                calendar.push(week);
                week = []; // resets the week array for the next week.
            }
        }
        response.json(calendar);
    }
    catch (error) { next(error); }
}

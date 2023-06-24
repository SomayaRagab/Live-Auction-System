// calculate function end date for auction from start date and duration

exports.addDurationToDate = (date, duration) => {
  const newDate = new Date(date);

  return new Date(
    newDate.setMinutes(date.getMinutes() + duration)
  ).toISOString();
};

exports.addTimeToDate = (date, time) => {
  console.log(date);
  [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  newDate.setMinutes(newDate.getMinutes() + minutes);

  return newDate;
};

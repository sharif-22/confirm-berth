import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

function timeStamp(dateString) {
  const parsedDate = dayjs(dateString, "DD-MM-YYYY");
  // Get the timestamp in milliseconds
  const timestamp = parsedDate.valueOf();
  return timestamp;
}

function formatDate(dateString, formate = "DD-MM-YYYY") {
  // here the date string formated by customParseFormat
  const parsedDate = dayjs(dateString, formate);

  // Get the week in short, day, month in short
  const dayShort = parsedDate.format("ddd");
  const day = parsedDate.format("DD");
  const monthShort = parsedDate.format("MMM");
  const yearShort = parsedDate.format("YYYY");
  const formattedDate = `${dayShort}, ${day} ${monthShort}, ${yearShort}`;
  return formattedDate;
}

function formatTime(timeString) {
  const parsedTime = dayjs(timeString, "HH:mm:ss");
  const formattedTime = parsedTime.format("HH:mm");
  return formattedTime;
}

function futureTripsByDate(trips) {
  const today = dayjs().startOf("day");

  const upComingTrips = trips
    .map((trip) => ({
      ...trip,
      // Convert `dateOfJourney` string to timestamp for comparison
      timeStamp: dayjs(trip.dateOfJourney).valueOf(),
    }))
    .sort((a, b) => a.timeStamp - b.timeStamp)
    .filter((trip) => trip.timeStamp >= today.valueOf());

  return upComingTrips;
}

function convertTo24HrDateLabel(dateStr) {
  return dayjs(dateStr).format("HH:mm - D MMM YY");
}

function pastTripsByDate(trips) {
  const today = dayjs().startOf("day");
  const upComingTrips = trips
    .map((trip) => ({
      ...trip,
      // Convert `dateOfJourney` string to timestamp for comparison
      timeStamp: dayjs(trip.dateOfJourney).valueOf(),
    }))
    .sort((a, b) => b.timeStamp - a.timeStamp)
    .filter((obj) => {
      return obj.timeStamp <= today.valueOf();
    });
  return upComingTrips;
}

export {
  formatDate,
  formatTime,
  timeStamp,
  futureTripsByDate,
  pastTripsByDate,
  convertTo24HrDateLabel,
};

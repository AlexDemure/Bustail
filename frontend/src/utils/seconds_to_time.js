
export default function secondsToTime(number){
  let hours = Math.floor(number / (60 * 60));

  let divisor_for_minutes = number % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  if (seconds < 10) {
    seconds = "0" + seconds;
  } 
  let obj = {
    "h": hours,
    "m": minutes,
    "s": seconds
  };
  return obj;
}
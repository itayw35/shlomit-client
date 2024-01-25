import React, { useEffect, useState } from "react";

function TimePicker(props) {
  const [generalHours, setGeneralhours] = useState(["13:00", "20:00"]);
  const [availableHours, setAvailablehours] = useState(generalHours);
  useEffect(() => {
    if (props.day.getDay() === 2)
      setAvailablehours(
        generalHours.filter((hour) => {
          return (
            hour === "20:00" &&
            !props.occupiedAppointmentsForChosenDate.find(
              (date) => date.getHours() === Number(hour.slice(0, 2))
            )
          );
        })
      );
    else
      setAvailablehours(
        generalHours.filter((hour) => {
          return !props.occupiedAppointmentsForChosenDate.find(
            (date) => date.getHours() === Number(hour.slice(0, 2))
          );
        })
      );
  }, [props.occupiedAppointmentsForChosenDate]);
  return (
    <select ref={props.hourRef}>
      {availableHours.map((cell) => (
        <option value={cell}>{cell}</option>
      ))}
    </select>
  );
}

export default TimePicker;

import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";
import TimePicker from "./TimePicker";

function Home() {
  const [chosenDate, setChosenDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [occupiedAppointments, setOccupiedAppointments] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [
    occuopiedAppointmentsForChosenDate,
    setOccupiedAppointmentsForChosenDate,
  ] = useState([]);
  const [isTimePicker, setIsTimePicker] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const nameRef = useRef();
  const phoneRef = useRef();
  const hourRef = useRef();
  const alertRef = useRef();
  const generateAvailableDates = (startDate, endDate) => {
    const currentDate = new Date(startDate);
    const datesArray = [];
    console.log(occupiedDates);
    while (currentDate <= endDate) {
      if (
        (currentDate.getDay() === 2 &&
          occupiedDates.filter((date) => {
            return (
              currentDate.getFullYear() === date.getFullYear() &&
              currentDate.getMonth() === date.getMonth() &&
              currentDate.getDate() === date.getDate()
            );
          }).length < 1) ||
        (currentDate.getDay() === 3 &&
          occupiedDates.filter((date) => {
            return (
              currentDate.getFullYear() === date.getFullYear() &&
              currentDate.getMonth() === date.getMonth() &&
              currentDate.getDate() === date.getDate()
            );
          }).length < 2)
      )
        datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setAvailableDates(datesArray);
  };
  const handleChosenDate = (value) => {
    setChosenDate(value);
    setIsTimePicker(true);
  };
  const validatePhone = (e) => {
    const phone = e.target.value;
    const numOfDigits = phone.length;
    const firstDigit = phone[0];
    if (numOfDigits >= 9 && numOfDigits <= 10 && Number(firstDigit) === 0) {
      if (!isValidPhone) setIsValidPhone(true);
    } else {
      if (isValidPhone) setIsValidPhone(false);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const phone = phoneRef.current.value;
    const hour = hourRef.current.value;
    const hourArray = hour.split(":");
    chosenDate.setHours(hourArray[0], hourArray[1]);
    axios
      .post(
        "https://shlomit-00e660508931.herokuapp.com/appointments/set-appointment",
        {
          name: name,
          phone: phone,
          date: chosenDate,
        }
      )
      .then((res) => {
        console.log(res.data);
        alertRef.current.innerText = res.data;
      })
      .catch((err) => {
        console.log(err);
        alertRef.current.innerText = err.response.data;
        setTimeout(() => {
          alertRef.current.innerText = "";
        }, 2000);
      });
  };
  useEffect(() => {
    axios
      .get(
        "https://shlomit-00e660508931.herokuapp.com/appointments/get-appointments"
      )
      .then((res) => {
        console.log(res.data);
        const dates = res.data.filter((date) => {
          return date.status !== "cancelled";
        });
        setOccupiedAppointments(dates);
      });
  }, []);
  useEffect(() => {
    const formattedOccupiedAppointments = occupiedAppointments.map(
      (appointment) => {
        const formattedDate = new Date(appointment.time);
        return formattedDate;
      }
    );
    setOccupiedDates(formattedOccupiedAppointments);
  }, [occupiedAppointments]);
  useEffect(() => {
    generateAvailableDates(
      new Date(),
      new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    );
  }, [occupiedDates]);
  useEffect(() => {
    setOccupiedAppointmentsForChosenDate(
      occupiedDates.filter((date) => {
        return (
          date.getFullYear() === chosenDate.getFullYear() &&
          date.getMonth() === chosenDate.getMonth() &&
          date.getDate() === chosenDate.getDate()
        );
      })
    );
  }, [chosenDate]);
  return (
    <div id="main-container">
      <div id="inner-container">
        <form id="form-flex">
          <div className="input-field">
            <label htmlFor="name-field">
              <span className="red">*</span>שם:{" "}
            </label>
            <input
              ref={nameRef}
              id="name-field"
              type="text"
              className="input-field"
              required
              autoFocus
            />
          </div>
          <div className="input-field">
            <label htmlFor="phone-field">
              <span className="red">*</span>מספר טלפון:{" "}
            </label>
            <input
              id="phone-field"
              type="tel"
              className="input-field"
              onChange={validatePhone}
              ref={phoneRef}
              required
            />
          </div>
          <div id="date-row">
            <div className="input-field">
              <label htmlFor="date-selection">
                <span className="red">*</span>בחירת תאריך:{" "}
              </label>
              <DatePicker
                id="date-selection"
                selected={chosenDate}
                onSelect={(date) => handleChosenDate(date)}
                dateFormat={"dd/MM/yyyy"}
                highlightDates={availableDates}
                includeDates={availableDates}
                className="input-field"
              />
            </div>
          </div>
          {isTimePicker ? (
            <span id="time-picker">
              <TimePicker
                occupiedAppointmentsForChosenDate={
                  occuopiedAppointmentsForChosenDate
                }
                hourRef={hourRef}
                day={chosenDate}
              />
            </span>
          ) : null}
          <span className="red" ref={alertRef}></span>
          <button
            id="submit-button"
            disabled={!isValidPhone || !nameRef.current.value || !chosenDate}
            onClick={submit}
            style={{
              cursor:
                !isValidPhone || !nameRef.current.value || !chosenDate
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            קביעת תור
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;

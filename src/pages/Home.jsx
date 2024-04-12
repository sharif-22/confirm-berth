import React, { useRef, useState } from "react";

import InputComp from "../components/Form/InputComp";
import MiniCard from "../components/UI/MiniCard";
import ModelPnrCard from "../components/UI/ModelPnrCard";

import { getLocalStorage, setLocalStorage } from "../helpers/LocalStorage";
import { addObjectIfNotExists, isObjectExists } from "../helpers/manipulations";
import {
  timeStamp,
  formatDate,
  formatTime,
  futureTripsByDate,
  pastTripsByDate,
} from "../helpers/dayjs";

const Home = () => {
  const [pnr, setPnr] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  console.log(modelOpen);
  const formRef = useRef();
  const DataArr = getLocalStorage();
  const upCommingTrips = futureTripsByDate(DataArr);
  const pastTrips = pastTripsByDate(DataArr);

  const fetchPnr = async (pnrNum) => {
    const url = `https://pnr-status-indian-railway.p.rapidapi.com/pnr-check/${pnrNum}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_X_RapidAPI_Key,
        "X-RapidAPI-Host": "pnr-status-indian-railway.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const { status, code, data } = result;

      if (code == 200 && status) {
        const {
          boardingInfo,
          destinationInfo,
          trainInfo,
          trainRoutes,
          passengerInfo,
        } = data;
        const pnrData = {
          id: parseInt(pnr),
          boardingInfo,
          destinationInfo,
          trainInfo,
          trainRoutes,
          passengerInfo,
          timeStamp: timeStamp(trainInfo.dt),
        };

        if (DataArr.length === 0) {
          DataArr.push(pnrData);
        }

        // if obj is not exist then push and store
        addObjectIfNotExists(DataArr, pnrData);
        setLocalStorage(DataArr);

        console.log(pnrData);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handelOnChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setPnr(value);
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    const currentForm = formRef.current;
    const formData = new FormData(currentForm);
    const formDataObj = Object.fromEntries(formData);
    const { pnr } = formDataObj;

    // below api called when user enter new pnr
    if (pnr.length > 9) {
      if (!isObjectExists(DataArr, pnr)) {
        fetchPnr(pnr);
        // setPnr("");
      }
    }
  };

  return (
    <>
      <div>
        <form
          ref={formRef}
          onSubmit={handelSubmit}
          className="lg:max-w-5xl w-11/12 bg-slate-200 p-3 space-y-4 mx-auto my-5 rounded"
        >
          <InputComp
            pnr={pnr}
            handelOnChange={handelOnChange}
            children={
              <button className="bg-green-500 hover:bg-green-500/85 hover:text-black text-white font-medium px-5 py-1.5 rounded">
                Submit
              </button>
            }
          />
        </form>
      </div>
      {upCommingTrips.length > 0
        ? upCommingTrips.map((data) => (
            <MiniCard
              key={data.id}
              pnr={data.id}
              boardingStation={data.boardingInfo.stationName}
              boardingTime={formatTime(data.boardingInfo.arrivalTime)}
              destinationStation={data.destinationInfo.stationName}
              destinationTime={formatTime(data.destinationInfo.arrivalTime)}
              travelDate={formatDate(data.trainInfo.dt)}
              trainName={data.trainInfo.name}
              trainNum={data.trainInfo.trainNo}
              openModel={() => setModelOpen(!modelOpen)}
            />
          ))
        : ""}

      <ModelPnrCard open={modelOpen} onClose={() => setModelOpen(!modelOpen)} />
    </>
  );
};

export default Home;

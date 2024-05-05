import React, { useRef, useState } from "react";

import InputComp from "../components/Form/InputComp";
import MiniCard from "../components/UI/MiniCard";
import ModelPnrCard from "../components/UI/ModelPnrCard";

import {
  getLocalStorage,
  getSessionStorage,
  setLocalStorage,
  setSessionStorage,
} from "../helpers/LocalStorage";
import { addObjectIfNotExists, isObjectExists } from "../helpers/manipulations";
import {
  timeStamp,
  futureTripsByDate,
  pastTripsByDate,
} from "../helpers/dayjs";

const Home = () => {
  const DataArr = getLocalStorage();
  const formRef = useRef();
  const [pnr, setPnr] = useState("");
  const [selectedPnr, setSelectedPnr] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [upCommingTrips, setUpCommingTrips] = useState(
    futureTripsByDate(DataArr)
  );
  const [viewCommingTrips, setViewCommingTrips] = useState(true);

  const pastTrips = pastTripsByDate(DataArr);

  const fetchPnrSearch = async (pnrNum) => {
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

        setUpCommingTrips(futureTripsByDate(DataArr));
        // console.log(pnrData);
        return pnrData;
      } else {
        console.log(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          id: parseInt(pnrNum),
          boardingInfo,
          destinationInfo,
          trainInfo,
          trainRoutes,
          passengerInfo,
          timeStamp: timeStamp(trainInfo.dt),
        };
        setSessionStorage(pnrNum, pnrData);
        if (DataArr.length === 0) {
          DataArr.push(pnrData);
        }

        // if obj is not exist then push and store
        // addObjectIfNotExists(DataArr, pnrData);
        // setLocalStorage(DataArr);

        // console.log(pnrData);
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
        fetchPnrSearch(pnr);
        // setPnr("");
      }
    }
  };

  return (
    <>
      {/*Input form */}
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
      {/*nxt && prev trips buttons */}
      <div className="lg:max-w-5xl w-11/12 bg-slate-200 mx-auto rounded flex gap-2 p-2">
        <button
          onClick={() => setViewCommingTrips(true)}
          className={`font-medium p-2 w-full rounded ${
            viewCommingTrips ? "bg-green-500 text-white" : "bg-white"
          }`}
          type="button"
        >
          Comming Trips
        </button>
        <button
          onClick={() => setViewCommingTrips(false)}
          className={`font-medium p-2 w-full rounded ${
            viewCommingTrips ? "bg-white" : "bg-green-500 text-white"
          }`}
          type="button"
        >
          Past Trips
        </button>
      </div>
      {/* view trips based on selected above btns  */}
      {viewCommingTrips
        ? upCommingTrips.length > 0
          ? upCommingTrips.map((data) => (
              <MiniCard
                data={data}
                key={data.id}
                openModel={(e) => {
                  setSelectedPnr(data.id);
                  setModelOpen(!modelOpen);
                  if (getSessionStorage(data.id).length === 0) {
                    fetchPnr(data.id);
                  }
                }}
              />
            ))
          : "No Data "
        : pastTrips.length > 0
        ? pastTrips.map((data) => <MiniCard data={data} key={data.id} />)
        : "No prev Data"}
      <ModelPnrCard
        pnrId={selectedPnr}
        open={modelOpen}
        onClose={() => setModelOpen(!modelOpen)}
      />
    </>
  );
};

export default Home;

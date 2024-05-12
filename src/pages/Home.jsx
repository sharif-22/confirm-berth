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
import PlaceholderCard from "../components/UI/PlaceholderCard";

const Home = () => {
  const DataArr = getLocalStorage();
  const formRef = useRef();
  const [pnr, setPnr] = useState("");
  const [selectedPnr, setSelectedPnr] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [modelData, setModelData] = useState(undefined);
  const [upComingTrips, setupComingTrips] = useState(
    futureTripsByDate(DataArr)
  );
  const [viewComingTrips, setViewComingTrips] = useState(true);

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

        setupComingTrips(futureTripsByDate(DataArr));
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
      setModelData(undefined);
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
        setModelData(pnrData);
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
      }
    }
    setPnr("");
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
          onClick={() => setViewComingTrips(true)}
          className={`font-medium p-2 w-full rounded ${
            viewComingTrips ? "bg-green-500 text-white" : "bg-white"
          }`}
          type="button"
        >
          Coming Trips
        </button>
        <button
          onClick={() => setViewComingTrips(false)}
          className={`font-medium p-2 w-full rounded ${
            viewComingTrips ? "bg-white" : "bg-green-500 text-white"
          }`}
          type="button"
        >
          Past Trips
        </button>
      </div>
      {/* view trips based on selected above btns  */}
      {viewComingTrips ? (
        upComingTrips.length > 0 ? (
          upComingTrips.map((data) => (
            <MiniCard
              data={data}
              key={data.id}
              openModel={(e) => {
                setSelectedPnr(data.id);
                setModelOpen(!modelOpen);
                if (getSessionStorage(data.id).length === 0) {
                  console.log("fetching....");
                  fetchPnr(data.id);
                } else {
                  setModelData(getSessionStorage(data.id));
                }
              }}
            />
          ))
        ) : (
          <PlaceholderCard placeholderTxt={"Enter pnr number"} />
        )
      ) : pastTrips.length > 0 ? (
        pastTrips.map((data) => <MiniCard data={data} key={data.id} />)
      ) : (
        <PlaceholderCard placeholderTxt={"Your Past travel history is Empty"} />
      )}
      <ModelPnrCard
        pnrId={selectedPnr}
        open={modelOpen}
        onClose={() => setModelOpen(!modelOpen)}
      />
    </>
  );
};

export default Home;

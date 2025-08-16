import React, { useRef, useState, useCallback } from "react";

import InputComp from "../components/Form/InputComp";
import MiniCard from "../components/UI/MiniCard";
import ModelPnrCard from "../components/UI/ModelPnrCard";
import PlaceholderCard from "../components/UI/PlaceholderCard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getLocalStorage,
  getSessionStorage,
  setLocalStorage,
  setSessionStorage,
} from "../helpers/LocalStorage";
import { addObjectIfNotExists, isObjectExists } from "../helpers/manipulations";
import { futureTripsByDate, pastTripsByDate } from "../helpers/dayjs";
import { getPNRStatus } from "../apis/pnrServices";

const Home = () => {
  const [dataArr, setDataArr] = useState(() => getLocalStorage());
  const [pnr, setPnr] = useState("");
  const [selectedPnr, setSelectedPnr] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [modelData, setModelData] = useState(undefined);
  const [viewComingTrips, setViewComingTrips] = useState(true);

  const formRef = useRef();

  const upComingTrips = futureTripsByDate(dataArr);
  const pastTrips = pastTripsByDate(dataArr);

  /** --- API CALL --- */
  const fetchPnrStatus = useCallback(async (pnrNumber) => {
    try {
      const response = await getPNRStatus(pnrNumber);
      return response;
    } catch (error) {
      console.error("Error fetching PNR status:", error);
      throw error;
    }
  }, []);

  /** --- SEARCH NEW PNR --- */
  const fetchPnrSearch = useCallback(
    async (pnrNum) => {
      try {
        setSelectedPnr(pnrNum);
        setModelOpen(true);

        const { code, data } = await fetchPnrStatus(pnrNum);

        if (code === 200) {
          const updatedData = addObjectIfNotExists([...dataArr], data);
          setLocalStorage(updatedData);
          setSessionStorage(pnrNum, data);

          setDataArr(updatedData);
          return data;
        } else {
          toast.error("Invalid PNR");
          setModelOpen(false);
          setSelectedPnr("");
        }
      } catch (error) {
        toast.error(error.message || "Error fetching PNR data");
        setModelOpen(false);
        setSelectedPnr("");
      }
    },
    [dataArr, fetchPnrStatus]
  );

  /** --- FETCH PNR DETAILS FOR MODEL --- */
  const fetchPnr = useCallback(
    async (pnrNum) => {
      try {
        setModelData(undefined);
        const { code, data } = await fetchPnrStatus(pnrNum);

        if (code === 200) {
          setSessionStorage(pnrNum, data);
          setModelData(data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [fetchPnrStatus]
  );

  /** --- INPUT CHANGE --- */
  const handleOnChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) setPnr(value);
  };

  /** --- SUBMIT --- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const { pnr } = Object.fromEntries(formData);

    if (pnr.length > 9 && !isObjectExists(dataArr, pnr)) {
      fetchPnrSearch(pnr);
    }
    setPnr("");
  };

  /** --- TOGGLE MODEL --- */
  const toggleModel = (status) => setModelOpen(status ?? !modelOpen);

  /** --- RENDER TRIPS --- */
  const renderTrips = () => {
    if (viewComingTrips) {
      if (upComingTrips.length === 0)
        return <PlaceholderCard placeholderTxt="Enter PNR Number" />;

      return upComingTrips.map((data) => (
        <MiniCard
          data={data}
          key={data.pnrNumber}
          openModel={() => {
            setSelectedPnr(data.pnrNumber);
            toggleModel(true);

            const cachedData = getSessionStorage(data.pnrNumber);
            if (!cachedData?.length) {
              fetchPnr(data.pnrNumber);
            } else {
              setModelData(cachedData);
            }
          }}
        />
      ));
    }

    if (pastTrips.length === 0)
      return (
        <PlaceholderCard placeholderTxt="Your Past Travel History is Empty" />
      );

    return pastTrips.map((data) => <MiniCard data={data} key={data.id} />);
  };

  return (
    <>
      <ToastContainer />

      {/* Input form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="lg:max-w-5xl w-11/12 bg-slate-200 p-3 space-y-4 mx-auto my-5 rounded"
      >
        <InputComp pnr={pnr} handelOnChange={handleOnChange}>
          <button className="bg-green-500 hover:bg-green-500/85 hover:text-black text-white font-medium px-5 py-1.5 rounded">
            Submit
          </button>
        </InputComp>
      </form>

      {/* Trips toggle buttons */}
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
            !viewComingTrips ? "bg-green-500 text-white" : "bg-white"
          }`}
          type="button"
        >
          Past Trips
        </button>
      </div>

      {/* Trips list */}
      {renderTrips()}

      {/* Model */}
      <ModelPnrCard
        pnrId={selectedPnr}
        open={modelOpen}
        onClose={() => toggleModel(false)}
        data={modelData}
      />
    </>
  );
};

export default Home;

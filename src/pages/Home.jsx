import React, {
  useRef,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";

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
import { PnrContext } from "../Context";

const Home = () => {
  const { pnrs, setPnrs } = useContext(PnrContext);
  const [dataArr, setDataArr] = useState(() => getLocalStorage());
  console.log("Context PNRs:", pnrs);
  console.log("dataArr:", dataArr);

  const [pnr, setPnr] = useState("");
  const [selectedPnr, setSelectedPnr] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [modelData, setModelData] = useState(undefined);
  const [viewComingTrips, setViewComingTrips] = useState(true);

  const formRef = useRef();

  useEffect(() => {
    const localPnrData = getLocalStorage();
    console.log("Local PNR Data:", localPnrData);

    localPnrData && setPnrs(localPnrData);
  }, []);

  const upComingTrips = futureTripsByDate(pnrs);
  console.log(upComingTrips);
  const pastTrips = pastTripsByDate(pnrs);

  /** --- API CALL --- */
  const fetchPnrStatus = useCallback(async (pnrNumber) => {
    try {
      const response = await getPNRStatus(pnrNumber);
      return response;
    } catch (error) {
      console.error("Error fetching PNR status:", error);

      setModelOpen(false);
      setSelectedPnr("");

      throw error;
    }
  }, []);

  /** --- SEARCH NEW PNR --- */
  const fetchPnrSearch = useCallback(
    async (pnrNum) => {
      try {
        setSelectedPnr(pnrNum);
        setModelOpen(true);

        const result = await fetchPnrStatus(pnrNum);

        const { code, data } = result;
        console.log("PNR Search Result:", result);

        if (code === 200) {
          const updatedData = addObjectIfNotExists([...dataArr], data);
          console.log(updatedData);
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
    [dataArr, fetchPnrStatus],
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
    [fetchPnrStatus],
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
    } else {
      toast.error("Please enter a new PNR number it is already exists.");
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
        className="mx-auto my-5 w-11/12 space-y-4 rounded bg-slate-200 p-3 lg:max-w-5xl"
      >
        <InputComp pnr={pnr} handelOnChange={handleOnChange}>
          <button className="rounded bg-green-500 px-5 py-1.5 font-medium text-white hover:bg-green-500/85 hover:text-black">
            Submit
          </button>
        </InputComp>
      </form>

      {/* Trips toggle buttons */}
      <div className="mx-auto flex w-11/12 gap-2 rounded bg-slate-200 p-2 lg:max-w-5xl">
        <button
          onClick={() => setViewComingTrips(true)}
          className={`w-full rounded p-2 font-medium ${
            viewComingTrips ? "bg-green-500 text-white" : "bg-white"
          }`}
          type="button"
        >
          Coming Trips
        </button>
        <button
          onClick={() => setViewComingTrips(false)}
          className={`w-full rounded p-2 font-medium ${
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

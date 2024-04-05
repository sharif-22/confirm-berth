import React, { useRef, useState } from "react";

const Home = () => {
  const [pnr, setPnr] = useState("");
  const formRef = useRef();

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
          seatInfo,
          trainInfo,
          passengerInfo,
        } = data;
        // set localstorage
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

    // check pnr is exist in localstorage

    // below api call is called when pnr not exist
    fetchPnr(pnr);
  };

  return (
    <>
      <div>
        <form
          ref={formRef}
          onSubmit={handelSubmit}
          className="max-w-lg bg-slate-200 p-5 space-y-4 mx-auto my-5 rounded"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="pnr" className="text-lg font-medium">
              Enter PNR number
            </label>
            <div className="flex justify-between gap-x-4">
              <input
                type="number"
                name="pnr"
                id="pnr"
                value={pnr}
                onChange={handelOnChange}
                placeholder="Enter PNR number"
                className="p-2 rounded w-full"
              />
              <button className="bg-green-500 text-white font-medium px-5 py-1.5 rounded">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;

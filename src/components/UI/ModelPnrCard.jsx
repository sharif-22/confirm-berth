import { useRef } from "react";
import html2canvas from "html2canvas";
import { RiCloseFill } from "react-icons/ri";
import { HiArrowSmallRight } from "react-icons/hi2";
import { ShimmerButton, ShimmerThumbnail } from "react-shimmer-effects";

import { getSessionStorage } from "../../helpers/LocalStorage";
import { convertTo24HrDateLabel } from "../../helpers/dayjs";

export default function ModalPnrCard({ open, onClose, pnrId }) {
  const cardRef = useRef(); // Hidden card for screenshot

  const {
    pnrNumber,
    passengerList,
    dateOfJourney,
    boardingPoint,
    destinationStation,
    arrivalDate,
    trainName,
    trainNumber,
  } = getSessionStorage(pnrId) || {};

  /** 📸 Snapshot + Share */
  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const dataUrl = canvas.toDataURL("image/png");

      const caption = `🚆 PNR: ${pnrNumber}
Train: ${trainName} (${trainNumber})
From: ${boardingPoint} → ${destinationStation}
Date: ${convertTo24HrDateLabel(dateOfJourney)}

Check your PNR on our app 👉 https://yourapp.link`;

      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "pnr-details.png", { type: "image/png" });

        await navigator.share({
          title: `PNR ${pnrNumber}`,
          text: caption,
          files: [file],
        });
      } else {
        const whatsappText = encodeURIComponent(caption);
        window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div
      onClick={onClose}
      className={`fixed z-10 inset-0 flex justify-center bg-slate-200/55 items-center overflow-y-auto mx-auto h-full ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl mx-auto bg-white shadow transition-all w-10/12 lg:max-w-lg 
        ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        {/* 🔹 OLD UI → visible for live preview */}
        <div className="w-full relative h-fit mx-auto">
          {pnrNumber ? (
            <div>
              <h1 className="p-3 text-xl font-medium bg-green-500 rounded-t-md text-white">
                {pnrNumber}
              </h1>
              <div className="px-4 py-2 space-y-1">
                <p className="font-medium text-lg ">
                  {convertTo24HrDateLabel(dateOfJourney).slice(8)}
                </p>
                <p className="flex gap-2 items-center">
                  <span className="flex flex-col text-lg">
                    {boardingPoint}
                    <small className="opacity-65">
                      {convertTo24HrDateLabel(dateOfJourney)}
                    </small>
                  </span>
                  <HiArrowSmallRight size={30} />
                  <span className="flex flex-col text-lg">
                    {destinationStation}
                    <small className="opacity-65">
                      {convertTo24HrDateLabel(arrivalDate)}
                    </small>
                  </span>
                </p>

                <p className="font-medium opacity-65">
                  {trainName} ({trainNumber})
                </p>
                <p className="font-semibold">Current Status </p>
                <ul className="px-5 space-y-1 list-disc">
                  {passengerList?.map((data, index) => (
                    <li key={index} className="text-lg font-medium opacity-80">
                      {data.currentStatusDetails}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white m-3">
              <ShimmerThumbnail height={60} rounded />
              <ShimmerThumbnail height={20} rounded />
              <div className="flex gap-1 w-full">
                <ShimmerButton height={40} rounded />
                <ShimmerButton height={40} rounded />
              </div>
              <ShimmerThumbnail height={100} rounded />
              <div className="flex justify-end">
                <ShimmerButton />
              </div>
            </div>
          )}
        </div>

        {/* Buttons (not in screenshot) */}
        {pnrNumber && (
          <div className="flex justify-end gap-3 p-3">
            <button
              onClick={handleShare}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600"
            >
              Share
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 flex items-center gap-1"
            >
              <RiCloseFill size={20} /> Close
            </button>
          </div>
        )}

        {/* 🔹 NEW UI → hidden, only for screenshot */}
        {pnrNumber && (
          <div className="absolute -z-50 opacity-0 pointer-events-none">
            <div
              ref={cardRef}
              className="bg-white/95 rounded-2xl shadow-lg overflow-hidden w-[600px] p-0"
            >
              {/* Header with Logo */}
              <div className="flex items-center gap-3 content-center align-middle bg-green-600 p-4">
                <img
                  src="/192x192.jpg"
                  alt="App Logo"
                  className="w-8 h-8 inline-block bg-green-600"
                />
                <h1 className="text-lg font-semibold text-white">
                  Confirm Berth
                </h1>
              </div>

              <div className="px-6 py-5 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  🚆 PNR: {pnrNumber}
                </h2>
                <p className="text-lg text-gray-700">
                  {trainName} ({trainNumber})
                </p>
                <div className="flex justify-between items-center text-lg">
                  <div>
                    <p className="font-semibold">{boardingPoint}</p>
                    <small className="text-gray-500">
                      {convertTo24HrDateLabel(dateOfJourney)}
                    </small>
                  </div>
                  <HiArrowSmallRight size={28} className="text-gray-600" />
                  <div className="text-right">
                    <p className="font-semibold">{destinationStation}</p>
                    <small className="text-gray-500">
                      {convertTo24HrDateLabel(arrivalDate)}
                    </small>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Current Status
                  </p>
                  <ul className="space-y-2">
                    {passengerList?.map((data, index) => (
                      <li
                        key={index}
                        className="text-base font-medium text-gray-700"
                      >
                        {data.currentStatusDetails}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-100 text-center py-4 px-6 text-sm text-gray-600">
                📲 Check live PNR status on our app 👉{" "}
                <span className="font-semibold text-green-600">
                  confirm-berth.vercel.app
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

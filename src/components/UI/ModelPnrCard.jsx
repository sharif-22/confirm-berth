import { useRef } from "react";
import html2canvas from "html2canvas";
import { RiCloseFill } from "react-icons/ri";
import { PiShareFat } from "react-icons/pi";
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
    chartStatus,
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

Check your PNR on our app 👉 https://confirm-berth.vercel.app`;

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
      className={`fixed inset-0 z-10 mx-auto flex items-center justify-center bg-slate-200/55 ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`mx-auto w-10/12 rounded-xl bg-white shadow transition-all lg:max-w-lg ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        {/* 🔹 OLD UI → visible for live preview */}
        <div className="relative mx-auto h-fit w-full">
          {pnrNumber ? (
            <div>
              <h1 className="rounded-t-md bg-green-500 p-3 text-xl font-medium text-white">
                {pnrNumber}
              </h1>
              <div className="space-y-1 px-4 py-2">
                <p className="text-lg font-medium">
                  {convertTo24HrDateLabel(dateOfJourney).slice(8)}
                </p>
                <p className="flex items-center gap-2">
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
                <div className="flex items-baseline justify-between">
                  <p className="font-medium opacity-65">
                    {trainName} ({trainNumber})
                  </p>
                  <p className="text-sm font-medium opacity-65">
                    {chartStatus}
                  </p>
                </div>
                <p className="font-semibold">Current Status </p>
                <ul className="list-disc space-y-1 px-5">
                  {passengerList?.map((data, index) => (
                    <li key={index} className="text-lg font-medium opacity-80">
                      {data.currentStatusDetails}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="m-3 bg-white">
              <ShimmerThumbnail height={60} rounded />
              <ShimmerThumbnail height={20} rounded />
              <div className="flex w-full gap-1">
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
              className="flex items-center gap-1 rounded-md bg-green-500 px-4 py-1.5 text-white hover:bg-green-600"
            >
              <PiShareFat size={20} /> Share
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 rounded-md bg-red-500 px-4 py-1.5 text-white hover:bg-red-600"
            >
              <RiCloseFill size={20} /> Close
            </button>
          </div>
        )}

        {/* 🔹 NEW UI → hidden, only for screenshot */}
        {pnrNumber && (
          <div className="pointer-events-none absolute -z-50 opacity-0">
            <div
              ref={cardRef}
              className="w-[600px] overflow-hidden rounded-2xl bg-white/95 p-0 shadow-lg"
            >
              {/* Header with Logo */}
              <div className="flex content-center items-center gap-3 bg-green-600 p-4 align-middle">
                <img
                  src="/192x192.jpg"
                  alt="App Logo"
                  className="inline-block h-8 w-8 bg-green-600"
                />
                <h1 className="text-lg font-semibold text-white">
                  Confirm Berth
                </h1>
              </div>

              <div className="space-y-4 px-6 py-5">
                <h2 className="text-2xl font-bold text-gray-800">
                  🚆 PNR: {pnrNumber}
                </h2>
                {/* <p className="text-lg text-gray-700">
                  {trainName} ({trainNumber})
                </p> */}
                <div className="flex items-baseline justify-between">
                  <p className="font-medium opacity-65">
                    {trainName} ({trainNumber})
                  </p>
                  <p className="text-sm font-medium opacity-65">
                    {chartStatus}
                  </p>
                </div>

                <div className="flex items-center justify-between text-lg">
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
                  <p className="mb-2 font-semibold text-gray-800">
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

              <div className="bg-gray-100 px-6 py-4 text-center text-sm text-gray-600">
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

import { RiCloseFill } from "react-icons/ri";
import { getSessionStorage } from "../../helpers/LocalStorage";
import { formatDate, formatTime } from "../../helpers/dayjs";
import { HiArrowSmallRight } from "react-icons/hi2";

export default function ModalPnrCard({ open, onClose, pnrId }) {
  const { passengerInfo, id, boardingInfo, destinationInfo, trainInfo } =
    getSessionStorage(pnrId);

  return (
    // backdrop
    <div
      onClick={onClose}
      className={`fixed z-10 inset-0 flex justify-center bg-slate-200/55 items-center overflow-y-auto mx-auto h-full ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()} // e.stopPropagation() is used stop event bubling
        className={`
              rounded-xl mx-auto bg-white shadow transition-all w-10/12 lg:max-w-lg 
              ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
      >
        <div className="w-full relative  h-fit mx-auto">
          {/* current status Details */}
          <div>
            <h1 className="p-3 text-xl font-medium bg-green-500 rounded-t-md text-white">
              {id}
            </h1>
            <div className="px-4 py-2 space-y-1">
              <p className="font-medium text-lg ">
                {formatDate(trainInfo?.dt)}
              </p>
              <p className="flex gap-2 items-center">
                <span className="flex flex-col text-lg">
                  {boardingInfo?.stationName}
                  <small className="opacity-65">
                    {formatTime(boardingInfo?.arrivalTime)}
                  </small>
                </span>
                <HiArrowSmallRight size={30} />
                <span className="flex flex-col text-lg">
                  {destinationInfo?.stationName}
                  <small className="opacity-65">
                    {formatTime(destinationInfo?.arrivalTime)}
                  </small>
                </span>
              </p>

              <p className="font-medium opacity-65">
                {trainInfo?.name} ({trainInfo?.trainNo})
              </p>
              <p className="font-semibold">Current Status </p>
              <ol className="list-decimal px-5 space-y-1">
                {passengerInfo?.map((data, index) => (
                  <li key={index} className="text-lg font-medium opacity-80">
                    {data.currentCoach}, {data.currentBerthNo}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {/* button to close Model  */}
          <button
            onClick={onClose}
            className="absolute bottom-2 right-2 text-white font-medium group"
          >
            <div className="flex gap-1 items-center bg-green-500 p-2 rounded-md">
              <p className="group-hover:text-red-500 delay-200 ease-linear transition-all">
                Close
              </p>

              <RiCloseFill
                className="bg-green-500 group-hover:text-red-500 delay-200 ease-linear transition-all font-bold"
                size={22}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

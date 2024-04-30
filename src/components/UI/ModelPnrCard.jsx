import { RiCloseFill } from "react-icons/ri";
import { getSessionStorage } from "../../helpers/LocalStorage";

export default function ModalPnrCard({ open, onClose, pnrId }) {
  const currentStatus = getSessionStorage(pnrId);

  return (
    // backdrop
    <div
      onClick={onClose}
      className={`fixed z-10 inset-0 md:flex justify-center bg-slate-200/25 items-center overflow-y-auto w-11/12 mx-auto my-28 h-full ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()} // e.stopPropagation() is used stop event bubling
        className={`
              rounded-xl bg-white shadow transition-all sm:min-w-80 lg:min-w-[35%] h-3/4
              ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
      >
        <div className="w-full relative  h-1/2">
          <div>{pnrId}</div>
          {currentStatus.map((data, index) => (
            <li key={index}>
              {data.currentCoach}, {data.currentBerthNo}
            </li>
          ))}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white font-medium group"
          >
            <div className="flex gap-1 items-center bg-green-500 p-2 rounded-md">
              <p>Close</p>
              <div>
                <RiCloseFill className="bg-green-500 group-hover:text-red-500 font-bold" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

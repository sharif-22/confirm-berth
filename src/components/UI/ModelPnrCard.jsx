import { RiCloseFill } from "react-icons/ri";

export default function ModalPnrCard({ open, onClose }) {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`fixed z-10 inset-0 flex justify-center bg-slate-200/25 items-center overflow-y-auto w-full h-full ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()} // e.stopPropagation() is used stop event bubling
        className={`
              rounded-xl bg-white shadow transition-all min-w-80 max-w-7xl h-3/4
              ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
            `}
      >
        <div className="w-full relative  h-1/2">
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

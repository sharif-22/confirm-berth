import React from "react";
import { formatDate, formatTime } from "../../helpers/dayjs";

const MiniCard = ({ data, openModel }) => {
  const { boardingInfo, id, destinationInfo, trainInfo } = data;

  return (
    <section
      onClick={openModel}
      className="bg-slate-200 w-11/12 lg:max-w-5xl mx-auto my-2 p-3 rounded flex justify-between hover:shadow-lg duration-300 transition-all cursor-pointer"
    >
      <div className="space-y-2">
        <p className="font-semibold text-lg">
          {trainInfo.name} ({trainInfo.trainNo})
        </p>
        <div className="flex flex-col gap-1 font-medium opacity-85">
          <small>
            {boardingInfo.stationName} : {formatTime(boardingInfo.arrivalTime)}
          </small>

          <small>
            {destinationInfo.stationName} :{" "}
            {formatTime(destinationInfo.arrivalTime)}
          </small>
        </div>
        <p className="font-semibold pnr">PNR - {id}</p>
      </div>
      <p className="font-semibold text-lg">{formatDate(trainInfo.dt)}</p>
    </section>
  );
};

export default MiniCard;

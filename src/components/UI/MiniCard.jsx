import React from "react";

const MiniCard = ({
  boardingStation,
  boardingTime,
  destinationStation,
  destinationTime,
  trainName,
  trainNum,
  pnr,
  travelDate,
  openModel,
}) => {
  return (
    <div
      onClick={openModel}
      className="bg-slate-200 w-11/12 lg:max-w-5xl mx-auto my-2 p-3 rounded flex justify-between"
    >
      <div className="space-y-2">
        <p className="font-semibold text-lg">
          {trainName} ({trainNum})
        </p>
        <div className="flex flex-col gap-1 font-medium opacity-85">
          <small>
            {boardingStation} : {boardingTime}
          </small>

          <small>
            {destinationStation} : {destinationTime}
          </small>
        </div>
        <p className="font-semibold">PNR-{pnr}</p>
      </div>
      <p className="font-semibold text-lg">{travelDate}</p>
    </div>
  );
};

export default MiniCard;

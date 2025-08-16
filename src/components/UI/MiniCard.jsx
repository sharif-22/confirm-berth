import React from "react";
import {
  formatDate,
  formatTime,
  convertTo24HrDateLabel,
} from "../../helpers/dayjs";

const MiniCard = ({ data, openModel }) => {
  // const { boardingInfo, id, destinationInfo, trainInfo } = data;
  const {
    trainName,
    trainNumber,
    sourceStation,
    dateOfJourney,
    destinationStation,
    arrivalDate,
    pnrNumber,
  } = data;

  return (
    <section
      onClick={openModel}
      className="bg-slate-200 w-11/12 lg:max-w-5xl mx-auto my-2 p-3 rounded flex justify-between hover:shadow-lg duration-300 transition-all cursor-pointer"
    >
      <div className="space-y-2">
        <p className="font-semibold text-lg">
          {trainName} ({trainNumber})
        </p>
        <div className="flex flex-col gap-1 font-medium opacity-85">
          <small>
            {sourceStation} : {convertTo24HrDateLabel(dateOfJourney)}
          </small>

          <small>
            {destinationStation} : {convertTo24HrDateLabel(arrivalDate)}
          </small>
        </div>
        <p className="font-semibold pnr">PNR - {pnrNumber}</p>
      </div>
      <p className="font-semibold text-lg">
        {convertTo24HrDateLabel(dateOfJourney)}
      </p>
    </section>
  );
};

export default MiniCard;

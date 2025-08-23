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
      className="mx-auto my-2 flex w-11/12 cursor-pointer justify-between rounded bg-slate-200 p-3 transition-all duration-300 hover:shadow-lg lg:max-w-5xl"
    >
      <div className="space-y-2">
        <p className="text-lg font-semibold">
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
        <p className="pnr font-semibold">PNR - {pnrNumber}</p>
      </div>
      <p className="text-lg font-semibold">
        {convertTo24HrDateLabel(dateOfJourney)}
      </p>
    </section>
  );
};

export default MiniCard;

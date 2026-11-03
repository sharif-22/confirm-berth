import { forwardRef } from "react";
import { fmtFull, fmtTime } from "../../lib/date";
import { passengerStatus, STATUS } from "../../lib/status";

const toneHex = { green: "#047857", amber: "#b45309", red: "#be123c", zinc: "#52525b" };

/** Off-screen card that html2canvas turns into the shared image. Inline colours keep it identical in light/dark mode. */
const ShareCard = forwardRef(function ShareCard({ trip }, ref) {
  const from = trip.boardingPoint || trip.sourceStation;
  const to = trip.destinationStation || trip.reservationUpto;
  return (
    <div style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }} aria-hidden="true">
      <div ref={ref} style={{ width: 600, background: "#ffffff", color: "#18181b", fontFamily: "inherit", borderRadius: 24, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#10b981,#047857)", color: "#fff", padding: "20px 28px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>Confirm Berth · PNR status</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 2, marginTop: 4 }}>{trip.pnrNumber}</div>
          <div style={{ fontSize: 15, marginTop: 4, opacity: 0.95 }}>
            {trip.trainName} ({trip.trainNumber}) · {fmtFull(trip.dateOfJourney)}
          </div>
        </div>
        <div style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{from}</div>
            <div style={{ fontSize: 14, color: "#71717a" }}>{fmtTime(trip.dateOfJourney)}</div>
          </div>
          <div style={{ flex: 1, margin: "0 20px", borderTop: "2px dashed #d4d4d8" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{to}</div>
            <div style={{ fontSize: 14, color: "#71717a" }}>{fmtTime(trip.arrivalDate)}</div>
          </div>
        </div>
        <div style={{ padding: "0 28px 22px" }}>
          {(trip.passengerList || []).map((p, i) => {
            const k = passengerStatus(p);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #f4f4f5", fontSize: 16 }}>
                <span style={{ color: "#52525b" }}>Passenger {p.passengerSerialNumber || i + 1}</span>
                <span style={{ fontWeight: 700, color: toneHex[STATUS[k].tone] }}>{p.currentStatusDetails || STATUS[k].label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ background: "#f4f4f5", padding: "14px 28px", fontSize: 13, color: "#52525b", display: "flex", justifyContent: "space-between" }}>
          <span>Chart: {trip.chartStatus || "—"}</span>
          <span style={{ fontWeight: 700, color: "#047857" }}>confirm-berth.vercel.app</span>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;

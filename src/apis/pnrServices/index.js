import axios from "axios";
import baseUrl from "../constant";

const pnrServiceInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

export const getPNRStatus = async (pnrNumber) => {
  try {
    const response = await pnrServiceInstance.get(`/pnrstatus/${pnrNumber}`, {
      withCredentials: true,
    });
    // console.log("Response from PNR status API:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching PNR status:", error);
    throw error;
  }
};

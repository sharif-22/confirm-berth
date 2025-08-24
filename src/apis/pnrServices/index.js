import axios from "axios";
import baseUrl from "../constant";
import { toast } from "react-toastify";

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
    console.log(error);
    if (error?.status === 429) {
      toast.error(error?.response?.data?.message);
    }

    console.error("Error fetching PNR status:", error);
    throw error;
  }
};

export const getSavedPnr = async () => {
  try {
    const response = await pnrServiceInstance.get(`/savedpnr`, {
      withCredentials: true,
    });
    // console.log("Response from PNR status API:", response);
    return response.data;
  } catch (error) {
    console.log(error);

    console.error("Error while retriving PNR data:", error);
    throw error;
  }
};

getSavedPnr();

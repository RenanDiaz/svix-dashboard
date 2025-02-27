import axios from "axios";
import { Application, Endpoint } from "../types";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_SVIX_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_SVIX_API_TOKEN}`,
  },
});

interface ApplicationsResponse {
  data: Application[];
  iterator: string;
  prevIterator: string;
  done: boolean;
}

export const getApplications = (): Promise<ApplicationsResponse> => {
  return apiClient
    .get("/api/v1/app")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching applications", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
    });
};

interface EndpointsResponse {
  data: Endpoint[];
  iterator: string;
  prevIterator: string;
  done: boolean;
}

export const getEndpoints = (applicationId: string): Promise<EndpointsResponse> => {
  return apiClient
    .get(`/api/v1/app/${applicationId}/endpoint`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching endpoints", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
    });
};

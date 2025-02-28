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

export const getApplication = (applicationId: string): Promise<Application> => {
  return apiClient
    .get(`/api/v1/app/${applicationId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching application", error);
      return null;
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

export const deleteEndpoint = (applicationId: string, endpointId: string): Promise<void> => {
  return apiClient
    .delete(`/api/v1/app/${applicationId}/endpoint/${endpointId}`)
    .then(() => {})
    .catch((error) => {
      console.error("Error deleting endpoint", error);
    });
};

import axios from "axios";
import { Application, Attempt, Endpoint, Message } from "../types";

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

export const getEndpoint = (endpointId: string): Promise<Endpoint> => {
  return apiClient
    .get(`/api/v1/endpoint/${endpointId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching endpoint", error);
      return null;
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

interface MessagesResponse {
  data: Message[];
  iterator: string;
  prevIterator: string;
  done: boolean;
}

export const getMessages = (applicationId: string): Promise<MessagesResponse> => {
  return apiClient
    .get(`/api/v1/app/${applicationId}/msg`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching messages", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
    });
};

export const getMessage = (messageId: string): Promise<Message> => {
  return apiClient
    .get(`/api/v1/msg/${messageId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching message", error);
      return null;
    });
};

interface AttemptsResponse {
  data: Attempt[];
  iterator: string;
  prevIterator: string;
  done: boolean;
}

export const getAttemptsByMessage = (
  applicationId: string,
  messageId: string
): Promise<AttemptsResponse> => {
  return apiClient
    .get(`/api/v1/app/${applicationId}/attempt/msg/${messageId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching attempts", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
    });
};

export const getAttemptsByEndpoint = (
  applicationId: string,
  endpointId: string
): Promise<AttemptsResponse> => {
  return apiClient
    .get(`/api/v1/app/${applicationId}/attempt/endpoint/${endpointId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching attempts", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
    });
};

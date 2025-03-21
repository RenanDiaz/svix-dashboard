import axios from "axios";
import {
  Application,
  Attempt,
  AttemptWithMessage,
  Endpoint,
  EndpointStats,
  EventType,
  Message,
} from "../types";

const {
  REACT_APP_SVIX_API_TOKEN,
  REACT_APP_SVIX_API_SCHEME,
  REACT_APP_SVIX_API_HOST,
  REACT_APP_SVIX_API_PORT,
} = process.env;

const hostname = REACT_APP_SVIX_API_HOST || window.location;

const domain = `${REACT_APP_SVIX_API_SCHEME}://${hostname}${
  REACT_APP_SVIX_API_PORT ? `:${REACT_APP_SVIX_API_PORT}` : ""
}`;

const apiClient = axios.create({
  baseURL: domain,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${REACT_APP_SVIX_API_TOKEN}`,
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

export const createApplication = (name: string): Promise<Application> => {
  return apiClient
    .post("/api/v1/app", { name })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating application", error);
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

export const getEndpoint = (applicationId: string, endpointId: string): Promise<Endpoint> => {
  return apiClient.get(`/api/v1/app/${applicationId}/endpoint/${endpointId}`).then((response) => {
    if (response.status === 200) return response.data;
    throw new Error(response.statusText);
  });
};

interface EndpointPayload {
  description: string;
  url: string;
  disabled?: boolean;
  metadata?: Record<string, any>;
  filterTypes?: string[];
  channels?: string[];
  rateLimit?: {
    window: number;
    limit: number;
  };
}

export const createEndpoint = (
  applicationId: string,
  endpoint: EndpointPayload
): Promise<Endpoint> => {
  return apiClient.post(`/api/v1/app/${applicationId}/endpoint`, endpoint).then((response) => {
    if (response.status === 201) return response.data;
    throw new Error(response.statusText);
  });
};

export const editEndpoint = (
  applicationId: string,
  endpointId: string,
  endpoint: EndpointPayload
): Promise<Endpoint> => {
  return apiClient
    .patch(`/api/v1/app/${applicationId}/endpoint/${endpointId}`, endpoint)
    .then((response) => {
      if (response.status === 200) return response.data;
      throw new Error(response.statusText);
    });
};

export const disableEndpoint = (applicationId: string, endpointId: string): Promise<Endpoint> => {
  return apiClient
    .patch(`/api/v1/app/${applicationId}/endpoint/${endpointId}`, { disabled: true })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error disabling endpoint", error);
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
  return apiClient.get(`/api/v1/msg/${messageId}`).then((response) => {
    if (response.status === 200) return response.data;
    throw new Error(response.statusText);
  });
};

export const createMessage = (
  applicationId: string,
  eventType: string,
  payload: Record<string, unknown>,
  channels?: string[]
): Promise<Message> => {
  return apiClient
    .post(`/api/v1/app/${applicationId}/msg`, { eventType, payload, channels })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating message", error);
      return null;
    });
};

export const getMessagesByEndpoint = (
  applicationId: string,
  endpointId: string
): Promise<MessagesResponse> => {
  return apiClient
    .get(`/api/v1/app/${applicationId}/endpoint/${endpointId}/msg`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching messages", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
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

interface AttemptsWithMessageResponse {
  data: AttemptWithMessage[];
  iterator: string;
  prevIterator: string;
  done: boolean;
  message: Message;
}

export const getAttemptsByEndpoint = (
  applicationId: string,
  endpointId: string
): Promise<AttemptsWithMessageResponse> => {
  const searchParams = new URLSearchParams({ with_msg: "true" });
  return apiClient
    .get(`/api/v1/app/${applicationId}/attempt/endpoint/${endpointId}?${searchParams}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching attempts", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
    });
};

interface EventTypesResponse {
  data: EventType[];
  iterator: string;
  prevIterator: string;
  done: boolean;
}

export const getEventTypes = (): Promise<EventTypesResponse> => {
  return apiClient
    .get("/api/v1/event-type")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching event types", error);
      return { data: [], iterator: "", prevIterator: "", done: true };
    });
};

export const getEventType = (eventTypeName: string): Promise<EventType> => {
  return apiClient
    .get(`/api/v1/event-type/${eventTypeName}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching event type", error);
      return null;
    });
};

interface EventTypePayload {
  name: string;
  description?: string;
  archived?: boolean;
  deprecated?: boolean;
  featureFlag?: string;
  schemas?: Record<string, unknown>;
}

export const createEventType = (eventType: EventTypePayload): Promise<EventType> => {
  return apiClient
    .post("/api/v1/event-type", eventType)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating event type", error);
      return null;
    });
};

export const editEventType = (
  eventTypeName: string,
  eventType: EventTypePayload
): Promise<EventType> => {
  return apiClient
    .patch(`/api/v1/event-type/${eventTypeName}`, eventType)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error editing event type", error);
      return null;
    });
};

export const deleteEventType = (eventTypeName: string): Promise<void> => {
  return apiClient
    .delete(`/api/v1/event-type/${eventTypeName}`)
    .then(() => {})
    .catch((error) => {
      console.error("Error deleting event type", error);
    });
};

export const getEndpointStats = (
  applicationId: string,
  endpointId: string
): Promise<EndpointStats> => {
  return apiClient
    .get(`/api/v1/app/${applicationId}/endpoint/${endpointId}/stats`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching endpoint stats", error);
      return null;
    });
};

interface ResendMessageResponse {
  success: boolean;
  message?: string;
}

export const resendMessage = (
  applicationId: string,
  endpointId: string,
  messageId: string
): Promise<ResendMessageResponse> => {
  return apiClient
    .post<void>(`/api/v1/app/${applicationId}/msg/${messageId}/endpoint/${endpointId}/resend`)
    .then((response) => {
      if (response.status === 202) {
        return { success: true };
      }
      throw new Error(response.statusText);
    })
    .catch((error) => {
      console.error("Error resending message", error);
      const responseBody = error.response?.data;
      if (responseBody && "code" in responseBody && "detail" in responseBody) {
        return { success: false, message: responseBody.detail };
      }
      return { success: false, message: error.message };
    });
};

interface RecoverEndpointResponse {
  id: string;
  status: string;
  task: string;
}

export const recoverEndpoint = (
  applicationId: string,
  endpointId: string,
  since: string,
  until: string
): Promise<ResendMessageResponse> => {
  return apiClient
    .post<RecoverEndpointResponse>(`/api/v1/app/${applicationId}/endpoint/${endpointId}/recover`, {
      since,
      until,
    })
    .then((response) => {
      if (response.status === 202) {
        return response.data;
      }
      throw new Error(response.statusText);
    })
    .then((response) => {
      if (response.status === "running") {
        return { success: true };
      }
      throw new Error(response.status);
    })
    .catch((error) => {
      console.error("Error recovering endpoint", error);
      const responseBody = error.response?.data;
      if (responseBody && "code" in responseBody && "detail" in responseBody) {
        return { success: false, message: responseBody.detail };
      }
      return { success: false, message: error.message };
    });
};

interface ReplayMissingResponse {
  id: string;
  status: string;
  task: string;
}

export const replayMissing = (
  applicationId: string,
  endpointId: string,
  since: string,
  until: string
): Promise<ResendMessageResponse> => {
  return apiClient
    .post<ReplayMissingResponse>(
      `/api/v1/app/${applicationId}/endpoint/${endpointId}/replay-missing`,
      { since, until }
    )
    .then((response) => {
      if (response.status === 202) {
        return response.data;
      }
      throw new Error(response.statusText);
    })
    .then((response) => {
      if (response.status === "running") {
        return { success: true };
      }
      throw new Error(response.status);
    })
    .catch((error) => {
      console.error("Error replaying missing", error);
      const responseBody = error.response?.data;
      if (responseBody && "code" in responseBody && "detail" in responseBody) {
        return { success: false, message: responseBody.detail };
      }
      return { success: false, message: error.message };
    });
};

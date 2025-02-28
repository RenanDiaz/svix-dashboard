export interface Application {
  id: string;
  name: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
}

export interface Endpoint {
  id: string;
  url: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  disabled: boolean;
  metadata: Record<string, any>;
  filterTypes: string[] | null;
  channels: string[] | null;
  rateLimit: {
    window: number;
    limit: number;
  } | null;
  uid: string | null;
}

export interface Message {
  eventId: string;
  eventType: string;
  payload: object;
  channels: string[];
  id: string;
  timestamp: string;
}

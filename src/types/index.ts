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
  channels?: string[];
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
  channels?: string[];
  id: string;
  timestamp: string;
  status?: 0 | 1 | 2 | 3;
  nextAttempt?: string;
}

export interface Attempt {
  url: string;
  response: string;
  responseStatusCode: number;
  responseDurationMs: number;
  status: 0 | 1 | 2 | 3;
  triggerType: 0 | 1;
  msgId: string;
  endpointId: string;
  id: string;
  timestamp: string;
}

export interface AttemptWithMessage extends Attempt {
  msg: Message;
}

export interface EventType {
  name: string;
  description: string;
  archived: boolean;
  deprecated: boolean;
  schemas?: object;
  createdAt: string;
  updatedAt: string;
  featureFlag?: string;
}

export interface EndpointStats {
  success: number;
  pending: number;
  sending: number;
  fail: number;
}

// src/types/index.ts

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
  applicationId: string;
  createdAt: string;
  updatedAt: string;
}

// src/pages/Endpoints.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col, Button, Input, InputGroup, Form, FormGroup, Label } from "reactstrap";
import EndpointsList from "../components/Endpoints/EndpointsList";
import { Endpoint, Application } from "../types";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// Mock data for demonstration
const mockEndpoints: Endpoint[] = [
  {
    id: "1",
    url: "https://api.example.com/webhook1",
    description: "Order processing webhook",
    version: 1,
    applicationId: "1",
    createdAt: "2023-01-20T11:30:00Z",
    updatedAt: "2023-02-25T15:45:00Z",
  },
  {
    id: "2",
    url: "https://events.myapp.io/notifications",
    description: "User notifications endpoint",
    version: 2,
    applicationId: "1",
    createdAt: "2023-03-10T09:20:00Z",
    updatedAt: "2023-03-15T14:10:00Z",
  },
  {
    id: "3",
    url: "https://webhook.site/123456789",
    description: "Test endpoint for debugging",
    version: 1,
    applicationId: "2",
    createdAt: "2023-04-15T16:40:00Z",
    updatedAt: "2023-04-20T08:30:00Z",
  },
];

// Mock applications for the filter
const mockApplications: Application[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    uid: "app_1a2b3c4d",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-02-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Marketing Dashboard",
    uid: "app_5e6f7g8h",
    createdAt: "2023-03-05T09:15:00Z",
    updatedAt: "2023-03-10T11:45:00Z",
  },
];

const Endpoints: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<string>("");

  useEffect(() => {
    // In a real application, these would be API calls
    setEndpoints(mockEndpoints);
    setApplications(mockApplications);
  }, []);

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesApp = selectedApp ? endpoint.applicationId === selectedApp : true;

    return matchesSearch && matchesApp;
  });

  return (
    <div>
      <PageHeader>
        <h1>Endpoints</h1>
        <Button color="primary">Create Endpoint</Button>
      </PageHeader>

      <FilterWrapper>
        <FormGroup style={{ width: "300px" }}>
          <Input
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormGroup>

        <FormGroup style={{ width: "300px" }}>
          <Input type="select" value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}>
            <option value="">All Applications</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </Input>
        </FormGroup>
      </FilterWrapper>

      <Row>
        <Col>
          <EndpointsList endpoints={filteredEndpoints} applications={applications} />
        </Col>
      </Row>
    </div>
  );
};

export default Endpoints;

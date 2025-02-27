// src/pages/Applications.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Row, Col, Button, Input, InputGroup } from "reactstrap";
import ApplicationsList from "../components/Applications/ApplicationsList";
import { Application } from "../types";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  width: 300px;
`;

// Mock data for demonstration
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
  {
    id: "3",
    name: "Customer Support Portal",
    uid: "app_9i0j1k2l",
    createdAt: "2023-04-12T16:20:00Z",
    updatedAt: "2023-04-18T08:55:00Z",
  },
];

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll use mock data
    setApplications(mockApplications);
  }, []);

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader>
        <h1>Applications</h1>
        <div className="d-flex">
          <SearchWrapper className="me-2">
            <InputGroup>
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </SearchWrapper>
          <Button color="primary">Create Application</Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <ApplicationsList applications={filteredApplications} />
        </Col>
      </Row>
    </div>
  );
};

export default Applications;

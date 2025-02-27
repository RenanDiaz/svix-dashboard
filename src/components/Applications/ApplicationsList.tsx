// src/components/Applications/ApplicationsList.tsx
import React from "react";
import styled from "styled-components";
import { Row, Col } from "reactstrap";
import ApplicationCard from "./ApplicationCard";
import { Application } from "../../types";

interface ApplicationsListProps {
  applications: Application[];
}

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const ApplicationsList: React.FC<ApplicationsListProps> = ({ applications }) => {
  if (applications.length === 0) {
    return (
      <EmptyState>
        <h3>No applications found</h3>
        <p>Create your first application to get started.</p>
      </EmptyState>
    );
  }

  return (
    <Row>
      {applications.map((application) => (
        <Col key={application.id} md={6} lg={4} className="mb-4">
          <ApplicationCard application={application} />
        </Col>
      ))}
    </Row>
  );
};

export default ApplicationsList;

// src/components/Endpoints/EndpointsList.tsx
import React from "react";
import styled from "styled-components";
import { Table, Badge } from "reactstrap";
import { Endpoint, Application } from "../../types";
import EndpointCard from "./EndpointCard";

interface EndpointsListProps {
  endpoints: Endpoint[];
  applications: Application[];
}

const TableWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const StyledTable = styled(Table)`
  margin-bottom: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EndpointsList: React.FC<EndpointsListProps> = ({ endpoints, applications }) => {
  if (endpoints.length === 0) {
    return (
      <EmptyState>
        <h3>No endpoints found</h3>
        <p>Create your first endpoint to get started.</p>
      </EmptyState>
    );
  }

  const getApplicationName = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    return app ? app.name : "Unknown Application";
  };

  return (
    <CardsContainer>
      {endpoints.map((endpoint) => (
        <EndpointCard
          key={endpoint.id}
          endpoint={endpoint}
          applicationName={getApplicationName(endpoint.applicationId)}
        />
      ))}
    </CardsContainer>
  );
};

export default EndpointsList;

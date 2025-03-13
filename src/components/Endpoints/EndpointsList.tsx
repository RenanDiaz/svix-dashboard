import { FC } from "react";
import styled from "styled-components";
import { Endpoint, Application } from "../../types";
import EndpointCard from "./EndpointCard";

interface EndpointsListProps {
  endpoints: Endpoint[];
  alreadyFetched: boolean;
  application?: Application;
  updateEndpoints: () => void;
}

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

const EndpointsList: FC<EndpointsListProps> = ({
  endpoints,
  alreadyFetched,
  application,
  updateEndpoints,
}) => {
  if (!alreadyFetched) {
    return (
      <EmptyState>
        <h3>Loading...</h3>
      </EmptyState>
    );
  }

  if (endpoints.length === 0) {
    return (
      <EmptyState>
        <h3>No endpoints found</h3>
        <p>Create your first endpoint to get started.</p>
      </EmptyState>
    );
  }

  return (
    <CardsContainer>
      {endpoints.map((endpoint) => (
        <EndpointCard
          key={endpoint.id}
          endpoint={endpoint}
          application={application}
          updateEndpoints={updateEndpoints}
        />
      ))}
    </CardsContainer>
  );
};

export default EndpointsList;

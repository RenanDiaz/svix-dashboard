import { FC } from "react";
import styled from "styled-components";
import { EventType } from "../../types";
import EventTypeCard from "./EventTypeCard";

interface EventTypesListProps {
  eventTypes: EventType[];
  alreadyFetched: boolean;
  updateEventTypes: () => void;
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

const EventTypesList: FC<EventTypesListProps> = ({
  eventTypes,
  alreadyFetched,
  updateEventTypes,
}) => {
  if (!alreadyFetched) {
    return (
      <EmptyState>
        <h3>Loading...</h3>
      </EmptyState>
    );
  }

  if (eventTypes.length === 0) {
    return (
      <EmptyState>
        <h3>No event types found</h3>
        <p>Create your first event type to get started.</p>
      </EmptyState>
    );
  }

  return (
    <CardsContainer>
      {eventTypes.map((eventType) => (
        <EventTypeCard
          key={eventType.name}
          eventType={eventType}
          updateEventTypes={updateEventTypes}
        />
      ))}
    </CardsContainer>
  );
};

export default EventTypesList;

import { FC } from "react";
import styled from "styled-components";
import { Application, Attempt } from "../../types";
import AttemptCard from "./AttemptCard";

interface AttemptsListProps {
  attempts: Attempt[];
  application?: Application;
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

const AttemptsList: FC<AttemptsListProps> = ({ attempts, application }) => {
  if (attempts.length === 0) {
    return (
      <EmptyState>
        <h3>No attempts found</h3>
      </EmptyState>
    );
  }

  return (
    <CardsContainer>
      {attempts.map((attempt) => (
        <AttemptCard key={attempt.id} attempt={attempt} application={application} />
      ))}
    </CardsContainer>
  );
};

export default AttemptsList;

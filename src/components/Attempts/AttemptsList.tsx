import { FC, useState } from "react";
import styled from "styled-components";
import { Attempt } from "../../types";
import AttemptCard from "./AttemptCard";
import AttemptCardPlaceholder from "./AttemptCardPlaceholder";

interface AttemptsListProps {
  attempts: Attempt[];
  isLoading: boolean;
}

export enum HighlightType {
  None,
  Message,
  Endpoint,
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

const AttemptsList: FC<AttemptsListProps> = ({ attempts, isLoading }) => {
  const [highlightType, setHighlightType] = useState<HighlightType>(HighlightType.None);
  const [highlightedText, setHighlightedText] = useState<string>("");

  const toggleHighlight = (type: HighlightType, text: string) => {
    if (highlightType === type && highlightedText === text) {
      setHighlightType(HighlightType.None);
      setHighlightedText("");
    } else {
      setHighlightType(type);
      setHighlightedText(text);
    }
  };

  if (attempts.length === 0) {
    return (
      <EmptyState>
        <h3>No attempts found</h3>
      </EmptyState>
    );
  }

  return (
    <CardsContainer>
      {attempts.length === 0 && isLoading ? (
        <AttemptCardPlaceholder />
      ) : (
        attempts.map((attempt) => (
          <AttemptCard
            key={attempt.id}
            attempt={attempt}
            highlitedType={highlightType}
            highlightedText={highlightedText}
            toggleHighlight={toggleHighlight}
          />
        ))
      )}
    </CardsContainer>
  );
};

export default AttemptsList;

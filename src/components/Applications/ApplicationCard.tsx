// src/components/Applications/ApplicationCard.tsx
import React from "react";
import styled from "styled-components";
import { Card, CardBody, CardTitle, CardSubtitle, Button } from "reactstrap";
import { Application } from "../../types";

interface ApplicationCardProps {
  application: Application;
}

const StyledCard = styled(Card)`
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease-in-out;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ApplicationUid = styled.div`
  font-family: monospace;
  background-color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DateInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <StyledCard>
      <CardBody>
        <CardTitle tag="h5">{application.name}</CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          ID: {application.id}
        </CardSubtitle>

        <ApplicationUid>{application.uid}</ApplicationUid>

        <DateInfo>Created: {formatDate(application.createdAt)}</DateInfo>
        <DateInfo>Updated: {formatDate(application.updatedAt)}</DateInfo>

        <CardActions>
          <Button color="primary" outline size="sm">
            View Details
          </Button>
          <Button color="danger" outline size="sm">
            Delete
          </Button>
        </CardActions>
      </CardBody>
    </StyledCard>
  );
};

export default ApplicationCard;

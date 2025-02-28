import { FC } from "react";
import styled from "styled-components";
import { Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";
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

const ApplicationCard: FC<ApplicationCardProps> = ({ application }) => {
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
          <LinkContainer to={`/applications/${application.id}/endpoints`}>
            <Button color="primary" outline size="sm">
              View Endpoints
            </Button>
          </LinkContainer>
          <LinkContainer to={`/applications/${application.id}/messages`}>
            <Button color="primary" outline size="sm">
              View Messages
            </Button>
          </LinkContainer>
          <Button color="danger" outline size="sm">
            Delete
          </Button>
        </CardActions>
      </CardBody>
    </StyledCard>
  );
};

export default ApplicationCard;

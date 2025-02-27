import { FC } from "react";
import styled from "styled-components";
import { Badge, Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { Endpoint } from "../../types";

interface EndpointCardProps {
  endpoint: Endpoint;
  applicationName: string;
}

const StyledCard = styled(Card)`
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const EndpointUrl = styled.div`
  font-family: monospace;
  background-color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-all;
`;

const DateInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AppBadge = styled(Badge)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EndpointCard: FC<EndpointCardProps> = ({ endpoint, applicationName }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <StyledCard>
      <CardBody>
        <CardTitle tag="h5">{endpoint.description}</CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          ID: {endpoint.id}
        </CardSubtitle>

        <AppBadge color="info">{applicationName}</AppBadge>

        <EndpointUrl>{endpoint.url}</EndpointUrl>

        <div className="mb-3">
          <Badge color="secondary">Version {endpoint.version}</Badge>
        </div>

        <DateInfo>Created: {formatDate(endpoint.createdAt)}</DateInfo>
        <DateInfo>Updated: {formatDate(endpoint.updatedAt)}</DateInfo>

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

export default EndpointCard;

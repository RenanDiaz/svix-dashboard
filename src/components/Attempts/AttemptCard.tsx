import { FC } from "react";
import { Application, Attempt } from "../../types";
import { Badge, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import styled from "styled-components";

interface AttemptCardProps {
  attempt: Attempt;
  application?: Application;
}

const StyledCard = styled(Card)`
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
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

const ResponseBody = styled.pre`
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

const AttemptCard: FC<AttemptCardProps> = ({ attempt, application }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <StyledCard>
      <CardBody>
        <CardTitle tag="h5">Endpoint: {attempt.endpointId}</CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          ID: {attempt.id}
        </CardSubtitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          Message ID: {attempt.msgId}
        </CardSubtitle>

        <AppBadge color="info">{application?.name}</AppBadge>

        <EndpointUrl>{attempt.url}</EndpointUrl>
        <EndpointUrl>HTTP {attempt.responseStatusCode}</EndpointUrl>
        <ResponseBody>{JSON.stringify(JSON.parse(attempt.response), null, 2)}</ResponseBody>

        <DateInfo>Timestamp: {formatDate(attempt.timestamp)}</DateInfo>
      </CardBody>
    </StyledCard>
  );
};

export default AttemptCard;

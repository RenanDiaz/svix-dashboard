import { FC } from "react";
import styled from "styled-components";
import { Card, CardBody, CardTitle, Button, Badge } from "reactstrap";
import { Application, Message } from "../../types";
import { LinkContainer } from "react-router-bootstrap";
import { channelNames, getStatusInfo } from "../../globals/utils";

interface MessageCardProps {
  message: Message;
  application?: Application;
}

const StyledCard = styled(Card)`
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease-in-out;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const EventTypeBadge = styled(Badge)`
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ChannelBadge = styled(Badge)`
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MessageId = styled.div`
  font-family: monospace;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TimestampInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PayloadWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: monospace;
  font-size: 0.85rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
`;

const StatusBadge = styled(Badge)<{ $statusType: "success" | "warning" | "danger" }>`
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MessageCard: FC<MessageCardProps> = ({ message, application }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const statusInfo =
    message.status !== undefined
      ? getStatusInfo(message.status)
      : { color: "info", text: "No status" };

  const channels = message.channels?.sort((a, b) => a.localeCompare(b));

  return (
    <StyledCard>
      <CardBody>
        <CardTitle tag="h5">
          <EventTypeBadge color="primary">{message.eventType}</EventTypeBadge>
        </CardTitle>

        <MessageId>ID: {message.id}</MessageId>
        {message.eventId && <MessageId>Event ID: {message.eventId}</MessageId>}

        <TimestampInfo>Sent: {formatDate(message.timestamp)}</TimestampInfo>
        {message.nextAttempt && (
          <TimestampInfo>Next Attempt: {formatDate(message.nextAttempt)}</TimestampInfo>
        )}

        {message.status !== undefined && (
          <StatusBadge
            $statusType={statusInfo.color as "success" | "warning" | "danger"}
            color={statusInfo.color}
          >
            {statusInfo.text}
          </StatusBadge>
        )}

        {channels && channels.length > 0 && (
          <div className="mb-3">
            <strong>Channels:</strong>
            <br />
            {channels.map((channel) => (
              <ChannelBadge key={channel} color="dark" pill>
                {channelNames(channel)}
              </ChannelBadge>
            ))}
          </div>
        )}

        <PayloadWrapper>
          <pre>{JSON.stringify(message.payload, null, 2)}</pre>
        </PayloadWrapper>

        <CardActions>
          <Button color="primary" outline size="sm">
            View Details
          </Button>
          <LinkContainer to={`/applications/${application?.id}/messages/${message.id}/attempts`}>
            <Button color="success" outline size="sm">
              View Attempts
            </Button>
          </LinkContainer>
        </CardActions>
      </CardBody>
    </StyledCard>
  );
};

export default MessageCard;

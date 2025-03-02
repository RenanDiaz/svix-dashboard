import { FC, useState } from "react";
import styled from "styled-components";
import { Card, CardBody, CardTitle, Button, Badge, Collapse } from "reactstrap";
import { Application, Message } from "../../types";
import { LinkContainer } from "react-router-bootstrap";

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

const MessageCard: FC<MessageCardProps> = ({ message, application }) => {
  const [showPayload, setShowPayload] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <StyledCard>
      <CardBody>
        <CardTitle tag="h5">
          <EventTypeBadge color="primary">{message.eventType}</EventTypeBadge>
        </CardTitle>

        <MessageId>ID: {message.id}</MessageId>
        {message.eventId && <MessageId>Event ID: {message.eventId}</MessageId>}

        <TimestampInfo>Sent: {formatDate(message.timestamp)}</TimestampInfo>

        {message.channels && message.channels.length > 0 && (
          <div className="mb-3">
            <strong>Channels: </strong>
            {message.channels?.map((channel, index) => (
              <ChannelBadge key={index} color="info">
                {channel}
              </ChannelBadge>
            ))}
          </div>
        )}

        <Button
          color="secondary"
          size="sm"
          onClick={() => setShowPayload(!showPayload)}
          className="mb-3"
        >
          {showPayload ? "Hide Payload" : "Show Payload"}
        </Button>

        <Collapse isOpen={showPayload}>
          <PayloadWrapper>
            <pre>{JSON.stringify(message.payload, null, 2)}</pre>
          </PayloadWrapper>
        </Collapse>

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

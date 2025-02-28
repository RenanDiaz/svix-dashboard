import { FC } from "react";
import styled from "styled-components";
import { Badge, Button, Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { Application, Message } from "../../types";

interface MessageCardProps {
  message: Message;
  application?: Application;
  updateMessages: () => void;
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

const MessagePayload = styled.pre`
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

const MessageCard: FC<MessageCardProps> = ({ message, application, updateMessages }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <StyledCard>
      <CardBody>
        <CardTitle tag="h5">Type: {message.eventType}</CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          ID: {message.id}
        </CardSubtitle>

        <AppBadge color="info">{application?.name}</AppBadge>

        <MessagePayload>{JSON.stringify(message.payload, null, 2)}</MessagePayload>

        {message.channels && message.channels.length > 0 && (
          <>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              Channels:
            </CardSubtitle>
            <div className="mb-3">
              {message.channels.map((channel) => (
                <Badge key={channel} color="dark" className="me-1" pill>
                  {channel}
                </Badge>
              ))}
            </div>
          </>
        )}

        <DateInfo>Timestamp: {formatDate(message.timestamp)}</DateInfo>

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

export default MessageCard;

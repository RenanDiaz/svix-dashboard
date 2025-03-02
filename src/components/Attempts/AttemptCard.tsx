import { FC, useState } from "react";
import styled from "styled-components";
import { Card, CardBody, CardTitle, CardSubtitle, Button, Badge, Collapse } from "reactstrap";
import { Attempt } from "../../types";

interface AttemptCardProps {
  attempt: Attempt;
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
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const StatusBadge = styled(Badge)<{ $statusType: "success" | "warning" | "danger" }>`
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
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

const AttemptInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ResponseWrapper = styled.div`
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

const AttemptCard: FC<AttemptCardProps> = ({ attempt }) => {
  const [showResponse, setShowResponse] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Helper function to determine status badge color and text
  const getStatusInfo = (status: 0 | 1 | 2 | 3) => {
    switch (status) {
      case 0:
        return { color: "success", text: "Success" };
      case 1:
        return { color: "warning", text: "Pending" };
      case 2:
        return { color: "danger", text: "Failed" };
      case 3:
        return { color: "info", text: "Sending" };
    }
  };

  // Helper function to determine trigger type text
  const getTriggerTypeText = (triggerType: 0 | 1) => {
    switch (triggerType) {
      case 0:
        return "Scheduled";
      case 1:
        return "Manual";
    }
  };

  const statusInfo = getStatusInfo(attempt.status);

  const processResponse = (response: string) => {
    try {
      return JSON.stringify(JSON.parse(response), null, 2);
    } catch (error) {
      return response;
    }
  };

  return (
    <StyledCard>
      <CardBody>
        <CardTitle tag="h5">
          <StatusBadge
            $statusType={statusInfo.color as "success" | "warning" | "danger"}
            color={statusInfo.color}
          >
            {statusInfo.text}
          </StatusBadge>
          <Badge color="info" className="ms-2">
            HTTP {attempt.responseStatusCode}
          </Badge>
        </CardTitle>

        <CardSubtitle tag="h6" className="mb-3">
          ID: {attempt.id}
        </CardSubtitle>

        <EndpointUrl>{attempt.url}</EndpointUrl>

        <AttemptInfo>
          <strong>Message ID:</strong> {attempt.msgId}
        </AttemptInfo>
        <AttemptInfo>
          <strong>Endpoint ID:</strong> {attempt.endpointId}
        </AttemptInfo>
        <AttemptInfo>
          <strong>Duration:</strong> {attempt.responseDurationMs}ms
        </AttemptInfo>
        <AttemptInfo>
          <strong>Trigger Type:</strong> {getTriggerTypeText(attempt.triggerType)}
        </AttemptInfo>
        <AttemptInfo>
          <strong>Timestamp:</strong> {formatDate(attempt.timestamp)}
        </AttemptInfo>

        {attempt.response && (
          <>
            <Button
              color="secondary"
              size="sm"
              onClick={() => setShowResponse(!showResponse)}
              className="mt-3"
            >
              {showResponse ? "Hide Response" : "Show Response"}
            </Button>

            <Collapse isOpen={showResponse}>
              <ResponseWrapper>
                <pre>{processResponse(attempt.response)}</pre>
              </ResponseWrapper>
            </Collapse>
          </>
        )}

        <CardActions>
          <Button color="primary" outline size="sm">
            Retry
          </Button>
        </CardActions>
      </CardBody>
    </StyledCard>
  );
};

export default AttemptCard;

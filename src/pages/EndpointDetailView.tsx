import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Card, CardBody, Button, Progress, Badge, Row, Col } from "reactstrap";
import {
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { AttemptWithMessage, Endpoint, EndpointStats } from "../types";
import { getAttemptsByEndpoint, getEndpoint, getEndpointStats } from "../services/api-client";
import { formatDatetime } from "../globals/utils";
import AttemptsWithMessageTable from "../components/Attempts/AttemptsWithMessageTable";

const EndpointContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
`;

const EndpointHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const EndpointUrl = styled.h5`
  margin-bottom: 0;
  color: #444;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const EditButton = styled(Button)`
  padding: 3px 10px;
  font-size: 0.8rem;
`;

const SectionTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  padding: 10px 0;
  margin-top: 10px;
  color: #444;
  background-color: #f0f4f8;
  padding: 10px;
  border-radius: 4px;
`;

const DescriptionCard = styled(Card)`
  margin: 15px 0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SecretContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
`;

const SecretLabel = styled.div`
  font-size: 0.9rem;
  margin-right: 15px;
`;

const SecretValue = styled.div`
  font-family: monospace;
  margin-right: 10px;
  letter-spacing: 1px;
`;

const HiddenSecret = styled.div`
  font-family: monospace;
  letter-spacing: 2px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
`;

const EndpointDetailView: FC = () => {
  const { applicationId, endpointId } = useParams<{ applicationId: string; endpointId: string }>();
  const [endpoint, setEndpoint] = useState<Endpoint>();
  const [attempts, setAttempts] = useState<AttemptWithMessage[]>([]);
  const [deliveryStats, setDeliveryStats] = useState<EndpointStats>({
    sending: 0,
    fail: 0,
    pending: 0,
    success: 0,
  });
  const [showSecret, setShowSecret] = useState<boolean>(false);

  useEffect(() => {
    if (!applicationId || !endpointId) return;
    getEndpoint(applicationId, endpointId).then((data) => setEndpoint(data));
  }, [applicationId, endpointId]);

  const updateAttemptsByEndpoint = useCallback(() => {
    if (!applicationId || !endpointId) return;
    getAttemptsByEndpoint(applicationId, endpointId).then(({ data }) => setAttempts(data));
  }, [applicationId, endpointId]);

  useEffect(updateAttemptsByEndpoint, [updateAttemptsByEndpoint]);

  const updateEndpointStats = useCallback(() => {
    if (!applicationId || !endpointId) return;
    getEndpointStats(applicationId, endpointId).then((data) => setDeliveryStats(data));
  }, [applicationId, endpointId]);

  useEffect(updateEndpointStats, [updateEndpointStats]);

  const toggleSecret = () => {
    setShowSecret(!showSecret);
  };

  const handleReplaySuccess = () => {
    updateAttemptsByEndpoint();
    updateEndpointStats();
  };

  const totalDeliveryStats = Object.values(deliveryStats).reduce((acc, curr) => acc + curr, 0);

  if (!endpoint) return null;

  return (
    <>
      <EndpointContainer>
        <EndpointHeader>
          <EndpointUrl>{endpoint.url}</EndpointUrl>
          <EditButton color="light" size="sm">
            Edit
          </EditButton>
        </EndpointHeader>

        <Row>
          <Col md={9}>
            <SectionTitle>Description</SectionTitle>
            <DescriptionCard>
              <CardBody className="d-flex justify-content-between align-items-center">
                <div>{endpoint.description}</div>
                <EditButton color="light" size="sm">
                  Edit
                </EditButton>
              </CardBody>
            </DescriptionCard>

            <SectionTitle>Attempt Delivery Stats</SectionTitle>
            <Card>
              <CardBody>
                <Progress multi className="mb-3">
                  {deliveryStats.sending > 0 && (
                    <Progress
                      bar
                      color="info"
                      value={(deliveryStats.sending / totalDeliveryStats) * 100}
                    >
                      {deliveryStats.sending}
                    </Progress>
                  )}
                  {deliveryStats.fail > 0 && (
                    <Progress
                      bar
                      color="danger"
                      value={(deliveryStats.fail / totalDeliveryStats) * 100}
                    >
                      {deliveryStats.fail}
                    </Progress>
                  )}
                  {deliveryStats.pending > 0 && (
                    <Progress
                      bar
                      color="warning"
                      value={(deliveryStats.pending / totalDeliveryStats) * 100}
                    >
                      {deliveryStats.pending}
                    </Progress>
                  )}
                  {deliveryStats.success > 0 && (
                    <Progress
                      bar
                      color="success"
                      value={(deliveryStats.success / totalDeliveryStats) * 100}
                    >
                      {deliveryStats.success}
                    </Progress>
                  )}
                </Progress>
                {totalDeliveryStats === 0 ? (
                  <div className="text-center">NO MESSAGES RECEIVED</div>
                ) : (
                  <div className="d-flex">
                    {deliveryStats.success > 0 && (
                      <div className="me-4">
                        <span className="text-success">■</span> SUCCESS – {deliveryStats.success}
                      </div>
                    )}
                    {deliveryStats.pending > 0 && (
                      <div className="me-4">
                        <span className="text-warning">■</span> PENDING – {deliveryStats.pending}
                      </div>
                    )}
                    {deliveryStats.sending > 0 && (
                      <div className="me-4">
                        <span className="text-info">■</span> SENDING – {deliveryStats.sending}
                      </div>
                    )}
                    {deliveryStats.fail > 0 && (
                      <div>
                        <span className="text-danger">■</span> FAIL – {deliveryStats.fail}
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col md={3}>
            <Row>
              <Col md={12}>
                <InfoLabel>Creation Date</InfoLabel>
                <InfoValue>{formatDatetime(endpoint.createdAt)}</InfoValue>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <InfoLabel>Last Updated</InfoLabel>
                <InfoValue>{formatDatetime(endpoint.updatedAt)}</InfoValue>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <div className="d-flex justify-content-between align-items-center">
                  <InfoLabel>Subscribed events</InfoLabel>
                  <EditButton color="light" size="sm">
                    Edit
                  </EditButton>
                </div>
                {!endpoint.filterTypes ? (
                  <InfoValue>Listening to all events</InfoValue>
                ) : (
                  endpoint.filterTypes.map((type) => (
                    <Badge key={type} color="dark" className="me-1" pill>
                      {type}
                    </Badge>
                  ))
                )}
              </Col>
            </Row>

            <SecretContainer>
              <SecretLabel>Signing Secret</SecretLabel>
              {showSecret ? (
                <SecretValue>abcdef123456</SecretValue>
              ) : (
                <HiddenSecret>••••••••••</HiddenSecret>
              )}
              <Button color="link" onClick={toggleSecret} style={{ padding: 0 }}>
                {showSecret ? <FiEyeOff /> : <FiEye />}
              </Button>
            </SecretContainer>
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <h6 className="d-flex align-items-center">
            Message Attempts
            <Button color="link" className="p-0 ms-2">
              <span className="small">▼</span>
            </Button>
          </h6>
          <div className="d-flex">
            <Button color="light" size="sm" className="me-2">
              <FiRefreshCw size={14} />
            </Button>
            <div className="d-flex">
              <Button color="light" size="sm" className="me-2 active">
                All
              </Button>
              <Button color="light" size="sm" className="me-2">
                Succeeded
              </Button>
              <Button color="light" size="sm" className="me-2">
                Failed
              </Button>
            </div>
            <Button color="light" size="sm">
              <FiFilter size={14} /> Filters
            </Button>
          </div>
        </div>

        {!!applicationId && !!endpointId && (
          <AttemptsWithMessageTable
            {...{ applicationId, endpointId, attempts }}
            onReplaySuccess={handleReplaySuccess}
          />
        )}

        <PaginationContainer>
          <div>
            Showing {attempts.length} items ({attempts.length} in total)
          </div>
          <div>
            <Button color="link" disabled>
              <FiChevronLeft />
            </Button>
            <Button color="link">
              <FiChevronRight />
            </Button>
          </div>
        </PaginationContainer>
      </EndpointContainer>
    </>
  );
};

export default EndpointDetailView;

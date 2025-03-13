import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Progress,
  Badge,
  Table,
  Row,
  Col,
} from "reactstrap";
import {
  FiEye,
  FiEyeOff,
  FiMoreVertical,
  FiRefreshCw,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { AttemptWithMessage, Endpoint, EndpointStats } from "../types";
import { getAttemptsByEndpoint, getEndpoint, getEndpointStats } from "../services/api-client";

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

const StyledNavItem = styled(NavItem)`
  cursor: pointer;
`;

const StyledNavLink = styled(NavLink)`
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#0d6efd" : "#666")} !important;
  border-bottom: ${(props) => (props.active ? "2px solid #0d6efd" : "2px solid transparent")};
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  background-color: transparent !important;
  border-radius: 0 !important;
  padding: 8px 15px;

  &:hover {
    border-bottom: 2px solid #0d6efd;
  }
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

const StyledBadge = styled(Badge)<{ status: 0 | 1 | 2 | 3 }>`
  background-color: ${(props) =>
    props.status === 2 ? "#dc3545" : props.status === 0 ? "#28a745" : "#17a2b8"};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
`;

const MessageTable = styled(Table)`
  margin-top: 15px;

  th {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
  }

  td {
    vertical-align: middle;
  }
`;

const ActionButton = styled(Button)`
  padding: 0;
  background: none;
  border: none;
  color: #666;

  &:hover {
    color: #0d6efd;
    background: none;
  }
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
  // Sample data
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showSecret, setShowSecret] = useState<boolean>(false);

  useEffect(() => {
    if (!applicationId || !endpointId) return;
    getEndpoint(applicationId, endpointId).then((data) => setEndpoint(data));
    getAttemptsByEndpoint(applicationId, endpointId).then(({ data }) => setAttempts(data));
    getEndpointStats(applicationId, endpointId).then((data) => setDeliveryStats(data));
  }, [applicationId, endpointId]);

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleSecret = () => {
    setShowSecret(!showSecret);
  };

  const totalDeliveryStats = Object.values(deliveryStats).reduce((acc, curr) => acc + curr, 0);

  return (
    <EndpointContainer>
      <EndpointHeader>
        <EndpointUrl>{endpoint?.url}</EndpointUrl>
        <EditButton color="light" size="sm">
          Edit
        </EditButton>
      </EndpointHeader>

      <Row>
        <Col md={9}>
          <Nav tabs className="border-0">
            <StyledNavItem>
              <StyledNavLink active={activeTab === "overview"} onClick={() => toggle("overview")}>
                Overview
              </StyledNavLink>
            </StyledNavItem>
            <StyledNavItem>
              <StyledNavLink active={activeTab === "testing"} onClick={() => toggle("testing")}>
                Testing
              </StyledNavLink>
            </StyledNavItem>
            <StyledNavItem>
              <StyledNavLink active={activeTab === "advanced"} onClick={() => toggle("advanced")}>
                Advanced
              </StyledNavLink>
            </StyledNavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="overview">
              <SectionTitle>Description</SectionTitle>
              <DescriptionCard>
                <CardBody className="d-flex justify-content-between align-items-center">
                  <div>{endpoint?.description}</div>
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
            </TabPane>

            <TabPane tabId="testing">
              <Card>
                <CardBody>
                  <h5>Testing Content</h5>
                  <p>Configure and test your webhook endpoints here.</p>
                </CardBody>
              </Card>
            </TabPane>

            <TabPane tabId="advanced">
              <Card>
                <CardBody>
                  <h5>Advanced Settings</h5>
                  <p>Configure advanced settings for your webhook endpoint.</p>
                </CardBody>
              </Card>
            </TabPane>
          </TabContent>
        </Col>

        <Col md={3}>
          <Row>
            <Col md={12}>
              <InfoLabel>Creation Date</InfoLabel>
              <InfoValue>{endpoint?.createdAt}</InfoValue>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <InfoLabel>Last Updated</InfoLabel>
              <InfoValue>{endpoint?.updatedAt}</InfoValue>
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
              {!endpoint?.filterTypes ? (
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

      <MessageTable bordered hover>
        <thead>
          <tr>
            <th style={{ width: "15%" }}>Event Type</th>
            <th style={{ width: "65%" }}>Message ID</th>
            <th style={{ width: "15%" }}>Timestamp</th>
            <th style={{ width: "5%" }}></th>
          </tr>
        </thead>
        <tbody>
          {attempts.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">
                This endpoint has not received any messages yet
              </td>
            </tr>
          ) : (
            attempts.map((attempt) => (
              <tr key={attempt.id}>
                <td>
                  <StyledBadge status={attempt.status} className="me-2">
                    Failed
                  </StyledBadge>
                  {attempt.msg.eventType}
                </td>
                <td>{attempt.msgId}</td>
                <td>{attempt.timestamp}</td>
                <td>
                  <ActionButton>
                    <FiMoreVertical />
                  </ActionButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </MessageTable>

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
  );
};

export default EndpointDetailView;

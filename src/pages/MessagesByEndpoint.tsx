import { useState, useEffect, FC, useCallback } from "react";
import styled from "styled-components";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
import MessagesList from "../components/Messages/MessagesList";
import { Application, Endpoint, Message } from "../types";
import { getMessagesByEndpoint, getEndpoint, getApplication } from "../services/api-client";
import { useParams } from "react-router-dom";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  width: 300px;
`;

const MessagesByEndpoint: FC = () => {
  const { applicationId, endpointId } = useParams<{ applicationId: string; endpointId: string }>();
  const [application, setApplication] = useState<Application>();
  const [endpoint, setEndpoint] = useState<Endpoint>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!applicationId) return;
    getApplication(applicationId).then((data) => setApplication(data));
  }, [applicationId]);

  useEffect(() => {
    if (!applicationId || !endpointId) return;
    getEndpoint(applicationId, endpointId).then((data) => setEndpoint(data));
  }, [applicationId, endpointId]);

  const updateMessages = useCallback(() => {
    if (!applicationId || !endpointId) return;
    setMessages([]);
    getMessagesByEndpoint(applicationId, endpointId).then(({ data }) => setMessages(data));
  }, [applicationId, endpointId]);

  useEffect(updateMessages, [updateMessages]);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.eventType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <PageHeader>
        <h1>{endpoint?.description || "Attempts"}</h1>
        <div className="d-flex">
          <SearchWrapper className="me-2">
            <InputGroup>
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </SearchWrapper>
          <Button color="primary" onClick={updateMessages}>
            Reload
          </Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <MessagesList messages={filteredMessages} application={application} />
        </Col>
      </Row>
    </div>
  );
};

export default MessagesByEndpoint;

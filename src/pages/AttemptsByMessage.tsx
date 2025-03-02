import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { Application, Attempt, Message } from "../types";
import { getApplication, getAttemptsByMessage, getMessage } from "../services/api-client";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
import AttemptsList from "../components/Attempts/AttemptsList";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  width: 300px;
`;

const AttemptsByMessage: FC = () => {
  const { applicationId, messageId } = useParams<{ applicationId: string; messageId: string }>();
  const [application, setApplication] = useState<Application>();
  const [message, setMessage] = useState<Message>();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!applicationId) return;
    getApplication(applicationId).then((data) => setApplication(data));
  }, [applicationId]);

  useEffect(() => {
    if (!messageId) return;
    getMessage(messageId).then((data) => setMessage(data));
  }, [messageId]);

  const updateAttempts = useCallback(() => {
    if (!applicationId || !messageId) return;
    getAttemptsByMessage(applicationId, messageId).then((response) => {
      setAttempts(response.data);
    });
  }, [applicationId, messageId]);

  useEffect(updateAttempts, [updateAttempts]);

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = attempt.url.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <PageHeader>
        <h1>{message?.eventType || "Attempts"}</h1>
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
          <Button color="primary">Create Message</Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <AttemptsList attempts={filteredAttempts} application={application} />
        </Col>
      </Row>
    </div>
  );
};

export default AttemptsByMessage;

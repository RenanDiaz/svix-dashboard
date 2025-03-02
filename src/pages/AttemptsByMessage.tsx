import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { Attempt, Message } from "../types";
import { getAttemptsByMessage, getMessage } from "../services/api-client";
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
  const [message, setMessage] = useState<Message>();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!messageId) return;
    getMessage(messageId)
      .then((data) => setMessage(data))
      .catch(() => setMessage(undefined));
  }, [messageId]);

  const updateAttempts = useCallback(() => {
    if (!applicationId || !messageId) return;
    setAttempts([]);
    setIsLoading(true);
    getAttemptsByMessage(applicationId, messageId)
      .then((response) => {
        setAttempts(response.data);
      })
      .finally(() => setIsLoading(false));
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
                placeholder="Search attempts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </SearchWrapper>
          <Button color="primary" onClick={updateAttempts}>
            Reload
          </Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <AttemptsList attempts={filteredAttempts} isLoading={isLoading} />
        </Col>
      </Row>
    </div>
  );
};

export default AttemptsByMessage;

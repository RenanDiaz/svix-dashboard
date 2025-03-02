import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { Attempt, Endpoint } from "../types";
import { getAttemptsByEndpoint, getEndpoint } from "../services/api-client";
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

const AttemptsByEndpoint: FC = () => {
  const { applicationId, endpointId } = useParams<{ applicationId: string; endpointId: string }>();
  const [endpoint, setEndpoint] = useState<Endpoint>();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!endpointId) return;
    getEndpoint(endpointId)
      .then((data) => setEndpoint(data))
      .catch(() => setEndpoint(undefined));
  }, [endpointId]);

  const updateAttempts = useCallback(() => {
    if (!applicationId || !endpointId) return;
    setAttempts([]);
    setIsLoading(true);
    getAttemptsByEndpoint(applicationId, endpointId)
      .then((response) => setAttempts(response.data))
      .finally(() => setIsLoading(false));
  }, [applicationId, endpointId]);

  useEffect(updateAttempts, [updateAttempts]);

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = attempt.url.toLowerCase().includes(searchTerm.toLowerCase());

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
          <Button color="primary">Create Message</Button>
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

export default AttemptsByEndpoint;

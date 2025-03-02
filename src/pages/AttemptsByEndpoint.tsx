import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { Application, Attempt, Endpoint } from "../types";
import { getApplication, getAttemptsByEndpoint, getEndpoint } from "../services/api-client";
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
  const [application, setApplication] = useState<Application>();
  const [endpoint, setEndpoint] = useState<Endpoint>();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!applicationId) return;
    getApplication(applicationId).then((data) => setApplication(data));
  }, [applicationId]);

  useEffect(() => {
    if (!endpointId) return;
    getEndpoint(endpointId).then((data) => setEndpoint(data));
  }, [endpointId]);

  const updateAttempts = useCallback(() => {
    if (!applicationId || !endpointId) return;
    getAttemptsByEndpoint(applicationId, endpointId).then((response) => {
      setAttempts(response.data);
    });
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
          <AttemptsList attempts={filteredAttempts} application={application} />
        </Col>
      </Row>
    </div>
  );
};

export default AttemptsByEndpoint;

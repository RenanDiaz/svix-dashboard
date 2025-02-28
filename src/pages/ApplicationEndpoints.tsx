import { useState, useEffect, FC, useCallback } from "react";
import styled from "styled-components";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
import EndpointsList from "../components/Endpoints/EndpointsList";
import { Endpoint, Application } from "../types";
import { getApplication, getEndpoints } from "../services/api-client";
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

const ApplicationEndpoints: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [application, setApplication] = useState<Application>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    getApplication(id).then((data) => setApplication(data));
  }, [id]);

  const updateEndpoints = useCallback(() => {
    if (!application) return;
    getEndpoints(application.id).then(({ data }) => setEndpoints(data));
  }, [application]);

  useEffect(updateEndpoints, [updateEndpoints]);

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <PageHeader>
        <h1>{application?.name || "Applications"}</h1>
        <div className="d-flex">
          <SearchWrapper className="me-2">
            <InputGroup>
              <Input
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </SearchWrapper>
          <Button color="primary">Create Endpoint</Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <EndpointsList
            endpoints={filteredEndpoints}
            application={application}
            updateEndpoints={updateEndpoints}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ApplicationEndpoints;

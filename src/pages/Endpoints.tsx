import { useState, useEffect, FC } from "react";
import styled from "styled-components";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";
import EndpointsList from "../components/Endpoints/EndpointsList";
import { Endpoint, Application } from "../types";
import { getApplications, getEndpoints } from "../services/api-client";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Endpoints: FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<string>("");

  useEffect(() => {
    getApplications().then(({ data }) => {
      setApplications(data);
      setSelectedApp(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedApp) {
      getEndpoints(selectedApp).then(({ data }) => setEndpoints(data));
    }
  }, [selectedApp]);

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const selectedApplication = applications.find((app) => app.id === selectedApp);

  return (
    <div>
      <PageHeader>
        <h1>Endpoints</h1>
        <Button color="primary">Create Endpoint</Button>
      </PageHeader>

      <FilterWrapper>
        <FormGroup style={{ width: "300px" }}>
          <Input
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormGroup>

        <FormGroup style={{ width: "300px" }}>
          <Input type="select" value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </Input>
        </FormGroup>
      </FilterWrapper>

      <Row>
        <Col>
          <EndpointsList endpoints={filteredEndpoints} application={selectedApplication} />
        </Col>
      </Row>
    </div>
  );
};

export default Endpoints;

import { useState, useEffect, FC } from "react";
import styled from "styled-components";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
import ApplicationsList from "../components/Applications/ApplicationsList";
import { Application } from "../types";
import { getApplications } from "../services/api-client";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  width: 300px;
`;

const Applications: FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    getApplications().then(({ data }) => setApplications(data));
  }, []);

  const filteredApplications = applications?.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader>
        <h1>Applications</h1>
        <div className="d-flex">
          <SearchWrapper className="me-2">
            <InputGroup>
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </SearchWrapper>
          <Button color="primary">Create Application</Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <ApplicationsList applications={filteredApplications} />
        </Col>
      </Row>
    </div>
  );
};

export default Applications;

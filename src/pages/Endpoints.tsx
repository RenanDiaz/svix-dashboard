import { useState, useEffect, FC, useCallback } from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import EndpointsList from "../components/Endpoints/EndpointsList";
import { Endpoint, Application } from "../types";
import { getApplications, getEndpoints } from "../services/api-client";
import EndpointForm from "../components/Endpoints/EndpointForm";
import { FiRefreshCw } from "react-icons/fi";

const ENDPOINT_FORM_ID = "endpoint-form";

const FilterWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Endpoints: FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [createModalIsOpen, setCreateModalIsOpen] = useState<boolean>(false);
  const [alreadyFetched, setAlreadyFetched] = useState<boolean>(false);

  useEffect(() => {
    getApplications().then(({ data }) => {
      setApplications(data);
      setSelectedApp(data[0].id);
    });
  }, []);

  const updateEndpoints = useCallback(() => {
    if (!selectedApp) return;
    setEndpoints([]);
    setAlreadyFetched(false);
    getEndpoints(selectedApp)
      .then(({ data }) => setEndpoints(data))
      .finally(() => setAlreadyFetched(true));
  }, [selectedApp]);

  useEffect(updateEndpoints, [updateEndpoints]);

  const toggleCreateModal = () => setCreateModalIsOpen((prev) => !prev);

  const handleCreateSuccess = () => {
    toggleCreateModal();
    updateEndpoints();
  };

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const selectedApplication = applications.find((app) => app.id === selectedApp);

  return (
    <div>
      <Row>
        <Col>
          <Row className="align-items-center gx-2">
            <Col xs="auto">
              <h1>Consumers</h1>
            </Col>
            <Col xs="auto">
              <Button type="button" color="link" onClick={updateEndpoints}>
                <FiRefreshCw size={22} />
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs="auto">
          <Button color="primary" onClick={toggleCreateModal}>
            Create Endpoint
          </Button>
        </Col>
      </Row>

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
          <EndpointsList
            endpoints={filteredEndpoints}
            alreadyFetched={alreadyFetched}
            application={selectedApplication}
            updateEndpoints={updateEndpoints}
          />
        </Col>
      </Row>

      <Modal isOpen={createModalIsOpen} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>Create Endpoint</ModalHeader>
        <ModalBody>
          <EndpointForm formId={ENDPOINT_FORM_ID} onSuccess={handleCreateSuccess} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleCreateModal}>
            Cancel
          </Button>
          <Button color="primary" type="submit" form={ENDPOINT_FORM_ID}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Endpoints;

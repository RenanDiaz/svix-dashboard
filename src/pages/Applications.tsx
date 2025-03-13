import { useState, useEffect, FC } from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import ApplicationsList from "../components/Applications/ApplicationsList";
import { Application } from "../types";
import { getApplications } from "../services/api-client";
import ApplicationForm from "../components/Applications/ApplicationForm";

const APPLICATION_FORM_ID = "application-form";

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
  const [applicationModalIsOpen, setApplicationModalIsOpen] = useState<boolean>(false);
  const [alreadyFetched, setAlreadyFetched] = useState<boolean>(false);

  const updateApplications = () => {
    getApplications()
      .then(({ data }) => setApplications(data))
      .finally(() => setAlreadyFetched(true));
  };

  useEffect(updateApplications, []);

  const handleApplicationFormSuccess = () => {
    updateApplications();
    setApplicationModalIsOpen(false);
  };

  const toggleApplicationModal = () => setApplicationModalIsOpen((prev) => !prev);

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
          <Button type="button" color="primary" onClick={toggleApplicationModal}>
            Create Application
          </Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <ApplicationsList applications={filteredApplications} alreadyFetched={alreadyFetched} />
        </Col>
      </Row>

      <Modal isOpen={applicationModalIsOpen} toggle={toggleApplicationModal}>
        <ModalHeader toggle={toggleApplicationModal}>Create Application</ModalHeader>
        <ModalBody>
          <ApplicationForm formId={APPLICATION_FORM_ID} onSuccess={handleApplicationFormSuccess} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleApplicationModal}>
            Cancel
          </Button>
          <Button form={APPLICATION_FORM_ID} type="submit" color="primary">
            Create
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Applications;

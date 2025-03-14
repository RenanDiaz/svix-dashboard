import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { Application, Endpoint, EndpointStats } from "../../types";
import { deleteEndpoint, getEndpointStats } from "../../services/api-client";
import { LinkContainer } from "react-router-bootstrap";
import EndpointForm from "./EndpointForm";

const ENDPOINT_FORM_ID = "endpoint-form";

interface EndpointCardProps {
  endpoint: Endpoint;
  application?: Application;
  updateEndpoints: () => void;
}

const StyledCard = styled(Card)`
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const EndpointUrl = styled.div`
  font-family: monospace;
  background-color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  word-break: break-all;
`;

const DateInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const AppBadge = styled(Badge)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EndpointCard: FC<EndpointCardProps> = ({ endpoint, application, updateEndpoints }) => {
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [deliveryStats, setDeliveryStats] = useState<EndpointStats>();

  useEffect(() => {
    if (!application) return;
    getEndpointStats(application.id, endpoint.id).then((data) => setDeliveryStats(data));
  }, [application, endpoint]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleEditModal = () => setEditModalIsOpen((prev) => !prev);

  const handleEditSuccess = () => {
    toggleEditModal();
    updateEndpoints();
  };

  const toggleConfirmDeleteModal = () => setConfirmDeleteModalIsOpen((prev) => !prev);

  const confirmDeleteEndpoint = () => {
    if (!application) return;
    deleteEndpoint(application.id, endpoint.id)
      .then(() => {
        updateEndpoints();
        toggleConfirmDeleteModal();
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowError(true);
      });
  };

  const toggleErrorModal = () => {
    setShowError(!showError);
  };

  const handleErrorClosed = () => {
    setErrorMessage("");
  };

  const channels = endpoint.channels?.sort((a, b) => a.localeCompare(b));

  const totalAttempts = Object.values(deliveryStats || {}).reduce(
    (acc, val) => acc + (val || 0),
    0
  );

  const errorRate = (deliveryStats?.fail || 0) / totalAttempts || 0;

  return (
    <>
      <StyledCard>
        <CardBody>
          <CardTitle tag="h5">{endpoint.description}</CardTitle>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            ID: {endpoint.id}
          </CardSubtitle>

          <AppBadge color="info">{application?.name}</AppBadge>

          <EndpointUrl>{endpoint.url}</EndpointUrl>

          {channels && channels.length > 0 && (
            <>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Channels:
              </CardSubtitle>
              <div className="mb-3">
                {channels.map((channel) => (
                  <Badge key={channel} color="dark" className="me-1" pill>
                    {channel}
                  </Badge>
                ))}
              </div>
            </>
          )}

          <div className="mb-3">
            <Badge color="secondary">Version {endpoint.version}</Badge>
          </div>

          <DateInfo>Created: {formatDate(endpoint.createdAt)}</DateInfo>
          <DateInfo>Updated: {formatDate(endpoint.updatedAt)}</DateInfo>

          <Row className="align-items-center mb-3">
            <Col xs="auto">
              <CardSubtitle tag="h6" className="m-0 text-muted">
                Error rate:
              </CardSubtitle>
            </Col>
            <Col xs="auto">
              {deliveryStats ? (
                <Badge color={errorRate > 0.1 ? "danger" : "success"}>{errorRate * 100}%</Badge>
              ) : (
                <Badge color="danger">N/A</Badge>
              )}
            </Col>
          </Row>

          <Row>
            <Col xs="auto">
              <LinkContainer to={`/applications/${application?.id}/endpoints/${endpoint.id}`}>
                <Button color="primary" outline size="sm">
                  Details
                </Button>
              </LinkContainer>
            </Col>
            <Col xs="auto">
              <LinkContainer
                to={`/applications/${application?.id}/endpoints/${endpoint.id}/attempts`}
              >
                <Button color="primary" outline size="sm">
                  Attempts
                </Button>
              </LinkContainer>
            </Col>
            <Col xs="auto">
              <LinkContainer
                to={`/applications/${application?.id}/endpoints/${endpoint.id}/messages`}
              >
                <Button color="primary" outline size="sm">
                  Messages
                </Button>
              </LinkContainer>
            </Col>
          </Row>

          <CardActions>
            <Button color="primary" outline size="sm" onClick={toggleEditModal}>
              Edit
            </Button>
            <Button color="danger" outline size="sm" onClick={toggleConfirmDeleteModal}>
              Delete
            </Button>
          </CardActions>
        </CardBody>
      </StyledCard>

      <Modal isOpen={editModalIsOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Endpoint</ModalHeader>
        <ModalBody>
          <EndpointForm
            formId={ENDPOINT_FORM_ID}
            endpointId={endpoint.id}
            applicationId={application?.id}
            onSuccess={handleEditSuccess}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
          <Button color="primary" type="submit" form={ENDPOINT_FORM_ID}>
            Save
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={confirmDeleteModalIsOpen} toggle={toggleConfirmDeleteModal}>
        <ModalHeader toggle={toggleConfirmDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the endpoint <strong>{endpoint.description}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteEndpoint}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleConfirmDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showError} toggle={toggleErrorModal} onClosed={handleErrorClosed}>
        <ModalHeader toggle={() => setShowError(false)}>Error</ModalHeader>
        <ModalBody>{errorMessage}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowError(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EndpointCard;

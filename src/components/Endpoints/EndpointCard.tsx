import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
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
import { deleteEndpoint, disableEndpoint, getEndpointStats } from "../../services/api-client";
import { LinkContainer } from "react-router-bootstrap";
import EndpointForm from "./EndpointForm";
import { NumericFormat } from "react-number-format";
import { formatDatetime } from "../../globals/utils";
import ErrorModal from "../ErrorModal";

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
  const [confirmDisableModalIsOpen, setConfirmDisableModalIsOpen] = useState<boolean>(false);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState<boolean>(false);
  const [deliveryStats, setDeliveryStats] = useState<EndpointStats>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!application) return;
    getEndpointStats(application.id, endpoint.id).then((data) => setDeliveryStats(data));
  }, [application, endpoint]);

  const toggleEditModal = () => setEditModalIsOpen((prev) => !prev);

  const handleEditSuccess = () => {
    toggleEditModal();
    updateEndpoints();
  };

  const toggleConfirmDisableModal = () => setConfirmDisableModalIsOpen((prev) => !prev);

  const confirmDisableEndpoint = () => {
    if (!application) return;
    disableEndpoint(application.id, endpoint.id)
      .then(() => {
        updateEndpoints();
        toggleConfirmDisableModal();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
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
      });
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
          <Row className="gx-1">
            <Col>
              <CardTitle tag="h5">{endpoint.description}</CardTitle>
            </Col>
            <Col xs="auto">
              <Badge color="secondary" pill>
                v{endpoint.version}
              </Badge>
            </Col>
            {endpoint.disabled && (
              <Col xs="auto">
                <Badge color="danger" pill className="mb-2">
                  Disabled
                </Badge>
              </Col>
            )}
          </Row>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            ID: {endpoint.id}
          </CardSubtitle>

          <Row className="align-items-center">
            <Col xs="auto">
              <CardSubtitle tag="h6" className="m-0 text-muted">
                Error rate:
              </CardSubtitle>
            </Col>
            <Col xs="auto">
              {deliveryStats ? (
                <Badge color={errorRate > 0.1 ? "danger" : "success"} pill>
                  <NumericFormat
                    displayType="text"
                    decimalScale={1}
                    fixedDecimalScale={true}
                    value={errorRate * 100}
                    suffix="%"
                  />
                </Badge>
              ) : (
                <Badge color="danger">N/A</Badge>
              )}
            </Col>
          </Row>

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

          {endpoint.filterTypes && (
            <>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Filter Types:
              </CardSubtitle>
              <div className="mb-3">
                {endpoint.filterTypes.map((filterType) => (
                  <Badge key={filterType} color="dark" className="me-1" pill>
                    {filterType}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardBody>

        <CardFooter className="border-0 bg-body">
          <DateInfo>Created: {formatDatetime(endpoint.createdAt)}</DateInfo>
          <DateInfo>Updated: {formatDatetime(endpoint.updatedAt)}</DateInfo>
        </CardFooter>

        <CardFooter className="border-0 bg-body">
          <Row className="justify-content-between gx-1 mb-3">
            <Col xs="auto">
              <LinkContainer to={`/applications/${application?.id}/endpoints/${endpoint.id}`}>
                <Button color="primary" size="sm">
                  Details
                </Button>
              </LinkContainer>
            </Col>
            <Col xs="auto">
              <LinkContainer
                to={`/applications/${application?.id}/endpoints/${endpoint.id}/attempts`}
              >
                <Button color="primary" size="sm">
                  Attempts
                </Button>
              </LinkContainer>
            </Col>
            <Col xs="auto">
              <LinkContainer
                to={`/applications/${application?.id}/endpoints/${endpoint.id}/messages`}
              >
                <Button color="primary" size="sm">
                  Messages
                </Button>
              </LinkContainer>
            </Col>
          </Row>

          <Row className="gx-1 mb-3">
            <Col xs="auto">
              <Button color="primary" outline size="sm" onClick={toggleEditModal}>
                Edit
              </Button>
            </Col>
            <Col />
            <Col xs="auto">
              <Button color="danger" outline size="sm" onClick={toggleConfirmDisableModal}>
                Disable
              </Button>
            </Col>
            <Col xs="auto">
              <Button color="danger" outline size="sm" onClick={toggleConfirmDeleteModal}>
                Delete
              </Button>
            </Col>
          </Row>
        </CardFooter>
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

      <Modal isOpen={confirmDisableModalIsOpen} toggle={toggleConfirmDisableModal}>
        <ModalHeader toggle={toggleConfirmDisableModal}>Confirm Disable</ModalHeader>
        <ModalBody>
          Are you sure you want to disable the endpoint <strong>{endpoint.description}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDisableEndpoint}>
            Disable
          </Button>
          <Button color="secondary" onClick={toggleConfirmDisableModal}>
            Cancel
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

      <ErrorModal errorMessage={errorMessage} onClosed={handleErrorClosed} />
    </>
  );
};

export default EndpointCard;

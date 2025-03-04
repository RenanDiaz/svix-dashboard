import { FC, useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { EventType } from "../../types";
import { deleteEventType } from "../../services/api-client";

interface EventTypeCardProps {
  eventType: EventType;
  updateEventTypes: () => void;
}

const StyledCard = styled(Card)`
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s ease-in-out;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TimestampInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.85rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DetailsWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: monospace;
  font-size: 0.85rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
`;

const EventTypeCard: FC<EventTypeCardProps> = ({ eventType, updateEventTypes }) => {
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleConfirmDeleteModal = () => setConfirmDeleteModalIsOpen((prev) => !prev);

  const handleDelete = () => {
    deleteEventType(eventType.name).then(() => {
      toggleConfirmDeleteModal();
      updateEventTypes();
    });
  };

  return (
    <>
      <StyledCard>
        <CardBody>
          <CardTitle tag="h5">
            <Badge color="primary" className="me-2">
              {eventType.name}
            </Badge>
            {eventType.featureFlag && <Badge color="secondary">{eventType.featureFlag}</Badge>}
            {eventType.archived && (
              <Badge color="danger" className="ms-2">
                Archived
              </Badge>
            )}
            {eventType.deprecated && (
              <Badge color="warning" className="ms-2">
                Deprecated
              </Badge>
            )}
          </CardTitle>

          {eventType.description && (
            <div className="mb-3">
              <strong>Description: </strong>
              <br />
              {eventType.description}
            </div>
          )}

          <TimestampInfo>Created: {formatDate(eventType.createdAt)}</TimestampInfo>
          <TimestampInfo>Last Updated: {formatDate(eventType.updatedAt)}</TimestampInfo>

          {eventType.schemas && (
            <DetailsWrapper>
              <pre>{JSON.stringify(eventType.schemas, null, 2)}</pre>
            </DetailsWrapper>
          )}

          <CardActions>
            <div>
              <Button color="primary" outline size="sm" className="me-2">
                Edit
              </Button>
              <Button color="danger" outline size="sm" onClick={toggleConfirmDeleteModal}>
                Delete
              </Button>
            </div>
            <Button color="info" outline size="sm">
              View Messages
            </Button>
          </CardActions>
        </CardBody>
      </StyledCard>

      <Modal isOpen={confirmDeleteModalIsOpen} toggle={toggleConfirmDeleteModal}>
        <ModalHeader toggle={toggleConfirmDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the event type <strong>{eventType.name}</strong>?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>{" "}
          <Button color="secondary" onClick={toggleConfirmDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EventTypeCard;

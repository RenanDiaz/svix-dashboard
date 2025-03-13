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
import EventTypesList from "../components/EventTypes/EventTypesList";
import { EventType } from "../types";
import { getEventTypes } from "../services/api-client";
import EventTypeForm from "../components/EventTypes/EventTypeForm";

const CREATE_EVENT_TYPE_FORM_ID = "create-event-type-form";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  width: 300px;
`;

const EventTypes: FC = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [createEventTypeModalOpen, setCreateEventTypeModalOpen] = useState<boolean>(false);
  const [alreadyFetched, setAlreadyFetched] = useState<boolean>(false);

  const updateEventTypes = () => {
    getEventTypes()
      .then(({ data }) => setEventTypes(data))
      .finally(() => setAlreadyFetched(true));
  };

  useEffect(updateEventTypes, []);

  const toggleCreateEventTypeModal = () => setCreateEventTypeModalOpen((prev) => !prev);

  const handleCreateSuccess = () => {
    toggleCreateEventTypeModal();
    updateEventTypes();
  };

  const filteredEventTypes = eventTypes.filter((eventType) => {
    const matchesSearch =
      eventType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eventType.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <PageHeader>
        <h1>Event Types</h1>
        <div className="d-flex">
          <SearchWrapper className="me-2">
            <InputGroup>
              <Input
                placeholder="Search event types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </SearchWrapper>
          <Button color="primary" onClick={toggleCreateEventTypeModal}>
            Create Event Type
          </Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <EventTypesList
            eventTypes={filteredEventTypes}
            alreadyFetched={alreadyFetched}
            updateEventTypes={updateEventTypes}
          />
        </Col>
      </Row>

      <Modal isOpen={createEventTypeModalOpen} toggle={toggleCreateEventTypeModal}>
        <ModalHeader toggle={toggleCreateEventTypeModal}>Create Event Type</ModalHeader>
        <ModalBody>
          <EventTypeForm formId={CREATE_EVENT_TYPE_FORM_ID} onSuccess={handleCreateSuccess} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleCreateEventTypeModal}>
            Cancel
          </Button>
          <Button type="submit" color="primary" form={CREATE_EVENT_TYPE_FORM_ID}>
            Create
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EventTypes;

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
import MessagesList from "../components/Messages/MessagesList";
import { Application, Message } from "../types";
import { getMessages, getApplications } from "../services/api-client";
import MessageForm from "../components/Messages/MessageForm";

const MESSAGE_FORM_ID = "message-form";

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

const Messages: FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [quantityOfMessages, setQuantityOfMessages] = useState<number>(8);
  const [messageModalIsOpen, setMessageModalIsOpen] = useState<boolean>(false);
  const [alreadyFetched, setAlreadyFetched] = useState<boolean>(false);

  useEffect(() => {
    getApplications().then(({ data }) => {
      setApplications(data);
      setSelectedApp(data[0].id);
    });
  }, []);

  const updateMessages = useCallback(() => {
    if (!selectedApp) return;
    getMessages(selectedApp)
      .then(({ data }) => setMessages(data))
      .finally(() => setAlreadyFetched(true));
  }, [selectedApp]);

  useEffect(updateMessages, [updateMessages]);

  const toggleMessageModal = () => setMessageModalIsOpen((prev) => !prev);

  const handleMessageSuccess = () => {
    toggleMessageModal();
    updateMessages();
  };

  const filteredMessages = messages.filter((message, index) => {
    if (quantityOfMessages && index >= quantityOfMessages) return false;
    const matchesSearch = message.eventType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const selectedApplication = applications.find((app) => app.id === selectedApp);

  return (
    <div>
      <PageHeader>
        <h1>Messages</h1>
        <Button type="button" color="primary" onClick={toggleMessageModal}>
          Create Message
        </Button>
      </PageHeader>

      <FilterWrapper>
        <FormGroup style={{ width: "300px" }}>
          <Input
            type="select"
            placeholder="Quantity of messages"
            value={quantityOfMessages}
            onChange={(e) => setQuantityOfMessages(Number(e.target.value))}
          >
            <option value={8}>8 last</option>
            <option value={16}>16 last</option>
            <option value={32}>32 last</option>
            <option value={64}>64 last</option>
          </Input>
        </FormGroup>

        <FormGroup style={{ width: "300px" }}>
          <Input
            placeholder="Search messages..."
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
          <MessagesList
            messages={filteredMessages}
            alreadyFetched={alreadyFetched}
            application={selectedApplication}
          />
        </Col>
      </Row>

      <Modal isOpen={messageModalIsOpen} toggle={toggleMessageModal}>
        <ModalHeader toggle={toggleMessageModal}>Create Message</ModalHeader>
        <ModalBody>
          <MessageForm formId={MESSAGE_FORM_ID} onSuccess={handleMessageSuccess} />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleMessageModal}>
            Cancel
          </Button>
          <Button type="submit" form={MESSAGE_FORM_ID} color="primary">
            Send
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Messages;

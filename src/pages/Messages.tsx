import { useState, useEffect, FC, useCallback } from "react";
import styled from "styled-components";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";
import MessagesList from "../components/Messages/MessagesList";
import { Application, Message } from "../types";
import { getMessages, getApplications } from "../services/api-client";

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

  useEffect(() => {
    getApplications().then(({ data }) => {
      setApplications(data);
      setSelectedApp(data[0].id);
    });
  }, []);

  const updateMessages = useCallback(() => {
    if (!selectedApp) return;
    getMessages(selectedApp).then(({ data }) => setMessages(data));
  }, [selectedApp]);

  useEffect(updateMessages, [updateMessages]);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.eventType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const selectedApplication = applications.find((app) => app.id === selectedApp);

  return (
    <div>
      <PageHeader>
        <h1>Messages</h1>
        <Button color="primary">Create Message</Button>
      </PageHeader>

      <FilterWrapper>
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
            application={selectedApplication}
            updateMessages={updateMessages}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Messages;

import { useState, useEffect, FC, useCallback } from "react";
import styled from "styled-components";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
import MessagesList from "../components/Messages/MessagesList";
import { Application, Message } from "../types";
import { getMessages, getApplication } from "../services/api-client";
import { useParams } from "react-router-dom";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchWrapper = styled.div`
  width: 300px;
`;

const ApplicationMessages: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!id) return;
    getApplication(id).then((data) => setApplication(data));
  }, [id]);

  const updateMessages = useCallback(() => {
    if (!application) return;
    getMessages(application.id).then(({ data }) => setMessages(data));
  }, [application]);

  useEffect(updateMessages, [updateMessages]);

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.eventType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div>
      <PageHeader>
        <h1>{application?.name || "Applications"}</h1>
        <div className="d-flex">
          <SearchWrapper className="me-2">
            <InputGroup>
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </SearchWrapper>
          <Button color="primary">Create Message</Button>
        </div>
      </PageHeader>

      <Row>
        <Col>
          <MessagesList
            messages={filteredMessages}
            application={application}
            updateMessages={updateMessages}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ApplicationMessages;

import { FC } from "react";
import styled from "styled-components";
import { Col, Row } from "reactstrap";
import { Application, Message } from "../../types";
import MessageCard from "./MessageCard";

interface MessagesListProps {
  messages: Message[];
  application?: Application;
}

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const MessagesList: FC<MessagesListProps> = ({ messages, application }) => {
  if (messages.length === 0) {
    return (
      <EmptyState>
        <h3>No messages found</h3>
        <p>Create your first message to get started.</p>
      </EmptyState>
    );
  }

  return (
    <Row>
      {messages.map((message) => (
        <Col key={message.id} md={6} lg={4} className="mb-4">
          <MessageCard message={message} application={application} />
        </Col>
      ))}
    </Row>
  );
};

export default MessagesList;

import { FC, useState } from "react";
import classNames from "classnames";
import styled from "styled-components";
import { FiMoreVertical } from "react-icons/fi";
import {
  Badge,
  Button,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverBody,
  Table,
} from "reactstrap";
import { AttemptWithMessage } from "../../types";
import { formatDatetime } from "../../globals/utils";
import AttemptReplayOptions from "./AttemptReplayOptions";
import { recoverEndpoint, replayMissing, resendMessage } from "../../services/api-client";

const ATTEMPT_REPLAY_FORM_ID = "attempt-replay-form";

const MessageTable = styled(Table)`
  margin-top: 15px;

  th {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
  }

  td {
    vertical-align: middle;
  }
`;

const ActionButton = styled(Button)`
  padding: 0;
  background: none;
  border: none;
  color: #666;

  &:hover {
    color: #0d6efd;
    background: none;
  }
`;

interface AttemptWithMessageTableRowProps {
  applicationId: string;
  endpointId: string;
  attempt: AttemptWithMessage;
  onReplaySuccess: () => void;
}

const AttemptWithMessageTableRow: FC<AttemptWithMessageTableRowProps> = ({
  applicationId,
  endpointId,
  attempt,
  onReplaySuccess,
}) => {
  const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false);
  const [replayModalIsOpen, setReplayModalIsOpen] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const togglePopover = () => setPopoverIsOpen((prev) => !prev);

  const toggleReplayModal = () => setReplayModalIsOpen((prev) => !prev);

  const handleReplayClick = () => {
    togglePopover();
    toggleReplayModal();
  };

  const handleSendReplay = (option: 0 | 1 | 2) => {
    const promise =
      option === 0
        ? resendMessage(applicationId, endpointId, attempt.msgId)
        : option === 1
        ? recoverEndpoint(applicationId, endpointId, attempt.timestamp, new Date().toISOString())
        : replayMissing(applicationId, endpointId, attempt.timestamp, new Date().toISOString());

    promise.then(({ success, message }) => {
      if (success) {
        onReplaySuccess();
        toggleReplayModal();
      } else {
        setErrorMessage(message || "An error occurred while trying to replay the message");
        setShowError(true);
      }
    });
  };

  const toggleErrorModal = () => setShowError((prev) => !prev);

  const handleErrorClosed = () => {
    setErrorMessage("");
  };

  return (
    <>
      <tr>
        <td>
          <Badge
            color={classNames({
              success: attempt.status === 0,
              danger: attempt.status === 2,
            })}
            pill
          >
            Failed
          </Badge>
        </td>
        <td>{attempt.msg.eventType}</td>
        <td>{attempt.msgId}</td>
        <td>{formatDatetime(attempt.timestamp)}</td>
        <td>
          <ActionButton type="button" id={attempt.id} onClick={togglePopover}>
            <FiMoreVertical />
          </ActionButton>
          <Popover
            isOpen={popoverIsOpen}
            target={attempt.id}
            toggle={togglePopover}
            trigger="legacy"
          >
            <PopoverBody className="py-1 px-0">
              <ListGroup flush>
                <ListGroupItem tag="button" action onClick={handleReplayClick}>
                  Replay
                </ListGroupItem>
              </ListGroup>
            </PopoverBody>
          </Popover>
        </td>
      </tr>

      <Modal isOpen={replayModalIsOpen} toggle={toggleReplayModal}>
        <ModalHeader toggle={toggleReplayModal}>Replay Messages</ModalHeader>
        <ModalBody>
          <AttemptReplayOptions
            formId={ATTEMPT_REPLAY_FORM_ID}
            attempt={attempt}
            onSendReplay={handleSendReplay}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggleReplayModal}>
            Cancel
          </Button>
          <Button color="primary" type="submit" form={ATTEMPT_REPLAY_FORM_ID}>
            Resend
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

interface AttemptsWithMessageTableProps {
  applicationId: string;
  endpointId: string;
  attempts: AttemptWithMessage[];
  onReplaySuccess: () => void;
}

const AttemptsWithMessageTable: FC<AttemptsWithMessageTableProps> = ({
  applicationId,
  endpointId,
  attempts,
  onReplaySuccess,
}) => {
  return (
    <MessageTable hover>
      <thead>
        <tr>
          <th style={{ width: "5%" }} />
          <th style={{ width: "15%" }}>Event Type</th>
          <th style={{ width: "60%" }}>Message ID</th>
          <th style={{ width: "15%" }}>Timestamp</th>
          <th style={{ width: "5%" }} />
        </tr>
      </thead>
      <tbody>
        {attempts.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center">
              This endpoint has not received any messages yet
            </td>
          </tr>
        ) : (
          attempts.map((attempt) => (
            <AttemptWithMessageTableRow
              key={attempt.id}
              {...{ attempt, applicationId, endpointId, onReplaySuccess }}
            />
          ))
        )}
      </tbody>
    </MessageTable>
  );
};

export default AttemptsWithMessageTable;

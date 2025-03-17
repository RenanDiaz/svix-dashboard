import { FC, useState } from "react";
import {
  Form,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";
import { Attempt } from "../../types";
import { formatDatetime } from "../../globals/utils";

interface AttemptReplayOptionsProps {
  formId: string;
  attempt: Attempt;
  onSendReplay: (option: 0 | 1 | 2) => void;
}

const AttemptReplayOptions: FC<AttemptReplayOptionsProps> = ({ formId, attempt, onSendReplay }) => {
  const [selectedOption, setSelectedOption] = useState<0 | 1 | 2>(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendReplay(selectedOption);
  };

  const last6Chars = attempt.msgId.slice(-6);

  return (
    <Form id={formId} onSubmit={handleSubmit}>
      <ListGroup>
        <ListGroupItem
          tag="button"
          type="button"
          action
          active={selectedOption === 0}
          onClick={() => setSelectedOption(0)}
        >
          <ListGroupItemHeading>
            Resend this message (<code>{last6Chars}</code>)
          </ListGroupItemHeading>
          <ListGroupItemText>Replay just this message</ListGroupItemText>
        </ListGroupItem>
        <ListGroupItem
          tag="button"
          type="button"
          action
          active={selectedOption === 1}
          onClick={() => setSelectedOption(1)}
        >
          <ListGroupItemHeading>Resend all failed messages since</ListGroupItemHeading>
          <ListGroupItemText>
            Resend all failed messages since {formatDatetime(attempt.timestamp)}.
          </ListGroupItemText>
        </ListGroupItem>
        <ListGroupItem
          tag="button"
          type="button"
          action
          active={selectedOption === 2}
          onClick={() => setSelectedOption(2)}
        >
          <ListGroupItemHeading>Replay all missing messages since</ListGroupItemHeading>
          <ListGroupItemText>
            Replay messages never attempted for this endpoint since{" "}
            {formatDatetime(attempt.timestamp)}.
          </ListGroupItemText>
        </ListGroupItem>
      </ListGroup>
    </Form>
  );
};

export default AttemptReplayOptions;

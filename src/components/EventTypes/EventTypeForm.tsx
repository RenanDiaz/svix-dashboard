import { FC, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { createEventType } from "../../services/api-client";

interface EventTypeFormProps {
  formId: string;
  onSuccess: () => void;
}

const EventTypeForm: FC<EventTypeFormProps> = ({ formId, onSuccess }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEventType = {
      name,
      description,
    };

    createEventType(newEventType)
      .then(onSuccess)
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Form id={formId} onSubmit={handleSubmit}>
      <FormGroup floating>
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Label for="name">Name</Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          type="text"
          name="description"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Label for="description">Description</Label>
      </FormGroup>
    </Form>
  );
};

export default EventTypeForm;

import { FC, useEffect, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { createEventType, editEventType, getEventType } from "../../services/api-client";

interface EventTypeFormProps {
  eventTypeName?: string;
  formId: string;
  onSuccess: () => void;
}

const EventTypeForm: FC<EventTypeFormProps> = ({ eventTypeName, formId, onSuccess }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (!eventTypeName) return;
    getEventType(eventTypeName)
      .then((eventType) => {
        setName(eventType.name);
        setDescription(eventType.description);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [eventTypeName]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEventType = {
      name,
      description: description || undefined,
    };

    if (eventTypeName) {
      editEventType(eventTypeName, newEventType)
        .then(onSuccess)
        .catch((err) => {
          console.error(err);
        });
    } else {
      createEventType(newEventType)
        .then(onSuccess)
        .catch((err) => {
          console.error(err);
        });
    }
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

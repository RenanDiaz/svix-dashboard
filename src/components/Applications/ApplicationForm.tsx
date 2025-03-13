import { FC, FormEvent, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { createApplication } from "../../services/api-client";

interface ApplicationFormProps {
  formId: string;
  onSuccess: () => void;
}

const ApplicationForm: FC<ApplicationFormProps> = ({ formId, onSuccess }) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createApplication(name).then((application) => {
      if (application) {
        onSuccess();
        setName("");
      }
    });
  };

  return (
    <Form id={formId} onSubmit={handleSubmit}>
      <FormGroup floating>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Label for="name">Name</Label>
      </FormGroup>
    </Form>
  );
};

export default ApplicationForm;

import { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Application } from "../../types";
import {
  createEndpoint,
  editEndpoint,
  getApplications,
  getEndpoint,
} from "../../services/api-client";

interface EndpointFormProps {
  applicationId?: string;
  endpointId?: string;
  formId: string;
  onSuccess: () => void;
}

const EndpointForm: FC<EndpointFormProps> = ({ applicationId, endpointId, formId, onSuccess }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [channels, setChannels] = useState<string[]>([]);

  useEffect(() => {
    getApplications().then(({ data }) => {
      setApplications(data);
      if (data.length === 1) setSelectedApp(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!applicationId || !endpointId) return;
    setSelectedApp(applicationId);
    getEndpoint(applicationId, endpointId)
      .then((endpoint) => {
        setDescription(endpoint.description);
        setUrl(endpoint.url);
        setChannels(endpoint.channels || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [applicationId, endpointId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEndpoint = {
      description,
      url,
      channels,
    };

    if (endpointId) {
      editEndpoint(selectedApp, endpointId, newEndpoint)
        .then(onSuccess)
        .catch((err) => {
          console.error(err);
        });
    } else {
      createEndpoint(selectedApp, newEndpoint)
        .then(onSuccess)
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleAddChannel = () => {
    setChannels([...channels, ""]);
  };

  const handleChannelChange = (index: number, value: string) => {
    const newChannels = [...channels];
    newChannels[index] = value;
    setChannels(newChannels);
  };

  return (
    <Form id={formId} onSubmit={handleSubmit}>
      <FormGroup floating>
        <Input
          type="select"
          name="application"
          id="application"
          placeholder="Application"
          value={selectedApp}
          onChange={(e) => setSelectedApp(e.target.value)}
          required
          disabled={!!applicationId}
        >
          <option value="" disabled>
            Select an application
          </option>
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.name}
            </option>
          ))}
        </Input>
        <Label for="application">Application</Label>
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
      <FormGroup floating>
        <Input
          type="text"
          name="url"
          id="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <Label for="url">URL</Label>
      </FormGroup>
      <Card>
        <CardHeader>
          <Row>
            <Col>Channels</Col>
            <Col xs="auto">
              <Button color="primary" size="sm" onClick={handleAddChannel}>
                Add Channel
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          {channels.map((channel, index) => (
            <FormGroup key={index}>
              <Input
                type="text"
                value={channel}
                onChange={(e) => handleChannelChange(index, e.target.value)}
              />
            </FormGroup>
          ))}
        </CardBody>
      </Card>
    </Form>
  );
};

export default EndpointForm;

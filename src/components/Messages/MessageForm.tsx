import { FC, FormEvent, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Application, EventType } from "../../types";
import { createMessage, getApplications, getEventTypes } from "../../services/api-client";
import styled from "styled-components";

const Textarea = styled(Input)`
  field-sizing: content;
`;

interface MessageFormProps {
  formId: string;
  onSuccess: () => void;
}

interface Field {
  key: string;
  value: string;
}

const MessageForm: FC<MessageFormProps> = ({ formId, onSuccess }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string>("");
  const [channels, setChannels] = useState<string[]>([""]);
  const [fields, setFields] = useState<Field[]>([{ key: "", value: "" }]);
  const [fieldsString, setFieldsString] = useState<string>("");
  const [showFieldsAsString, setShowFieldsAsString] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    getApplications().then(({ data }) => {
      setApplications(data);
      setSelectedApp(data?.[0].id);
    });
    getEventTypes().then(({ data }) => {
      setEventTypes(data);
      setSelectedEventType(data?.[0].name);
    });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload =
      fieldsString === ""
        ? fields
            .filter(({ key, value }) => key && value)
            .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})
        : Object.entries(JSON.parse(fieldsString)).map(([key, value]) => ({
            key,
            value: value as string,
          }));
    const filteredChannels = channels.filter((channel) => !!channel);
    const selectedChannels = filteredChannels.length > 0 ? filteredChannels : undefined;
    createMessage(selectedApp, selectedEventType, payload, selectedChannels)
      .then(onSuccess)
      .catch((err) => {
        console.error(err);
      });
  };

  const handleAddChannel = () => {
    setChannels([...channels, ""]);
  };

  const handleChannelChange = (index: number, value: string) => {
    const newChannels = [...channels];
    newChannels[index] = value;
    setChannels(newChannels);
  };

  const handleAddfield = () => {
    setFields([...fields, { key: "", value: "" }]);
  };

  const handleFieldStringChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setFieldsString(e.currentTarget.value);
  };

  const toggleFieldsAsString = () => {
    if (showFieldsAsString) {
      const parsedFields = JSON.parse(fieldsString);
      const fields = Object.entries(parsedFields).map(([key, value]) => ({
        key,
        value: value as string,
      }));
      if (fields.length === 0) {
        fields.push({ key: "", value: "" });
      }
      setFields(fields);
      setFieldsString("");
    } else {
      const fieldsString = fields
        .filter(({ key, value }) => key && value)
        .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
      setFieldsString(JSON.stringify(fieldsString, null, 2));
      setFields([]);
    }
    setShowFieldsAsString((prev) => !prev);
  };

  const handleBeautifyFields = () => {
    setFieldsString(JSON.stringify(JSON.parse(fieldsString), null, 2));
  };

  const togglePreview = () => setShowPreview((prev) => !prev);

  const filteredChannels = channels.filter((channel) => !!channel);

  return (
    <>
      <Collapse isOpen={!showPreview}>
        <Form id={formId} onSubmit={handleSubmit}>
          <FormGroup floating>
            <Input
              type="select"
              id="application"
              name="application"
              placeholder="Application"
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
            >
              {applications.length === 0 ? (
                <option value="" disabled>
                  No applications
                </option>
              ) : (
                applications.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))
              )}
            </Input>
            <Label for="application">Application</Label>
          </FormGroup>

          <FormGroup floating>
            <Input
              type="select"
              id="eventType"
              name="eventType"
              placeholder="Event Type"
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
            >
              {eventTypes.length === 0 ? (
                <option value="" disabled>
                  No event types
                </option>
              ) : (
                eventTypes.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))
              )}
            </Input>
            <Label for="eventType">Event Type</Label>
          </FormGroup>

          <Card className="mb-3">
            <CardHeader>Channels</CardHeader>
            <CardBody>
              {channels.map((channel, index) => (
                <FormGroup key={index}>
                  <Input
                    type="text"
                    name="channel"
                    id="channel"
                    value={channel}
                    onChange={(e) => handleChannelChange(index, e.target.value)}
                  />
                </FormGroup>
              ))}
              <Button type="button" color="primary" size="sm" onClick={handleAddChannel}>
                Add channel
              </Button>
            </CardBody>
          </Card>

          <Card className="mb-3">
            <CardHeader>
              <Row className="gx-0">
                <Col>Payload</Col>
                {showFieldsAsString && (
                  <Col xs="auto">
                    <Button type="button" color="link" size="sm" onClick={handleBeautifyFields}>
                      Beautify
                    </Button>
                  </Col>
                )}
                <Col xs="auto">
                  <Button type="button" color="link" size="sm" onClick={toggleFieldsAsString}>
                    {showFieldsAsString ? "Show form" : "Show as string"}
                  </Button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {showFieldsAsString ? (
                <FormGroup>
                  <Textarea
                    type="textarea"
                    name="fieldsString"
                    id="fieldsString"
                    value={fieldsString}
                    onChange={handleFieldStringChange}
                  />
                </FormGroup>
              ) : (
                <>
                  <Row>
                    <Col>
                      <Label for="key">Key</Label>
                    </Col>
                    <Col>
                      <Label for="value">Value</Label>
                    </Col>
                  </Row>
                  {fields.map(({ key, value }, index) => (
                    <Row key={index}>
                      <Col>
                        <FormGroup>
                          <Input
                            type="text"
                            name="key"
                            id={`key-${index}`}
                            value={key}
                            onChange={(e) => {
                              const newPayload = [...fields];
                              newPayload[index].key = e.target.value;
                              setFields(newPayload);
                            }}
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Input
                            type="text"
                            name="value"
                            id={`value-${index}`}
                            value={value}
                            onChange={(e) => {
                              const newPayload = [...fields];
                              newPayload[index].value = e.target.value;
                              setFields(newPayload);
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ))}
                  <Button type="button" color="primary" size="sm" onClick={handleAddfield}>
                    Add field
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </Form>
      </Collapse>

      <Button type="button" color="primary" onClick={togglePreview}>
        {showPreview ? "Edit" : "Preview"}
      </Button>

      <Collapse isOpen={showPreview}>
        <Card className="mt-3">
          <CardHeader>Preview</CardHeader>
          <CardBody>
            <p>Application: {applications.find(({ id }) => id === selectedApp)?.name}</p>
            <pre>
              {JSON.stringify(
                {
                  eventType: selectedEventType,
                  channels: filteredChannels.length > 0 ? filteredChannels : undefined,
                  payload: fields
                    .filter(({ key, value }) => key && value)
                    .reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
                },
                null,
                2
              )}
            </pre>
          </CardBody>
        </Card>
      </Collapse>
    </>
  );
};

export default MessageForm;

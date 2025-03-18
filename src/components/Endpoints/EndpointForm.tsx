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
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { Application, EventType } from "../../types";
import {
  createEndpoint,
  editEndpoint,
  getApplications,
  getEndpoint,
  getEventTypes,
} from "../../services/api-client";
import { createHierarchicalTree, stringArraysAreEqual, TreeNode } from "../../globals/utils";
import ErrorModal from "../ErrorModal";

interface TypeNodeProps {
  name: string;
  children?: TreeNode[];
  selectedFilterTypes: string[];
  onToggleFilterType: (name: string) => void;
}

const TypeNode: FC<TypeNodeProps> = ({
  name,
  children,
  selectedFilterTypes,
  onToggleFilterType,
}) => {
  return (
    <div className="ms-3">
      <FormGroup key={name} check>
        <Label check>
          <Input
            type="checkbox"
            checked={selectedFilterTypes.includes(name)}
            onChange={() => onToggleFilterType(name)}
          />
          {name}
        </Label>
      </FormGroup>
      {children &&
        children.map((child) => (
          <TypeNode
            key={child.name}
            {...child}
            selectedFilterTypes={selectedFilterTypes}
            onToggleFilterType={onToggleFilterType}
          />
        ))}
    </div>
  );
};

const updateSelectionWithParentNodes = (nodes: TreeNode[], selectedNodes: string[]): string[] => {
  const selectedNodesSet = new Set(selectedNodes);
  const newSelectedNodes = new Set(selectedNodes);

  nodes.forEach((node) => {
    if (node.children) {
      const childrenNames = node.children.map(({ name }) => name);
      if (childrenNames.every((name) => selectedNodesSet.has(name))) {
        newSelectedNodes.add(node.name);
      } else {
        newSelectedNodes.delete(node.name);
      }
    }
  });

  return Array.from(newSelectedNodes);
};

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
  const [filterTypes, setFilterTypes] = useState<EventType[]>([]);
  const [filterTypesHierarchy, setFilterTypesHierarchy] = useState<TreeNode[]>([]);
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    getApplications().then(({ data }) => {
      setApplications(data);
      if (data.length === 1) setSelectedApp(data[0].id);
    });
    getEventTypes().then(({ data }) => {
      setFilterTypes(data);
      const nodes = createHierarchicalTree(data.map(({ name }) => name));
      setFilterTypesHierarchy(nodes);
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
        setSelectedFilterTypes(endpoint.filterTypes || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [applicationId, endpointId]);

  useEffect(() => {
    const processedSelectedFilterTypes = updateSelectionWithParentNodes(
      filterTypesHierarchy,
      selectedFilterTypes
    );
    if (!stringArraysAreEqual(selectedFilterTypes, processedSelectedFilterTypes)) {
      setSelectedFilterTypes(processedSelectedFilterTypes);
    }
  }, [selectedFilterTypes, filterTypesHierarchy]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ft = filterTypes
      .filter(({ name }) => selectedFilterTypes.includes(name))
      .map(({ name }) => name);
    const ch = channels.filter((channel) => channel.trim() !== "");

    const newEndpoint = {
      description,
      url,
      channels: ch,
      filterTypes: ft,
    };

    if (endpointId) {
      editEndpoint(selectedApp, endpointId, newEndpoint)
        .then(onSuccess)
        .catch((err) => {
          console.error(err);
          setErrorMessage("An error occurred while trying to edit the endpoint");
        });
    } else {
      createEndpoint(selectedApp, newEndpoint)
        .then(onSuccess)
        .catch((err) => {
          console.error(err);
          setErrorMessage("An error occurred while trying to create the endpoint");
        });
    }
  };

  const handleToggleFilterType = (name: string) => {
    const isChecked = selectedFilterTypes.includes(name);
    if (isChecked) {
      setSelectedFilterTypes(selectedFilterTypes.filter((type) => !type.startsWith(name)));
    } else {
      setSelectedFilterTypes([
        ...selectedFilterTypes,
        ...filterTypes.filter((type) => type.name.startsWith(name)).map(({ name }) => name),
      ]);
    }
  };

  const handleAddChannel = () => {
    setChannels([...channels, ""]);
  };

  const handleRemoveChannel = (index: number) => {
    const newChannels = channels.filter((_, i) => i !== index);
    setChannels(newChannels);
  };

  const handleChannelChange = (index: number, value: string) => {
    const newChannels = [...channels];
    newChannels[index] = value;
    setChannels(newChannels);
  };

  return (
    <>
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

        <Card className="mb-3">
          <CardHeader>Filter Types</CardHeader>
          <CardBody className="ps-0">
            {filterTypesHierarchy.map((node) => (
              <TypeNode
                key={node.name}
                {...node}
                selectedFilterTypes={selectedFilterTypes}
                onToggleFilterType={handleToggleFilterType}
              />
            ))}
          </CardBody>
        </Card>

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
            {channels.length === 0 ? (
              <Row className="justify-content-center">
                <Col xs="auto">No channels</Col>
              </Row>
            ) : (
              channels.map((channel, index) => (
                <FormGroup key={index}>
                  <InputGroup>
                    <Input
                      type="text"
                      value={channel}
                      onChange={(e) => handleChannelChange(index, e.target.value.trim())}
                      autoFocus={index === channels.length - 1}
                    />
                    <Button color="danger" size="sm" onClick={() => handleRemoveChannel(index)}>
                      ×
                    </Button>
                  </InputGroup>
                </FormGroup>
              ))
            )}
          </CardBody>
        </Card>
      </Form>

      <ErrorModal errorMessage={errorMessage} onClosed={() => setErrorMessage("")} />
    </>
  );
};

export default EndpointForm;

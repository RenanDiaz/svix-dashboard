import React, { FC } from "react";
import { Card, CardBody, Placeholder, PlaceholderButton } from "reactstrap";
import styled from "styled-components";

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const AttemptCardPlaceholder: FC = () => {
  return (
    <Card>
      <CardBody>
        <Placeholder animation="glow">
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} className="mb-2" />
          <Placeholder xs={12} className="mb-2" />
        </Placeholder>
        <CardActions>
          <PlaceholderButton color="primary" outline size="sm">
            Retry
          </PlaceholderButton>
        </CardActions>
      </CardBody>
    </Card>
  );
};

export default AttemptCardPlaceholder;

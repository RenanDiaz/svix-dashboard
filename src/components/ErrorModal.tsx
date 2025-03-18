import { FC, useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface ErrorModalProps {
  errorMessage: string;
  onClosed: () => void;
}

const ErrorModal: FC<ErrorModalProps> = ({ errorMessage, onClosed }) => {
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    setShowError(!!errorMessage);
  }, [errorMessage]);

  const toggleErrorModal = () => setShowError((prev) => !prev);

  return (
    <Modal isOpen={showError} toggle={toggleErrorModal} onClosed={onClosed}>
      <ModalHeader toggle={() => setShowError(false)}>Error</ModalHeader>
      <ModalBody>{errorMessage}</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setShowError(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ErrorModal;

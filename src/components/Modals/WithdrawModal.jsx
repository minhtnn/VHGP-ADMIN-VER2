import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  FormGroup,
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Alert,
} from "reactstrap";

// Function to format number input
const formatNumber = (value) => {
  const numericValue = value.toString();
  const cleanedValue = numericValue.replace(/\D/g, "");
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const WithdrawModal = ({ isOpen, toggle }) => {
  // State for input field
  const [withdrawAmount, setWithdrawAmount] = useState("");
  // State for success or error message
  const [message, setMessage] = useState("");
  // State for displaying loading state
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for personal account
  const accountData = [{ label: "Tài khoản cá nhân: ", value: "9.000.000.000 đ" }];

  // Handle withdrawing money
  const handleWithdraw = () => {
    // Simulate loading state
    setIsLoading(true);

    // Simulate success or error message
    setTimeout(() => {
      const amount = parseInt(withdrawAmount.replace(/\./g, ""), 10);

      if (!amount || amount <= 0) {
        setMessage("Vui lòng nhập số tiền hợp lệ");
      } else {
        // Add your withdrawal logic here
        console.log("Withdraw amount:", withdrawAmount);
        setMessage("Rút tiền thành công!");
        // Reset input field
        setWithdrawAmount("");
      }
      // Clear loading state after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }, 1000);
  };

  const handleBlur = () => {
    const amount = parseInt(withdrawAmount.replace(/\./g, ""), 10);
    if (!amount || amount <= 0) {
      setWithdrawAmount("");
    }
  };

  // Reset message when modal is toggled
  const handleToggle = () => {
    toggle();
    setMessage("");
  };

  return (
    <Modal isOpen={isOpen} toggle={handleToggle}>
      <ModalHeader toggle={handleToggle}>Rút tiền</ModalHeader>
      <ModalBody>
        <Row >
          {accountData.map((account, index) => (
            <Col key={index} sm="12">
              <Card className="mb-3">
                <CardBody >
                  <Row>
                    <Col xs="6" >
                      <CardTitle tag="h4">{account.label}</CardTitle>
                    </Col>
                    <Col xs="6" className="text-right">
                      <p>{account.value}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <FormGroup>
          <Label for="withdrawAmount">Nhập số tiền muốn rút</Label>
          <Input
            type="text"
            id="withdrawAmount"
            value={formatNumber(withdrawAmount)}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            onBlur={handleBlur}
            placeholder="Nhập số tiền"
          />
        </FormGroup>
        {message && (
          <Alert color={message.includes("thành công") ? "success" : "danger"}>
            {message}
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleWithdraw} disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Rút tiền"}
        </Button>{" "}
        <Button color="secondary" onClick={handleToggle} disabled={isLoading}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default WithdrawModal;

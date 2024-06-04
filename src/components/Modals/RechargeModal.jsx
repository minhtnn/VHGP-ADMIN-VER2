import React, { useState } from 'react';
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
  Alert
} from 'reactstrap';

// Function to format number input
const formatNumber = (value) => {
  const numericValue = value.toString();
  const cleanedValue = numericValue.replace(/\D/g, '');
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const RechargeModal = ({ isOpen, toggle }) => {
  // State for input field
  const [rechargeAmount, setRechargeAmount] = useState('');
  // State for success or error message
  const [message, setMessage] = useState('');
  // State for displaying loading state
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for personal and collection accounts
  const accountData = [
    { label: 'Tài khoản cá nhân', value: '9.000.000.000 đ' },
  ];

  // Handle recharging money
  const handleRecharge = () => {
    // Simulate loading state
    setIsLoading(true);

    // Simulate success or error message
    setTimeout(() => {
      const amount = parseInt(rechargeAmount.replace(/\./g, ''), 10);

      if (!amount || amount <= 0) {
        setMessage('Vui lòng nhập số tiền hợp lệ');
      } else {
        // Add your recharge logic here
        console.log('Recharge amount:', rechargeAmount);
        setMessage('Nạp tiền thành công!');
        // Reset input field
        setRechargeAmount('');
      }
      // Clear loading state after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }, 1000);
  };

  const handleBlur = () => {
    const amount = parseInt(rechargeAmount.replace(/\./g, ''), 10);
    if (!amount || amount <= 0) {
      setRechargeAmount('');
    }
  };

  // Reset message when modal is toggled
  const handleToggle = () => {
    toggle();
    setMessage('');
  };

  return (
    <Modal isOpen={isOpen} toggle={handleToggle}>
      <ModalHeader toggle={handleToggle}>Nạp tiền</ModalHeader>
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
          <Label for="rechargeAmount">Nhập số tiền muốn nạp</Label>
          <Input
            type="text"
            id="rechargeAmount"
            value={formatNumber(rechargeAmount)}
            onChange={(e) => setRechargeAmount(e.target.value)}
            onBlur={handleBlur}
            placeholder="Nhập số tiền"
          />
        </FormGroup>
        {message && (
          <Alert color={message.includes('thành công') ? 'success' : 'danger'}>
            {message}
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={handleRecharge} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Nạp tiền'}
        </Button>{' '}
        <Button color="secondary" onClick={handleToggle} disabled={isLoading}>
          Hủy
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RechargeModal;

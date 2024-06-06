import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

const TransactionHistoryModal = ({ isOpen, toggle }) => {
  // Sample transaction data
  const initialTransactions = [
    { id: 1, date: '2024-06-01', time: '08:30:00', amount: '500.000 đ', type: 'deposit', balance: '1.500.000 đ', admin: 'Admin1' },
    { id: 2, date: '2024-06-02', time: '12:45:00', amount: '300.000 đ', type: 'withdraw', balance: '1.200.000 đ', admin: 'Admin2' },
    { id: 3, date: '2024-06-03', time: '09:15:00', amount: '700.000 đ', type: 'deposit', balance: '1.900.000 đ', admin: 'Admin1' },
    { id: 4, date: '2024-06-04', time: '08:30:00', amount: '500.000 đ', type: 'deposit', balance: '2.400.000 đ', admin: 'Admin2' },
    { id: 5, date: '2024-06-05', time: '12:45:00', amount: '300.000 đ', type: 'withdraw', balance: '2.100.000 đ', admin: 'Admin3' },
    { id: 6, date: '2024-06-06', time: '09:15:00', amount: '700.000 đ', type: 'deposit', balance: '2.800.000 đ', admin: 'Admin1' },
    { id: 7, date: '2024-06-06', time: '08:30:00', amount: '500.000 đ', type: 'deposit', balance: '3.300.000 đ', admin: 'Admin2' },
    { id: 8, date: '2024-06-07', time: '12:45:00', amount: '300.000 đ', type: 'withdraw', balance: '3.000.000 đ', admin: 'Admin3' },
    { id: 9, date: '2024-06-07', time: '09:15:00', amount: '700.000 đ', type: 'deposit', balance: '3.700.000 đ', admin: 'Admin1' },
    { id: 10, date: '2024-06-01', time: '08:30:00', amount: '500.000 đ', type: 'deposit', balance: '4.200.000 đ', admin: 'Admin1' },
    { id: 11, date: '2024-06-02', time: '12:45:00', amount: '300.000 đ', type: 'withdraw', balance: '3.900.000 đ', admin: 'Admin2' },
    { id: 12, date: '2024-06-03', time: '09:15:00', amount: '700.000 đ', type: 'deposit', balance: '4.600.000 đ', admin: 'Admin1' },
    { id: 13, date: '2024-06-04', time: '08:30:00', amount: '500.000 đ', type: 'deposit', balance: '5.100.000 đ', admin: 'Admin2' },
    { id: 14, date: '2024-06-05', time: '12:45:00', amount: '300.000 đ', type: 'withdraw', balance: '4.800.000 đ', admin: 'Admin3' },
    { id: 15, date: '2024-06-06', time: '09:15:00', amount: '700.000 đ', type: 'deposit', balance: '5.500.000 đ', admin: 'Admin1' },
    { id: 16, date: '2024-06-06', time: '08:30:00', amount: '500.000 đ', type: 'deposit', balance: '6.000.000 đ', admin: 'Admin2' },
    { id: 17, date: '2024-06-07', time: '12:45:00', amount: '300.000 đ', type: 'withdraw', balance: '5.700.000 đ', admin: 'Admin3' },
    { id: 18, date: '2024-06-07', time: '09:15:00', amount: '700.000 đ', type: 'deposit', balance: '6.400.000 đ', admin: 'Admin1' }
  ];

  // State for transactions
  const [transactions, setTransactions] = useState(initialTransactions);
  // State for selected date
  const [selectedDate, setSelectedDate] = useState('');
  // State for selected type
  const [selectedType, setSelectedType] = useState('');
  // State for selected admin
  const [selectedAdmin, setSelectedAdmin] = useState('');
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  // Number of transactions per page
  const transactionsPerPage = 5;
  // State for filter status
  const [isFiltered, setIsFiltered] = useState(false);

  // Function to handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setIsFiltered(true);
    setCurrentPage(1); // Reset current page when selecting date
  };

  // Function to handle type selection
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setIsFiltered(true);
    setCurrentPage(1); // Reset current page when selecting type
  };

  // Function to handle admin selection
  const handleAdminChange = (e) => {
    setSelectedAdmin(e.target.value);
    setIsFiltered(true);
    setCurrentPage(1); // Reset current page when selecting admin
  };

  // Function to clear filters
  const clearFilters = () => {
    setSelectedDate('');
    setSelectedType('');
    setSelectedAdmin('');
    setIsFiltered(false);
    setCurrentPage(1);
  };

  // Function to paginate transactions
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Logic to filter transactions based on selected date, type, and admin
  const filteredTransactions = isFiltered
    ? transactions.filter((transaction) => {
        if (selectedDate && selectedType && selectedAdmin) {
          return transaction.date === selectedDate && transaction.type === selectedType && transaction.admin === selectedAdmin;
        } else if (selectedDate && selectedType) {
          return transaction.date === selectedDate && transaction.type === selectedType;
        } else if (selectedDate && selectedAdmin) {
          return transaction.date === selectedDate && transaction.admin === selectedAdmin;
        } else if (selectedType && selectedAdmin) {
          return transaction.type === selectedType && transaction.admin === selectedAdmin;
        } else if (selectedDate) {
          return transaction.date === selectedDate;
        } else if (selectedType) {
          return transaction.type === selectedType;
        } else if (selectedAdmin) {
          return transaction.admin === selectedAdmin;
        } else {
          return true;
        }
      })
    : transactions;

  // Sort transactions by id in descending order
  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.id - a.id);

  // Logic to get current transactions for the current page
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Generate pagination items
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedTransactions.length / transactionsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" style={{ maxWidth: '80%', maxHeight: '90%' }}>
      <ModalHeader toggle={toggle}>Lịch sử giao dịch</ModalHeader>
      <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="mb-3 d-flex align-items-center">
          <div className="mr-3">
            <InputGroup>
              
              <Input type="date" value={selectedDate} onChange={handleDateChange}  />
            </InputGroup>
          </div>
          <div className="mr-3">
            <InputGroup>
            <Input type="select" onChange={handleTypeChange} value={selectedType}>
              <option value="" >Loại giao dịch</option>
              <option value="deposit">Nạp tiền</option>
              <option value="withdraw">Rút tiền</option>
            </Input>

            </InputGroup>
          </div>
          <div className="mr-3">
            <InputGroup>
              
            <Input type="select" onChange={handleAdminChange}  value={selectedAdmin}>
              <option value="">Admin</option>
              <option value="Admin1">Admin1</option>
              <option value="Admin2">Admin2</option>
              <option value="Admin3">Admin3</option>
            </Input>

            </InputGroup>
          </div>
          <div className="ml-auto">
            {isFiltered && (
              <Button color="secondary" onClick={clearFilters}>Xóa bộ lọc</Button>
            )}
          </div>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Ngày</th>
              <th>Thời gian</th>
              <th>Loại</th>
              <th>Số tiền</th>
              <th>Số dư</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.date}</td>
                <td>{transaction.time}</td>
                <td>{transaction.type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}</td>
                <td className={transaction.type === 'deposit' ? 'text-success' : 'text-danger'}>
                  {transaction.type === 'deposit' ? '+' : '-'} {transaction.amount}
                </td>
                <td>{transaction.balance}</td>
                <td>{transaction.admin}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end">
          <Pagination>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
            </PaginationItem>
            {pageNumbers.map((number) => (
              (number >= currentPage && number < currentPage + 3) &&
              <PaginationItem key={number} active={number === currentPage}>
                <PaginationLink onClick={() => paginate(number)}>
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={currentPage === Math.ceil(sortedTransactions.length / transactionsPerPage)}>
              <PaginationLink next onClick={() => paginate(currentPage + 1)} />
            </PaginationItem>
          </Pagination>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Đóng</Button>
      </ModalFooter>
    </Modal>
  );
};

export default TransactionHistoryModal;

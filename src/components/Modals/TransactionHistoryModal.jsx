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
    { id: 1, date: '2024-06-01', time: '08:30:00', amount: '500.000 đ', type: 'deposit' },
    { id: 2, date: '2024-06-02', time: '12:45:00', amount: '300.000 đ', type: 'withdraw' },
    { id: 3, date: '2024-06-03', time: '09:15:00', amount: '700.000 đ', type: 'deposit' },
    { id: 4, date: '2024-06-04', time: '08:30:00', amount: '500.000 đ', type: 'deposit' },
    { id: 5, date: '2024-06-05', time: '12:45:00', amount: '300.000 đ', type: 'withdraw' },
    { id: 6, date: '2024-06-06', time: '09:15:00', amount: '700.000 đ', type: 'deposit' },
    { id: 7, date: '2024-06-06', time: '08:30:00', amount: '500.000 đ', type: 'deposit' },
    { id: 8, date: '2024-06-07', time: '12:45:00', amount: '300.000 đ', type: 'withdraw' },
    { id: 9, date: '2024-06-07', time: '09:15:00', amount: '700.000 đ', type: 'deposit' },
    { id: 10, date: '2024-06-01', time: '08:30:00', amount: '500.000 đ', type: 'deposit' },
    { id: 11, date: '2024-06-02', time: '12:45:00', amount: '300.000 đ', type: 'withdraw' },
    { id: 12, date: '2024-06-03', time: '09:15:00', amount: '700.000 đ', type: 'deposit' },
    { id: 13, date: '2024-06-04', time: '08:30:00', amount: '500.000 đ', type: 'deposit' },
    { id: 14, date: '2024-06-05', time: '12:45:00', amount: '300.000 đ', type: 'withdraw' },
    { id: 15, date: '2024-06-06', time: '09:15:00', amount: '700.000 đ', type: 'deposit' },
    { id: 16, date: '2024-06-06', time: '08:30:00', amount: '500.000 đ', type: 'deposit' },
    { id: 17, date: '2024-06-07', time: '12:45:00', amount: '300.000 đ', type: 'withdraw' },
    { id: 18, date: '2024-06-07', time: '09:15:00', amount: '700.000 đ', type: 'deposit' }
  ];

  // State for transactions
  const [transactions, setTransactions] = useState(initialTransactions);
  // State for selected date
  const [selectedDate, setSelectedDate] = useState('');
  // State for selected type
  const [selectedType, setSelectedType] = useState('');
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

  // Function to clear filters
  const clearFilters = () => {
    setSelectedDate('');
    setSelectedType('');
    setIsFiltered(false);
    setCurrentPage(1);
  };

  // Function to paginate transactions
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Logic to filter transactions based on selected date and type
  const filteredTransactions = isFiltered
    ? transactions.filter((transaction) => {
        if (selectedDate && selectedType) {
          return transaction.date === selectedDate && transaction.type === selectedType;
        } else if (selectedDate)
          {
            return transaction.date === selectedDate;
          } else if (selectedType) {
            return transaction.type === selectedType;
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
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Lịch sử giao dịch</ModalHeader>
        <ModalBody>
          <div className="mb-3 d-flex align-items-center">
            <div className="mr-3">
              <InputGroup>
               
                <Input type="date" value={selectedDate} onChange={handleDateChange} />
              </InputGroup>
            </div>
            <div>
              <InputGroup>
                
                <Input type="select" value={selectedType} onChange={handleTypeChange}>
                  <option value="">Tất cả</option>
                  <option value="deposit">Nạp tiền</option>
                  <option value="withdraw">Rút tiền</option>
                </Input>
              </InputGroup>
            </div>
            {isFiltered && (
              <Button color="secondary" className="ml-6" onClick={clearFilters}>Xóa bộ lọc</Button>
            )}
          </div>
          <Table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Ngày</th>
                <th>Thời gian</th>
                <th>Loại</th>
                <th>Số tiền</th>
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
                </tr>
              ))}
            </tbody>
          </Table>
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
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Đóng</Button>
        </ModalFooter>
      </Modal>
    );
  };
  
  export default TransactionHistoryModal;
  
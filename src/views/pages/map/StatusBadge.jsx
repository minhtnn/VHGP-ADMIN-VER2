import React from "react";
import styled from "styled-components";
import { FiberManualRecord } from "@mui/icons-material";

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Đang Giao Hàng":
        return "#4caf50";
      case "Đang Chờ Đơn":
        return "#2196f3";
      case "Offline":
        return "#757575";
      default:
        return "black";
    }
  };

  const Container = styled.div`
    display: inline-flex;
    align-items: center;
    background-color: #f2f2f2;
    padding: 3px 6px;
    border-radius: 10px;
  `;

  const Dot = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${getStatusColor()};
    margin-right: 5px;
  `;

  const StatusText = styled.span`
    color: ${getStatusColor()};
    font-size: 14px;
  `;

  return (
    <Container>
      <Dot />
      <StatusText>{status}</StatusText>
    </Container>
  );
};

export default StatusBadge;

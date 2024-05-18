import React from "react";
import styled from "styled-components";
import { FiberManualRecord } from "@mui/icons-material";

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {

    const st = status.toLowerCase();
    switch (st) {
      case "đang giao hàng":

        return "#4caf50";
      case "đang chờ đơn":
        return "#2196f3";
      case "0ffline":
        return "#757575";
      case "đang chờ":
        return "#2196f3";
      case "đã hoàn thành":
        return "#FF6600";
      case "đã hủy":
        return "#EE0000";
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

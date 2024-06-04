import React from "react";
import styled from "styled-components";
import { FiberManualRecord } from "@mui/icons-material";

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    const st = status;
    switch (st) {
      case 0:
        return "#FFCC33";
      case 1:
        return "#00FFFF";
      case 2:
        return "#33FF33";
      case 3:
        return "#888888";
      default:
        return "#888888";
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

  const statusContent = (status) => {
    if (status === 0) {
      return "Đang chờ đơn";
    } else if (status === 1) {
      return "Đang nhận đơn";
    } else if (status === 2) {
      return "Đang giao hàng";
    } else if (status === 3) {
      return "Offline";
    } else {
      return "Offline";
    }
  };

  return (
    <Container>
      <Dot />
      <StatusText>{statusContent(status)}</StatusText>
    </Container>
  );
};

export default StatusBadge;

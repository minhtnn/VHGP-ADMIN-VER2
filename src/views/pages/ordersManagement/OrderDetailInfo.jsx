import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Tab,
  Tabs,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {GeneralInfo, BillOfLadingDetailInfo, ShipperInfo, CustomerInfo, ShopInfo} from "./OrderDetailPage";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pl: 0, pt: 2.5, pr: 0}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const selectedTab = {
  "&.Mui-selected": {
    color: "black",
    backgroundColor: "white",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
    borderTop: 1,
    borderLeft: 1,
    borderRight: 1,
    borderColor: "divider",
  },
};
const mainBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1400,
  height: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "0.5rem",
};
const boxContainTabsStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  borderTopLeftRadius: "0.5rem",
  borderTopRightRadius: "0.5rem",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
};
export function OrderDetailInfo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={mainBoxStyle}>
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              indicatorColor="none"
              sx={boxContainTabsStyle}
            >
              <Tab label="Thông tin chung" sx={selectedTab} />
              <Tab label="Vận đơn" sx={selectedTab} />
              <Tab label="Người vận chuyển" sx={selectedTab} />
              <Tab label="Khách hàng" sx={selectedTab} />
              <Tab label="Cửa hàng" sx={selectedTab} />
            </Tabs>
            <IconButton
              sx={{ position: "absolute", top: 5, right: 5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <TabPanel value={value} index={0}>
            <GeneralInfo/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BillOfLadingDetailInfo/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ShipperInfo/>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <CustomerInfo/>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <ShopInfo/>
          </TabPanel>
        </Box>
      </Modal>
    </>
  );
}

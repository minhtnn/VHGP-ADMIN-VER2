import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import OrderPage1 from "./OrderPage1";
import OrderPage2 from "./OrderPage2";
import OrderPage3 from "./OrderPage3";
import { Button, Modal } from "@mui/material";

// Start of tab navigation from mui library
function CustomTabPanel(props) {
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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
// End of tab navigation from mui library

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const selectedTab = {
    '&.Mui-selected':{
        color:"black",
        backgroundColor: "white",
        borderRadius: "0.5rem",
      },
      '&:not(.Mui-selected)': { // Explicitly define styles for non-selected tabs
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      }
  }
  const tabStyle = {
    position: "absolute",
    right: 0,
    top: "15.7%",
    zIndex: 1,
    marginRight: "52px",
    marginLeft: "50px",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
  }

  //Set open property for modal/pop-up
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    
    <Box sx={{ width: "100%", backgroundColor: "white" }}>

      {/* Button to open child modal / pop-up */}
      <Button onClick={handleOpen}>Open Child Modal</Button>
      {/* Child modal / pop-up */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 800 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
      {/* End of child modal / pop-up */}
      <Box sx={{backgroundColor: "white"}}>
        {/* Tabs navigation */}
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          orientation="horizontal"
          variant="scrollable"
          indicatorColor="none"
          style={tabStyle}
        >
          <Tab label="Item One" {...a11yProps(0)} sx={selectedTab}/>
          <Tab label="Item Two" {...a11yProps(1)} sx={selectedTab}/>
          <Tab label="Item Three" {...a11yProps(2)} sx={selectedTab}/>
        </Tabs>
      </Box>
      {/* Content of each tab */}

      <Box sx={{backgroundColor: "white" }}>
        <CustomTabPanel value={value} index={0}>
          <OrderPage1 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <OrderPage2 />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <OrderPage3 />
        </CustomTabPanel>
      </Box>
    </Box>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@mui/material/styles";

import { Menu, MenuItem, Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function ShipperMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [shippers, setShippers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://65e177e7a8583365b3166e9d.mockapi.io/datashipper"
        );
        setShippers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        className={classes.menuButton}
        onClick={handleClick}
      >
        Open Shipper Menu
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {shippers.map((shipper) => (
          <MenuItem key={shipper.id} onClick={handleClose}>
            {shipper.id}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

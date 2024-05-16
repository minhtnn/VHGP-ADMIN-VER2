import "./Map.css";
import StatusBadge from "./StatusBadge";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";

import { OnlinePrediction } from "@mui/icons-material";
import WifiTetheringOffIcon from '@mui/icons-material/WifiTetheringOff';
import MenuIcon from "@mui/icons-material/Menu";
import AlarmOutlinedIcon from '@mui/icons-material/AlarmOutlined';
import RoutingLine from "./LeafRoutingMachine";

export default function BasicMap() {
  const [shippers, setShippers] = useState([]);
  const [showDeliveringShippers, setShowDeliveringShippers] = useState(false);
  const [showOfflineShippers, setShowOfflineShippers] = useState(false);
  const [showAvailableShippers, setShowAvailableShippers] = useState(false);

  const mapRef = useRef(null);

  const handleShowDeliveringShippers = () => {
    setShowDeliveringShippers(!showDeliveringShippers);
    setShowAvailableShippers(false);
    setShowOfflineShippers(false);
  };

  const handleShowAvailableShippers = () => {
    setShowAvailableShippers(!showAvailableShippers);
    setShowDeliveringShippers(false);
    setShowOfflineShippers(false);
  };

  const handleShowOfflineShippers = () => {
    setShowOfflineShippers(!showOfflineShippers);
    setShowAvailableShippers(false);
    setShowDeliveringShippers(false);
  };


  const handleShipperClick = (shipper) => {
    const { shipperlocation } = shipper;
    mapRef.current.flyTo(shipperlocation, 18);
  };

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/7541/7541900.png",
    iconSize: [38, 38],
  });

  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  const [showSatellite, setShowSatellite] = useState(() => {
    const storedMapType = localStorage.getItem("mapType");
    return storedMapType === "satellite";
  });

  const toggleMapType = () => {
    const newMapType = !showSatellite;
    setShowSatellite(newMapType);
    localStorage.setItem("mapType", newMapType ? "satellite" : "default");
  };

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

    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const countShippersByStatus = (status) => {
    return shippers.filter((shipper) => shipper.status === status).length;
  };

  const actions = [
    {
      icon: <OnlinePrediction />,
      name: `Shipper đang giao hàng (${countShippersByStatus("Đang Giao Hàng")})`,
      onClick: handleShowDeliveringShippers,
    },
    {
      icon: <AlarmOutlinedIcon />,
      name: `Shipper đang chờ đơn (${countShippersByStatus("Đang Chờ Đơn")})`,
      onClick: handleShowAvailableShippers,
    },
    {
      icon: <WifiTetheringOffIcon />,
      name: `Shipper đang offline (${countShippersByStatus("Offline")})`,
      onClick: handleShowOfflineShippers,
    },
  ];

  const filteredShippers = shippers.filter((shipper) => {
    if (showDeliveringShippers) {
      return shipper.status === "Đang Giao Hàng";
    } else if (showAvailableShippers) {
      return shipper.status === "Đang Chờ Đơn";
    } else if (showOfflineShippers) {
      return shipper.status === "Offline";
    } else {
      // Hiển thị tất cả shipper đang active
      return shipper.active;
    }
  });

  var locations = [
    {
      "longitude": 10.8431579,
      "latitude":106.8365875,
    },
    {
      "longitude": 10.8368910, 
      "latitude":106.8305375,
    }
  ];

  return (
    <>
      <MapContainer ref={mapRef} center={[10.8387503, 106.8347127]} zoom={13}>
        <button className="toggle-btn" onClick={toggleMapType}>
          {showSatellite ? "Switch to Default Map" : "Switch to Satellite Map"}
        </button>

        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            showSatellite
              ? "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <SpeedDial
          ariaLabel="SpeedDial example"
          sx={{ position: "absolute", top: 16, right: 16 }}
          icon={<MenuIcon />}
          direction="down"
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>

        {(showDeliveringShippers || showOfflineShippers || showAvailableShippers) && (
          <List
            sx={{
              width: "100%",
              maxWidth: 315,
              bgcolor: "background.paper",
              borderRadius: "10px",
              overflowY: "auto",
              maxHeight: "505px",
            }}
            style={{
              position: "absolute",
              top: "1%",
              right: "6.5%",
              zIndex: 1000,
            }}
          >
            {filteredShippers.map((shipper) => (
              <React.Fragment key={shipper.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => handleShipperClick(shipper)}
                >
                  <ListItemAvatar>
                    <Avatar alt={shipper.id} src={shipper.img} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={shipper.id}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: "inline" }}
                          color="text.primary"
                        >
                          Biển số xe: {shipper.carindentify}
                          <br />
                          Trạng thái: <StatusBadge status={shipper.status} />
                        </Typography>
                      </>
                    }
                  />
                </ListItem>

                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {filteredShippers.map((shipper) => (
            <Marker
              key={shipper.id}
              position={shipper.shipperlocation}
              icon={customIcon}
            >
              <Popup>
                <img src={shipper.img} alt={shipper.id} />
                <h2>{shipper.id}</h2>
                <p>Kinh độ: {shipper.shipperlocation[0]}</p>
                <p>Vĩ độ: {shipper.shipperlocation[1]}</p>
                <p>Biển số xe: {shipper.carindentify}</p>
                <p>Trạng thái: <StatusBadge status={shipper.status} /></p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <RoutingLine locations={locations}/>
      </MapContainer>
    </>
  );
}

import "./Map.css";
import StatusBadge from "./StatusBadge";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
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
} from "@mui/material";

import { OnlinePrediction } from "@mui/icons-material";
import WifiTetheringOffIcon from "@mui/icons-material/WifiTetheringOff";
import MenuIcon from "@mui/icons-material/Menu";
import AlarmOutlinedIcon from "@mui/icons-material/AlarmOutlined";

export default function BasicMap() {
  const [shippers, setShippers] = useState([]);
  const [showDeliveringShippers, setShowDeliveringShippers] = useState(false);
  const [showOfflineShippers, setShowOfflineShippers] = useState(false);
  const [showAvailableShippers, setShowAvailableShippers] = useState(false);
  const [shipperPaths, setShipperPaths] = useState(() => {
    const savedPaths = localStorage.getItem("shipperPaths");
    return savedPaths ? JSON.parse(savedPaths) : {};
  });
  const [selectedShipperId, setSelectedShipperId] = useState(null);

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
    if (selectedShipperId === shipper.id) {
      // Nếu shipper hiện tại đã được chọn, bỏ chọn và ẩn đường đi
      setSelectedShipperId(null);
    } else {
      // Nếu chọn shipper mới, cập nhật selectedShipperId và hiển thị đường đi
      setSelectedShipperId(shipper.id);
      const shipperlocation = [shipper.latitude, shipper.longitude];
      mapRef.current.flyTo(shipperlocation, 18);
    }
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
          "http://vhgp-api.vhgp.net/api/Shipper/GetRedis"
        );
        setShippers(response.data);
        const newShippers = response.data;
        const newPaths = { ...shipperPaths };

        newShippers.forEach((shipper) => {
          if (!newPaths[shipper.id]) {
            newPaths[shipper.id] = [];
          }
          newPaths[shipper.id].push([
            parseFloat(shipper.latitude),
            parseFloat(shipper.longitude),
          ]);
        });

        localStorage.setItem("shipperPaths", JSON.stringify(newPaths));
        console.log("Final updated paths:", shipperPaths); // Logging the final path structure
        console.log("3s..", shippers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const countShippersByStatus = (status) => {
    return shippers.filter(
      (shipper) => shipper.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const actions = [
    {
      icon: <OnlinePrediction />,
      name: `Shipper đang giao hàng (${countShippersByStatus(
        "Đang Giao Hàng"
      )})`,
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
      return shipper.status.toLowerCase() === "đang giao hàng";
    } else if (showAvailableShippers) {
      return shipper.status.toLowerCase() === "đang chờ đơn";
    } else if (showOfflineShippers) {
      return shipper.status.toLowerCase() === "offline";
    } else {
      // Hiển thị tất cả shipper đang active
      return shipper.isActive;
    }
  });
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
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
        {selectedShipperId && shipperPaths[selectedShipperId] ? (
          <Polyline
            key={
              selectedShipperId + "-" + shipperPaths[selectedShipperId].length
            }
            pathOptions={{ color: getRandomColor(), weight: 5, opacity: 0.7 }}
            positions={shipperPaths[selectedShipperId]}
          />
        ) : null}

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

        {(showDeliveringShippers ||
          showOfflineShippers ||
          showAvailableShippers) && (
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
              position={[shipper.latitude, shipper.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => handleShipperClick(shipper),
              }}
            >
              <Popup>
                <img src={shipper.img} alt={shipper.id} />
                <h2>{shipper.id}</h2>
                <p>Kinh độ: {shipper.latitude}</p>
                <p>Vĩ độ: {shipper.longitude}</p>
                <p>Biển số xe: {shipper.carindentify}</p>
                <p>
                  Trạng thái: <StatusBadge status={shipper.status} />
                </p>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

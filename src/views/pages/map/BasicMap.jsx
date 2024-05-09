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
  Button,
  ButtonGroup,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

export default function BasicMap() {
  const [shippers, setShippers] = useState([]);
  const [showOnlineShippers, setShowOnlineShippers] = useState(false);
  const [showOfflineShippers, setShowOfflineShippers] = useState(false);
  const [showAllShippers, setShowAllShippers] = useState(true); // Mặc định hiển thị tất cả shipper trên map

  const mapRef = useRef(null); // Tham chiếu đến MapContainer để sử dụng flyTo

  const handleShowOnlineShippers = () => {
    setShowOnlineShippers(!showOnlineShippers);
    setShowOfflineShippers(false);
    if (!showAllShippers) {
      setShowAllShippers(true); // Khi chọn hiển thị danh sách online, nếu showAllShippers là false, tức là chỉ đang hiển thị danh sách offline, thì hiển thị tất cả shipper trên map
    }
  };

  const handleShowOfflineShippers = () => {
    setShowOfflineShippers(!showOfflineShippers);
    setShowOnlineShippers(false);
    if (!showOfflineShippers) {
      setShowAllShippers(false); // Khi chọn hiển thị danh sách offline, nếu showOfflineShippers là false, tức là đang ẩn danh sách offline, thì chỉ hiển thị các shipper đang hoạt động trên map
    } else {
      setShowAllShippers(true);
    }
  };

  const handleShipperClick = (shipper) => {
    // Di chuyển đến vị trí của shipper khi click vào ListItem tương ứng
    const { shipperlocation } = shipper;
    mapRef.current.flyTo(shipperlocation, 18);
  };

  // create custom icon
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/7541/7541900.png",
    iconSize: [38, 38],
  });
  // custom cluster icon
  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  // store the user's current map
  const [showSatellite, setShowSatellite] = useState(() => {
    const storedMapType = localStorage.getItem("mapType");
    return storedMapType === "satellite";
  });
  // change skin map
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

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

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

        {/* Button group to show online or offline shippers */}
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled button group"
          style={{
            position: "absolute",
            top: "1.5%",
            right: "1%",
            zIndex: 1000,
          }}
        >
          <Button onClick={handleShowOnlineShippers}>
            {showOnlineShippers ? "Hide Online" : "Show Online"}
          </Button>
          <Button onClick={handleShowOfflineShippers}>
            {showOfflineShippers ? "Hide Offline" : "Show Offline"}
          </Button>
        </ButtonGroup>

        {/* List of shippers */}
        {(showOnlineShippers || showOfflineShippers) && (
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
              top: "7%",
              right: "1%",
              zIndex: 1000,
            }}
          >
            {shippers
              .filter((shipper) =>
                showOnlineShippers ? shipper.active : !shipper.active
              )
              .sort((a, b) => {
                if (a.status === "Đang Chờ Đơn" && b.status !== "Đang Chờ Đơn") {
                  return -1;
                }
                if (a.status !== "Đang Chờ Đơn" && b.status === "Đang Chờ Đơn") {
                  return 1;
                }
                return 0;
              })
              .map((shipper) => (
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
          {/* Mapping through the markers */}
          {shippers.map((shipper) =>
            (showAllShippers && shipper.active) ||
            (showOnlineShippers && shipper.active) ||
            (showOfflineShippers && !shipper.active) ? (
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
            ) : null
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

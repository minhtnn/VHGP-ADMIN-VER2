import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, List, ListItem, ListItemText } from "@mui/material";

export default function BasicMap() {
  const [shippers, setShippers] = useState([]);
  const [showAllShippers, setShowAllShippers] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const mapRef = useRef(null);
  const [showSatellite, setShowSatellite] = useState(() => {
    const storedMapType = localStorage.getItem("mapType");
    return storedMapType === "satellite";
  });

  // create custom icon
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/7541/7541900.png",
    iconSize: [38, 38]
  });

  // custom cluster icon
  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  const toggleMapType = () => {
    const newMapType = !showSatellite;
    setShowSatellite(newMapType);
    localStorage.setItem("mapType", newMapType ? "satellite" : "default");
  };

  const toggleShowAllShippers = () => {
    setShowAllShippers((prevShowAllShippers) => !prevShowAllShippers);
  };

  const handleShipperListClick = (shipper) => {
    setSelectedShipper(shipper);
  };

  useEffect(() => {
    if (selectedShipper) {
      // Move the map center to the selected shipper
      const { shipperlocation } = selectedShipper;
      if (shipperlocation) {
        mapRef.current.setView(shipperlocation);
      }
    }
  }, [selectedShipper]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://65e177e7a8583365b3166e9d.mockapi.io/datashipper");
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
      <MapContainer center={[10.8387503, 106.8347127]} zoom={13} ref={mapRef}>
        <button className="toggle-btn" onClick={toggleMapType}>
          {showSatellite ? "Switch to Default Map" : "Switch to Satellite Map"}
        </button>

        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={showSatellite ? "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {shippers.map((shipper) =>
            showAllShippers || shipper.active ? (
              <Marker key={shipper.id} position={shipper.shipperlocation} icon={customIcon}>
                {selectedShipper && selectedShipper.id === shipper.id && ( // Check if the shipper is selected
                  <Popup> {/* Render Popup only for the selected shipper */}
                    <img src={shipper.img} alt={shipper.id} />
                    <h2>{shipper.id}</h2>
                    <p>Kinh độ: {shipper.shipperlocation[0]}</p>
                    <p>Vĩ độ: {shipper.shipperlocation[1]}</p>
                    <p>Biển số xe: {shipper.carindentify}</p>
                    <p>Trạng thái: {shipper.status}</p>
                  </Popup>
                )}
              </Marker>
            ) : null
          )}
        </MarkerClusterGroup>
        {/* Button to toggle showing all shippers */}
        <Button
          variant="contained"
          color="primary"
          style={{ position: "absolute", top: 20, right: 20, zIndex: 1000 }}
          onClick={toggleShowAllShippers}
        >
          {showAllShippers ? "Hide All Shippers" : "Show All Shippers"}
        </Button>

        {/* List to display all shippers */}
        {showAllShippers && (
          <List style={{ position: "absolute", top: 80, right: 20, zIndex: 1000, maxHeight: "calc(100vh - 120px)", overflowY: "auto", backgroundColor: "#fff", padding: 10, borderRadius: 5, boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}>
            {shippers.map((shipper) => (
              <ListItem key={shipper.id} id={shipper.id} button onClick={() => handleShipperListClick(shipper)}>
                <img src={shipper.img} alt={shipper.id} style={{ width: 50, height: 50, marginRight: 10, borderRadius: "50%" }} />
                <ListItemText
                  primary={shipper.id}
                  secondary={`Status: ${shipper.status}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </MapContainer>
    </>
  );
}

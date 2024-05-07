import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BasicMap() {
  const [shippers, setShippers] = useState([]);

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
 
  const [showSatellite, setShowSatellite] = useState(true);

  const toggleMapType = () => {
    setShowSatellite(!showSatellite);
  };

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
      <MapContainer center={[10.8387503, 106.8347127]} zoom={13}>
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
            shipper.active ? (
              <Marker key={shipper.id} position={shipper.shipperlocation} icon={customIcon}>
                <Popup>
                  <img src={shipper.img} alt={shipper.id} />
                  <h2>{shipper.id}</h2>
                  <p>Kinh độ: {shipper.shipperlocation[0]}</p>
                  <p>Vĩ độ: {shipper.shipperlocation[1]}</p>
                  <p>Biển số xe: {shipper.carindentify}</p>
                  <p>Trạng thái: {shipper.status}</p>
                </Popup>
              </Marker>
            ) : null
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

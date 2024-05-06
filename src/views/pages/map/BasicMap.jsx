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
    iconUrl: require("./icon/Shipper.png"),
    iconSize: [30, 30],
  });

  // custom cluster icon
  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  // fetch shipper data
  async function fetchShipper() {
    const response = await axios.get(
      "https://localhost:7202/api/ShippersControllerAsync/shippers"
    );
    var fetchShippers = response.data;
    var loadShippersList = [];
    for (var index in fetchShippers) {
      var fetchShipper = fetchShippers[index];
      loadShippersList.push({
        id: fetchShipper?.["id"],
        shipperlocation: [fetchShipper?.["longitude"], fetchShipper?.["latitude"]],
      });
    }
    setShippers(loadShippersList);
  }
  useEffect(() => {
    fetchShipper();
    const intervalId = setInterval(fetchShipper, 3000);

  // Clear the interval when the component unmounts
  return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <MapContainer center={[10.8387503, 106.8347127]} zoom={13}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {shippers.map((shipper) => (
            <Marker position={shipper.shipperlocation} icon={customIcon}>
              <Popup>{shipper.id}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

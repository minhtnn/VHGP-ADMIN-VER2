import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { useState, useEffect } from "react";
import axios from "axios";

export default function BasicMap() {
  const [shippers, setShippers] = useState([
    {
      img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ2qdSMEiTswNp5RsrKaReU8M6_u4gGaGFgHuerIvVlbRxYPRs4KnuKPKgTsxmpSyK3fYgo",
      id: "tiendz",
      carindentify: "78N2 - 9999",
      shipperlocation: [10.841209198811928, 106.80988212781875],
      tt: true
    }
  ]);

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

  // fetch shipper data
  async function handelFetchShipper() {
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
    handelFetchShipper();
    const intervalId = setInterval(handelFetchShipper, 3000);

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
            shipper.tt ? (
              <Marker position={shipper.shipperlocation} icon={customIcon}>
                <Popup>
                  <h2>{shipper.id}</h2>
                  <img src={shipper.img} />
                  <p>Kinh do : {shipper.shipperlocation[0]}</p>
                  <p>Vi do : {shipper.shipperlocation[1]}</p>
                  <p>carindentify : {shipper.carindentify}</p>
                </Popup>
              </Marker>
            ) : (
              ""
            )
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

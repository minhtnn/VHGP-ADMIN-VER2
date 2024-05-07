import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { useState, useEffect } from "react";

export default function BasicMap() {
  const [shippers, setShippers] = useState([
    {
      img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ2qdSMEiTswNp5RsrKaReU8M6_u4gGaGFgHuerIvVlbRxYPRs4KnuKPKgTsxmpSyK3fYgo",
      id: "tiendz",
      carindentify: "78N2 - 9999",
      shipperlocation: [10.841209198811928, 106.80988212781875],
      active: true,
      status: "Đang Giao Hàng"
    },
    {
      img: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/282560416_561801205279246_3212359847475128351_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_ohc=nEkcxzfnxmAQ7kNvgH5WpQ7&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfCE_-u27KxeYg5FLNYooLlK3gbctN-5NKYCG1ipcjzzUA&oe=663F9DFD",
      id: "Phuc",
      carindentify: "78N2 - 7777",
      shipperlocation: [10.841659568563355, 106.8389323643706],
      active: false,
      status :""
    },
    {
      img: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-1/415986931_1722706301570984_3168771950712378695_n.jpg?stp=dst-jpg_p480x480&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=_dJkFAtDBq4Q7kNvgFbYXY5&_nc_ht=scontent.fsgn2-5.fna&oh=00_AfBDnVDiQq72JvTneqkzxQovaJtLwPAzSFA8PDduTDC7Zw&oe=663F8C97",
      id: "Minh Tiền",
      carindentify: "78N2 - 8888",
      shipperlocation: [10.837062624590622, 106.81272767807845],
      active: true,
      status: "Đang Chờ Đơn"
    }
  ]);

  const [activeShippers, setActiveShippers] = useState([]);

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
    const activeShippers = shippers.filter(shipper => shipper.active);
    setActiveShippers(activeShippers);
  }, [shippers]);

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
         {/* Mapping through the active shippers */}
         {activeShippers.map((shipper) =>
            <Marker position={shipper.shipperlocation} icon={customIcon}>
              <Popup>
                <img src={shipper.img} />
                <h2>{shipper.id}</h2>
                <p>Kinh do : {shipper.shipperlocation[0]}</p>
                <p>Vi do : {shipper.shipperlocation[1]}</p>
                <p>carindentify : {shipper.carindentify}</p>
                {shipper.status && <p>Trạng thái: {shipper.status}</p>}
              </Popup>
            </Marker>
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

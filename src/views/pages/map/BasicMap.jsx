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
import RoutingLine from "./LeafRoutingMachine";
import {
  getShipperRedis,
  getEndPoitLocation,
  getShipperLocation,
} from "../../../apis/shiperApiService";
import shipperIcon from "./icon/shipper.png";
import order from "./icon/address.png";

export default function BasicMap() {
  const [shippers, setShippers] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: "Order 1",
      img: "https://images.fpt.shop/unsafe/filters:quality(5)/fptshop.com.vn/uploads/images/tin-tuc/174965/Originals/meme-la-gi-5.jpg",
      latitude: "10.8750883",
      longitude: "106.7992",
      status: 1,
      isActive: true,
    },
    {
      id: "Order 2",
      img: "https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/174965/Originals/meme-la-gi-3.jpg",
      latitude: "10.87796",
      longitude: "106.80108",
      status: 1,
      isActive: false,
    },
    {
      id: "Order 3",
      img: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/09/meme-che-15.jpg",
      latitude: "10.87821",
      longitude: "106.79594",
      status: 1,
      isActive: false,
    },
    {
      id: "Order 4",
      img: "https://bizweb.dktcdn.net/100/438/408/files/meme-het-cuu-yody-vn-11.jpg?v=1695455529047",
      latitude: "10.88032",
      longitude: "106.79516",
      status: 1,
      isActive: false,
    },
  ]);
  const [showDeliveringShippers, setShowDeliveringShippers] = useState(false);
  const [showOfflineShippers, setShowOfflineShippers] = useState(false);
  const [showAvailableShippers, setShowAvailableShippers] = useState(false);
  const [showDeliveringOrder, setShowDeliveringOrder] = useState(false);
  const [showAvailableOrder, setShowAvailableOrder] = useState(false);
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [showDoneOrder, setShowDoneOrder] = useState(false);
  const [shipperPaths, setShipperPaths] = useState(() => {
    const savedPaths = localStorage.getItem("shipperPaths");
    return savedPaths ? JSON.parse(savedPaths) : {};
  });
  const [showShipperOrOrder, setShowShipperOrOrder] = useState(true);
  const [selectedShipperId, setSelectedShipperId] = useState(null);

  const [shipperAndOrderPaths, setShipperAndOrderPaths] = useState([]);

  const mapRef = useRef(null);

  const [activePopup, setActivePopup] = useState(null);

  const handleShowDeliveringShippers = () => {
    setShowDeliveringShippers(!showDeliveringShippers);
    setShowAvailableShippers(false);
    setShowOfflineShippers(false);
  };

  const handleShowDeliveringOrders = () => {
    setShowDeliveringOrder(!showDeliveringOrder);
    setShowAvailableOrder(false);
    setShowDoneOrder(false);
    setShowCancelOrder(false);
  };

  const handleShowAvailableShippers = () => {
    setShowAvailableShippers(!showAvailableShippers);
    setShowDeliveringShippers(false);
    setShowOfflineShippers(false);
  };

  const handleShowAvailableOrders = () => {
    setShowAvailableOrder(!showAvailableOrder);
    setShowDeliveringOrder(false);
    setShowDoneOrder(false);
    setShowCancelOrder(false);
  };

  const handleShowDoneOrders = () => {
    setShowDoneOrder(!showDoneOrder);
    setShowDeliveringOrder(false);
    setShowAvailableOrder(false);
    setShowCancelOrder(false);
  };

  const handleShowCancelOrder = () => {
    setShowCancelOrder(!showCancelOrder);
    setShowDeliveringOrder(false);
    setShowAvailableOrder(false);
    setShowDoneOrder(false);
  };

  const handleShowOfflineShippers = () => {
    setShowOfflineShippers(!showOfflineShippers);
    setShowAvailableShippers(false);
    setShowDeliveringShippers(false);
  };

  const handleShipperClick = (shipper) => {
    if (selectedShipperId === shipper.id) {
      setSelectedShipperId(null);
    } else {
      setSelectedShipperId(shipper.id);
      const shipperlocation = [shipper.latitude, shipper.longitude];
      mapRef.current.flyTo(shipperlocation, 18);
    }
  };

  const [selectedShipperIdMap, setSelectedShipperIdMap] = useState(() => {
    return localStorage.getItem("selectedShipperIdMap");
  });

  const handleShipperClickMap = (shipper) => {
    if (selectedShipperIdMap === shipper.id) {
      setSelectedShipperIdMap(null);
      localStorage.setItem("selectedShipperIdMap", null);
    } else {
      setSelectedShipperIdMap(shipper.id);
      localStorage.setItem("selectedShipperIdMap", shipper.id);
    }
    const shipperlocation = [shipper.latitude, shipper.longitude];
    mapRef.current.flyTo(shipperlocation, 18);
  };
  const handleOrderClick = (order) => {
    const orderLocation = [order.latitude, order.longitude];
    mapRef.current.flyTo(orderLocation, 18);
  };

  const customIcon = new Icon({
    iconUrl: showShipperOrOrder ? shipperIcon : order,
    iconSize: [45, 45],
  });

  const handleChange = () => {
    if (showShipperOrOrder) {
      setShowShipperOrOrder(false);
    } else {
      setShowShipperOrOrder(true);
    }
  };

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
        const response = await getShipperRedis();
        setShippers(response.data);
        console.log("Check Shipper", response.data);
        // const newShippers = response.data;
        // const newPaths = { ...shipperPaths };

        // newShippers.forEach((shipper) => {
        //   if (!newPaths[shipper.id]) {
        //     newPaths[shipper.id] = [];
        //   }
        //   newPaths[shipper.id].push([
        //     parseFloat(shipper.latitude),
        //     parseFloat(shipper.longitude),
        //   ]);
        // });

        // localStorage.setItem("shipperPaths", JSON.stringify(newPaths));
        // console.log("Final updated paths:", shipperPaths); // Logging the final path structure
        // const newShipperAndOrder = response.data;
        // const location = {};
        // for (const shipper of newShipperAndOrder) {
        //   if (
        //     shipper.status.toLowerCase() === "1" &&
        //     shipper.id === "an@gmail.com"
        //   ) {
        //     const odApi = await getEndPoitLocation(shipper);
        //     console.log("...", odApi);
        //     const spApi = await getShipperLocation(shipper);
        //     console.log("???", spApi);
        //     if (!location[shipper.id]) {
        //       location[shipper.id] = [];
        //     }
        //     location[shipper.id].push(
        //       {
        //         longitude: spApi.data.longitude,
        //         latitude: spApi.data.latitude,
        //       },
        //       {
        //         longitude: odApi.data.longitude,
        //         latitude: odApi.data.latitude,
        //       }
        //     );
        //     setShipperAndOrderPaths(location);
        //   }
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const countShippersByStatus = (status) => {
    return shippers.filter(
      (shipper) => shipper.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const countOrderByStatus = (status) => {
    return orders.filter((order) => order.status === status).length;
  };

  const actions_1 = [
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

  const actions_2 = [
    {
      icon: <OnlinePrediction />,
      name: `Order đang chờ(${countOrderByStatus(1)})`,
      onClick: handleShowAvailableOrders,
    },
    // {
    //   icon: <AlarmOutlinedIcon />,
    //   name: `Order đang giao(${countOrderByStatus("Đang giao hàng")})`,
    //   onClick: handleShowDeliveringOrders,
    // },
    // {
    //   icon: <WifiTetheringOffIcon />,
    //   name: `Order đã giao hàng thành công (${countOrderByStatus(
    //     "Đã hoàn thành"
    //   )})`,
    //   onClick: handleShowDoneOrders,
    // },
    // {
    //   icon: <WifiTetheringOffIcon />,
    //   name: `Order đã hủy (${countOrderByStatus("Đã hủy")})`,
    //   onClick: handleShowCancelOrder,
    // },
  ];

  const actions = showShipperOrOrder ? actions_1 : actions_2;

  const filterOrders = orders.filter((order) => {
    if (showAvailableOrder) {
      return (order.status = 1);
    } else return true;
  });

  const filteredShippers = shippers.filter((shipper) => {
    if (showDeliveringShippers) {
      return shipper.status.toLowerCase() === "đang giao hàng";
    } else if (showAvailableShippers) {
      return shipper.status.toLowerCase() === "đang chờ đơn";
    } else if (showOfflineShippers) {
      return shipper.status.toLowerCase() === "offline";
    } else {
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

  const handleMarkerClick = (shipper) => {
    handleShipperClickMap(shipper);
  };

  return (
    <>
      <MapContainer ref={mapRef} center={[10.8387503, 106.8347127]} zoom={13}>
        <button className="toggle-btn" onClick={toggleMapType}>
          {showSatellite ? "Default Map" : "Satellite Map"}
        </button>
        <button
          className="toggle-btn"
          style={{ left: "13em" }}
          onClick={handleChange}
        >
          {!showShipperOrOrder ? "Shipper" : "Order"}
        </button>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            showSatellite
              ? "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        {/* {selectedShipperId && shipperPaths[selectedShipperId] ? (
          <Polyline
            key={
              selectedShipperId + "-" + shipperPaths[selectedShipperId].length
            }
            pathOptions={{ color: getRandomColor(), weight: 5, opacity: 0.7 }}
            positions={shipperPaths[selectedShipperId]}
          />
        ) : null} */}

        <SpeedDial
          ariaLabel="SpeedDial example"
          sx={{ position: "absolute", top: 16, right: 16 }}
          icon={<MenuIcon />}
          direction="left"
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

        {(showAvailableOrder ||
          showCancelOrder ||
          showDeliveringOrder ||
          showDoneOrder) && (
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
              top: "85px",
              right: "15px",
              zIndex: 1000,
            }}
          >
            {filterOrders.map((order) => (
              <React.Fragment key={order.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => handleOrderClick(order)}
                >
                  <ListItemAvatar>
                    <Avatar alt={order.id} src={order.img} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={order.id}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: "inline" }}
                          color="text.primary"
                        >
                          Trạng thái:{" "}
                          <StatusBadge
                            status={(order.status = 1 ? "đang chờ đơn" : "")}
                          />
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
              top: "85px",
              right: "15px",
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
          {showShipperOrOrder
            ? filteredShippers.map((shipper) => (
                <Marker
                  key={shipper.id}
                  position={[shipper.latitude, shipper.longitude]}
                  icon={customIcon}
                  zIndexOffset={1000} // Đặt giá trị cao để đảm bảo marker hiển thị trên các lớp khác
                  eventHandlers={{
                    click: () => {
                      handleMarkerClick(shipper);
                    },
                  }}
                >
                  {/* <Popup>
                    <img src={shipper.img} alt={shipper.id} />
                    <h2>{shipper.id}</h2>
                    <p>Kinh độ: {shipper.latitude}</p>
                    <p>Vĩ độ: {shipper.longitude}</p>
                    <p>Biển số xe: {shipper.carindentify}</p>
                    <p>
                      Trạng thái: <StatusBadge status={shipper.status} />
                    </p>
                  </Popup> */}
                  <Popup>
                    {/* <img src={shipper.img} alt={shipper.id} /> */}
                    <h2>{shipper.id}</h2>
                    {/* <p>Kinh độ: {shipper.latitude}</p>
                    <p>Vĩ độ: {shipper.longitude}</p> */}
                    <p>Biển số xe: {shipper.carindentify}</p>
                    <p>
                      Trạng thái: <StatusBadge status={shipper.status} />
                    </p>
                  </Popup>
                </Marker>
              ))
            : filterOrders.map((order) => (
                <Marker
                  key={order.id}
                  position={[order.latitude, order.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    {/* <img src={order.img} alt={order.id} /> */}
                    <h2>{order.id}</h2>
                    {/* <p>Kinh độ: {order.latitude}</p>
                    <p>Vĩ độ: {order.longitude}</p> */}
                    <p>
                      Trạng thái:{" "}
                      <StatusBadge
                        status={(order.status = 1 ? "đang chờ đơn" : "")}
                      />
                    </p>
                  </Popup>
                </Marker>
              ))}
        </MarkerClusterGroup>

        {/* {selectedShipperIdMap && shipperAndOrderPaths[selectedShipperIdMap] ? (
          <RoutingLine
            locations={[
              {
                latitude:
                  shipperAndOrderPaths[selectedShipperIdMap][0].latitude,
                longitude:
                  shipperAndOrderPaths[selectedShipperIdMap][0].longitude,
              },
              {
                latitude:
                  shipperAndOrderPaths[selectedShipperIdMap][1].latitude,
                longitude:
                  shipperAndOrderPaths[selectedShipperIdMap][1].longitude,
              },
            ]}
          />
        ) : null} */}
      </MapContainer>
    </>
  );
}

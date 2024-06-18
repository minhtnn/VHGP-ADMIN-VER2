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
  Fab,
} from "@mui/material";

import { AddIcCallOutlined, OnlinePrediction } from "@mui/icons-material";
import WifiTetheringOffIcon from "@mui/icons-material/WifiTetheringOff";
import MenuIcon from "@mui/icons-material/Menu";
import AlarmOutlinedIcon from "@mui/icons-material/AlarmOutlined";
import RoutingLine from "./LeafRoutingMachine";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import HomeIcon from "@mui/icons-material/Home";
import AddTaskIcon from "@mui/icons-material/AddTask";
import HearingDisabledIcon from "@mui/icons-material/HearingDisabled";
import ElectricMopedIcon from "@mui/icons-material/ElectricMoped";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Button, Drawer, Radio, Space } from "antd";
import { DrawerProps, RadioChangeEvent } from "antd";
import { useHistory } from "react-router-dom";

import {
  getShipperRedis,
  getEndPoitLocation,
  getShipperLocation,
  getAllShipper,
  getTimeShipperOffline,
} from "../../../apis/shiperApiService";
import {
  getOrderWaiting,
  getOrderByShipperId,
  getOrderDetail,
} from "../../../apis/orderApiService";
import shipperIcon from "./icon/shipper.png";
import orderIcon from "./icon/address.png";

export default function BasicMap() {
  const [shippers, setShippers] = useState([]);
  const [orderOfShipper, setOrderOfShipper] = useState({});
  const [allShippers, setAllShippers] = useState([]);
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState({});
  const [showDeliveringShippers, setShowDeliveringShippers] = useState(false);
  const [showOfflineShippers, setShowOfflineShippers] = useState(false);
  const [showAvailableShippers, setShowAvailableShippers] = useState(false);
  const [showOrderTakingShippers, setShowOrderTakingShippers] = useState(false);
  const [showDeliveringOrder, setShowDeliveringOrder] = useState(false);
  const [showAvailableOrder, setShowAvailableOrder] = useState(false);
  const [showCancelOrder, setShowCancelOrder] = useState(false);
  const [showDoneOrder, setShowDoneOrder] = useState(false);
  const [shipperPaths, setShipperPaths] = useState(() => {
    const savedPaths = localStorage.getItem("shipperPaths");
    return savedPaths ? JSON.parse(savedPaths) : {};
  });
  const [showShipperOrOrder, setShowShipperOrOrder] = useState(() => {
    const showShipperOrOrder = localStorage.getItem("showShipperOrOrder");
    return showShipperOrOrder === "shipper";
  });
  const [selectedShipperId, setSelectedShipperId] = useState(null);
  const [timeShipperOffline, setTimeShipperOffline] = useState({});
  const [shipperAndOrderPaths, setShipperAndOrderPaths] = useState([]);
  const [offlineTime, setOfflineTime] = useState(true);

  const history = useHistory();

  const mapRef = useRef(null);

  const onClose = () => {
    setOpen(false);
    setShowAvailableShippers(false);
    setShowOfflineShippers(false);
    setShowOrderTakingShippers(false);
    setShowDeliveringShippers(false);
    setShowAvailableOrder(false);
  };

  const handleShowDeliveringShippers = () => {
    setOpen(true);
    setShowDeliveringShippers(!showDeliveringShippers);
    setShowAvailableShippers(false);
    setShowOfflineShippers(false);
    setShowOrderTakingShippers(false);
  };

  const handleShowAvailableShippers = () => {
    setOpen(true);
    setShowAvailableShippers(!showAvailableShippers);
    setShowDeliveringShippers(false);
    setShowOfflineShippers(false);
    setShowOrderTakingShippers(false);
  };

  const handleShowOfflineShippers = () => {
    setOpen(true);
    setShowOfflineShippers(!showOfflineShippers);
    setShowAvailableShippers(false);
    setShowDeliveringShippers(false);
    setShowOrderTakingShippers(false);
  };

  const handleShowOrderTakingShipper = () => {
    setOpen(true);
    setShowOrderTakingShippers(!showOrderTakingShippers);
    setShowAvailableShippers(false);
    setShowDeliveringShippers(false);
    setShowOfflineShippers(false);
  };

  // const handleShowDeliveringOrders = () => {
  //   setShowDeliveringOrder(!showDeliveringOrder);
  //   setShowAvailableOrder(false);
  //   setShowDoneOrder(false);
  //   setShowCancelOrder(false);
  // };

  const handleShowAvailableOrders = () => {
    setOpen(true);
    setShowAvailableOrder(!showAvailableOrder);
    setShowDeliveringOrder(false);
    setShowDoneOrder(false);
    setShowCancelOrder(false);
  };

  // const handleShowDoneOrders = () => {
  //   setShowDoneOrder(!showDoneOrder);
  //   setShowDeliveringOrder(false);
  //   setShowAvailableOrder(false);
  //   setShowCancelOrder(false);
  // };

  // const handleShowCancelOrder = () => {
  //   setShowCancelOrder(!showCancelOrder);
  //   setShowDeliveringOrder(false);
  //   setShowAvailableOrder(false);
  //   setShowDoneOrder(false);
  // };

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
    iconUrl: showShipperOrOrder ? shipperIcon : orderIcon,
    iconSize: [45, 45],
  });

  const handleChange = () => {
    const newShow = !showShipperOrOrder;
    setShowShipperOrOrder(newShow);
    localStorage.setItem("showShipperOrOrder", newShow ? "shipper" : "order");
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
      // try {
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
      //   if (shipper.id === "an@gmail.com") {
      //     const odApi = await getEndPoitLocation(shipper);
      //     const spApi = await getShipperLocation(shipper);
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
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      // }
      try {
        const response = await getShipperRedis();
        setShippers(response.data);
        console.log("Check Shipper", response.data);

        const NewOrderOfShipper = { ...orderOfShipper };
        for (const shipper of response.data) {
          if (shipper.status === 2 || shipper.status === 1) {
            const responseOrderOfShipper = await getOrderByShipperId(shipper);
            if (!NewOrderOfShipper[shipper.id]) {
              NewOrderOfShipper[shipper.id] = [];
            }
            NewOrderOfShipper[shipper.id].push(responseOrderOfShipper.data);
          }
        }
        setOrderOfShipper(NewOrderOfShipper);
        console.log("check order of shipper", NewOrderOfShipper);

        const newOrderDetail = { ...orderDetail };
        for (const shipper of response.data) {
          const shipperOrders = NewOrderOfShipper[shipper.id];
          if (shipperOrders) {
            for (const s of shipperOrders) {
              const idOrder = s.result[0].orderId;
              try {
                const responseOrderDetail = await getOrderDetail(idOrder);
                if (!newOrderDetail[idOrder]) {
                  newOrderDetail[idOrder] = [];
                }
                newOrderDetail[idOrder].push(responseOrderDetail.data);
              } catch (error) {
                console.error(
                  `Failed to get details for order ID ${idOrder}:`,
                  error
                );
              }
            }
          } else {
            console.warn(`No orders found for shipper ID ${shipper.id}`);
          }
        }
        setOrderDetail(newOrderDetail);
        console.log("check order detail", newOrderDetail);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const responseAllShipper = await getAllShipper();
        setAllShippers(responseAllShipper.data);
        console.log("Check all shippers", responseAllShipper.data);

        const newTimeOffline = { ...timeShipperOffline };
        for (const shipper of responseAllShipper.data) {
          const responseTimeOffline = await getTimeShipperOffline(shipper);
          if (!newTimeOffline[shipper.id]) {
            newTimeOffline[shipper.id] = [];
          }
          newTimeOffline[shipper.id].push(responseTimeOffline.data);
        }
        setTimeShipperOffline(newTimeOffline);
        console.log("check time offline of shipper", newTimeOffline);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const orderResponse = await getOrderWaiting();
        setOrders(orderResponse.data);
        console.log("check order", orderResponse.data);

        const newOrderDetail = { ...orderDetail };
        for (const Oder of orderResponse.data) {
          const idOrder = Oder.orderId;
          try {
            const responseOrderDetail = await getOrderDetail(idOrder);
            if (!newOrderDetail[idOrder]) {
              newOrderDetail[idOrder] = [];
            }
            newOrderDetail[idOrder].push(responseOrderDetail.data);
          } catch (error) {
            console.error(
              `Failed to get details for order ID ${idOrder}:`,
              error
            );
          }
        }
        setOrderDetail(newOrderDetail);
        console.log("check order detail", newOrderDetail);
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

  const countShippersOffline = (status) => {
    return allShippers.filter((shipper) => shipper.status === status).length;
  };

  // const countOrderByStatus = (status) => {
  //   return orders.filter((order) => order.status === status).length;
  // };

  const actions_1 = [
    {
      icon: <ElectricMopedIcon />,
      name: `Shipper đang giao hàng (${countShippersByStatus(2)})`,
      onClick: handleShowDeliveringShippers,
    },
    {
      icon: <AlarmOutlinedIcon />,
      name: `Shipper đang chờ đơn (${countShippersByStatus(0)})`,
      onClick: handleShowAvailableShippers,
    },
    {
      icon: <AddTaskIcon />,
      name: `Shipper đang nhận đơn (${countShippersByStatus(1)})`,
      onClick: handleShowOrderTakingShipper,
    },
    {
      icon: <HearingDisabledIcon />,
      name: `Shipper đang offline (${countShippersOffline(3)})`,
      onClick: handleShowOfflineShippers,
    },
  ];

  const actions_2 = [
    {
      icon: <AvTimerIcon />,
      name: `Order đang chờ(${orders.length})`,
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

  const filteredShippers = shippers.filter((shipper) => {
    if (showDeliveringShippers) {
      return shipper.status === 2;
    } else if (showAvailableShippers) {
      return shipper.status === 0;
    } else if (showOrderTakingShippers) {
      return shipper.status === 1;
    } else {
      return shipper.isActive;
    }
  });

  const filteredShippersOffline = allShippers.filter((shipper) => {
    if (showOfflineShippers) {
      return shipper.status === 3;
    }
  });
  // function getRandomColor() {
  //   var letters = "0123456789ABCDEF";
  //   var color = "#";
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }
  const handleMarkerClick = (shipper) => {
    handleShipperClickMap(shipper);
  };

  const showTimeShipperOffline = (shipper) => {
    // Directly access the time using the shipper's ID.
    const times = timeShipperOffline[shipper.id];
    let timeParts = times[0].split(".");
    if (timeParts.length === 2) {
      return ["0", timeParts[0], timeParts[1]];
    }
    return timeParts;
  };

  return (
    <>
      <MapContainer ref={mapRef} center={[10.8416, 106.8411]} zoom={16}>
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
          sx={{
            position: "absolute",
            top: "4.5%", // Sử dụng phần trăm cho top
            right: showShipperOrOrder ? "60%" : "70%", // Sử dụng phần trăm cho right để nó thích ứng tốt trên mọi thiết bị
            transform: "translateY(-50%)", // Dùng transform để căn giữa đối tượng so với vị trí top của nó
          }}
          icon={<HomeIcon />}
          direction="right"
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
          <Drawer
            title={showShipperOrOrder ? "Shipper" : "Order"}
            placement="right"
            width={500}
            closable={true}
            onClose={onClose}
            open={open}
            mask={false}
            maskClosable={false}
            maskStyle={{ backgroundColor: "transparent" }} // Thiết lập nền trong suốt
          >
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <ListItem
                  alignItems="flex-start"
                  button
                  onClick={() => handleOrderClick(order)}
                >
                  <ListItemAvatar>
                    <Avatar alt={order.orderId} src={orderIcon} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      Object.keys(orderDetail).length > 0 && (
                        <>
                          <div style={{ flexGrow: 1 }}>
                            {orderDetail[order.orderId][0].storeName}
                          </div>
                        </>
                      )
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: "inline" }}
                          color="text.primary"
                        >
                          {Object.keys(orderDetail).length > 0 && (
                            <>
                              <span>Oder : </span>
                              <span style={{ fontWeight: "bold" }}>
                                {orderDetail[order.orderId][0].orderNote}
                              </span>
                              <br />
                            </>
                          )}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>

                <Divider variant="inset" />
              </React.Fragment>
            ))}
          </Drawer>
        )}
        {showAvailableShippers && (
          <Drawer
            title={showShipperOrOrder ? "Shipper" : "Order"}
            placement="right"
            width={500}
            closable={true}
            onClose={onClose}
            open={open}
            mask={false}
            maskClosable={false}
            maskStyle={{ backgroundColor: "transparent" }} // Thiết lập nền trong suốt
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
                    style={{ fontWeight: "bold" }}
                    primary={
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ fontWeight: "bold" }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ flexGrow: 1 }}>{shipper.name}</div>
                          <StatusBadge
                            sx={{ marginLeft: "87px" }}
                            status={shipper.status}
                          />
                        </div>
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: "inline" }}
                          color="text.primary"
                        >
                          <span>Id shipper: </span>
                          <span style={{ fontWeight: "bold" }}>
                            {shipper.id}
                          </span>
                          <br />
                          <span>Biển số xe: </span>
                          <span style={{ fontWeight: "bold" }}>
                            {shipper.carindentify}
                          </span>
                        </Typography>
                      </>
                    }
                  />
                </ListItem>

                <Divider variant="inset" />
              </React.Fragment>
            ))}
          </Drawer>
        )}
        {(showDeliveringShippers || showOrderTakingShippers) && (
          <Drawer
            title={showShipperOrOrder ? "Shipper" : "Order"}
            placement="right"
            width={500}
            closable={true}
            onClose={onClose}
            open={open}
            mask={false}
            maskClosable={false}
            maskStyle={{ backgroundColor: "transparent" }} // Thiết lập nền trong suốt
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
                    style={{ fontWeight: "bold" }}
                    primary={
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ fontWeight: "bold" }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ flexGrow: 1 }}>{shipper.name}</div>
                          <StatusBadge
                            sx={{ marginLeft: "87px" }}
                            status={shipper.status}
                          />
                        </div>
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: "inline" }}
                          color="text.primary"
                        >
                          <span>Id shipper: </span>
                          <span style={{ fontWeight: "bold" }}>
                            {shipper.id}
                          </span>
                          <br />
                          <span>
                            {orderOfShipper[shipper.id].map((s) => (
                              <>
                                {/* <span>Id order: </span>
                                <span style={{ fontWeight: "bold" }}>
                                  {s.result[0].orderId},
                                </span> */}
                                {Object.keys(orderDetail).length > 0 && (
                                  <>
                                    <span>Shop : </span>
                                    <span style={{ fontWeight: "bold" }}>
                                      {
                                        orderDetail[s.result[0].orderId][0]
                                          .storeName
                                      }
                                    </span>
                                    <br />
                                    <span>Oder : </span>
                                    <span style={{ fontWeight: "bold" }}>
                                      {
                                        orderDetail[s.result[0].orderId][0]
                                          .orderNote
                                      }
                                    </span>
                                    <br />
                                  </>
                                )}
                              </>
                            ))}
                          </span>
                        </Typography>
                      </>
                    }
                  />
                </ListItem>

                <Divider variant="inset" />
              </React.Fragment>
            ))}
          </Drawer>
        )}
        {showOfflineShippers && (
          <Drawer
            title={showShipperOrOrder ? "Shipper" : "Order"}
            placement="right"
            width={500}
            closable={true}
            onClose={onClose}
            open={open}
            mask={false}
            maskClosable={false}
            maskStyle={{ backgroundColor: "transparent" }} // Thiết lập nền trong suốt
          >
            {filteredShippersOffline.map((shipper) => (
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
                    primary={
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {shipper.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: "inline" }}
                          color="text.primary"
                        >
                          <span>Id shipper: </span>
                          <span style={{ fontWeight: "bold" }}>
                            {shipper.id}
                          </span>
                          <br />
                          <span>Biển số xe: </span>
                          <span style={{ fontWeight: "bold" }}>
                            {shipper.carindentify}
                          </span>
                          <br />
                          Hoạt động {
                            showTimeShipperOffline(shipper)[0]
                          } ngày {showTimeShipperOffline(shipper)[1]} giây trước
                        </Typography>
                      </>
                    }
                  />
                </ListItem>

                <Divider variant="inset" />
              </React.Fragment>
            ))}
          </Drawer>
        )}
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
                  <div className="popup_1">
                    <img src={shipper.img} alt={shipper.id} />
                    <div className="popup_2">
                      <p>
                        <StatusBadge status={shipper.status} />
                      </p>
                      <h2>{shipper.name}</h2>
                    </div>
                  </div>

                  {/* <p>Kinh độ: {shipper.latitude}</p>
                    <p>Vĩ độ: {shipper.longitude}</p> */}
                  {orderOfShipper[shipper.id] ? (
                    <p>
                      {orderOfShipper[shipper.id].map((s) => (
                        <>
                          {/* Id order :{" "} */}
                          {/* <span style={{ fontWeight: "bold" }}>
                            {s.result[0].orderId},
                          </span>
                          <br /> */}
                          {Object.keys(orderDetail).length > 0 && (
                            <>
                              <span>Shop : </span>
                              <span style={{ fontWeight: "bold" }}>
                                {orderDetail[s.result[0].orderId][0].storeName}
                              </span>
                              <br />
                              <span>Oder : </span>
                              <span style={{ fontWeight: "bold" }}>
                                {orderDetail[s.result[0].orderId][0].orderNote}
                              </span>
                              <br />
                            </>
                          )}
                          {/* <Fab
                            variant="extended"
                            size="small"
                            color="primary"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              margin: "0 auto",
                              top: "15px",
                            }}
                            onClick={() => {
                              history.push(
                                `/admin/order/${s.result[0].orderId}`
                              );
                            }}
                          >
                            Order detail
                          </Fab>
                          <br /> */}
                        </>
                      ))}
                    </p>
                  ) : (
                    " "
                  )}
                </Popup>
              </Marker>
            ))
          : orders.map((order) => (
              <Marker
                key={order.orderId}
                position={[order.latitude, order.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    {/* <img src={order.img} alt={order.id} /> */}
                    {Object.keys(orderDetail).length > 0 && (
                      <>
                        <h2>{orderDetail[order.orderId][0].storeName}</h2>
                        <span>Oder : </span>
                        <span style={{ fontWeight: "bold" }}>
                          {orderDetail[order.orderId][0].orderNote}
                        </span>
                        <br />
                      </>
                    )}
                    {/* <Fab
                      variant="extended"
                      size="small"
                      color="primary"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "0 auto",
                        top: "15px",
                      }}
                      onClick={() => {
                        history.push(`/admin/order/${order.orderId}`);
                      }}
                    >
                      Order detail
                    </Fab>
                    <br /> */}
                    {/* <p>Kinh độ: {order.latitude}</p>
                    <p>Vĩ độ: {order.longitude}</p> */}
                  </div>
                </Popup>
              </Marker>
            ))}
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

import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import SimpleHeader from "../../../components/Headers/SimpleHeader";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppProvider";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { notify } from "../../../components/Toast/ToastCustom";
import { postMenu } from "../../../apis/menuApiService";
import Select from "react-select";
import { createOrder } from "../../../apis/orderApiService";

const CreateOrder = () => {
  const { buildingList, storeList, orderList } = useContext(AppContext);
  const [customOrder, setCustomOrder] = useState("");
  const [productInformation, setProductInformation] = useState("");
  const [productInformationState, setProductInformationState] = useState("");
  const [productInformationMessage, setProductInformationMessage] =
    useState("");
  const [createOrderDate, setCreateOrderDate] = useState("");
  const [createOrderDateState, setCreateOrderDateState] = useState("");
  const [createOrderDateMessage, setCreateOrderDateMessage] = useState("");

  const [modeId, setModeId] = useState(""); // loại vận chuyển
  const [modeIdState, setModeIdState] = useState("");
  const [modeIdMessage, setModeIdMessage] = useState("");

  const [timeCreate, setTimeCreate] = useState("");
  const [timeCreateState, setTimeCreateState] = useState("");
  const [timeCreateStateMessage, setTimeCreateMessage] = useState("");
  const [timeReceived, setTimeReceived] = useState("");

  const [store, setStore] = useState("");
  const [storeState, setStoreState] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingState, setBuildingState] = useState("");
  const [name, setName] = useState("");
  const [nameState, setNameState] = useState("");
  const [nameMessage, setNameMessage] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneState, setPhoneState] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [total, setTotal] = useState("");
  const [totalState, setTotalState] = useState("");
  const [noteOfOrder, setNoteOfOrder] = useState("");
  const [noteOfCustomer, setNoteOfCustomer] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentStatusState, setPaymentStatusState] = useState("");

  const [paymentName, setPaymentName] = useState("");
  const [paymentNameState, setPaymentNameState] = useState("");
  const [shipCost, setShipCost] = useState("");
  const [shipCostState, setShipCostState] = useState("");
  const [isLoadingCircle, setIsLoadingCircle] = useState(false);

  const [allOrders, setAllOrders] = useState(null);
  const [allOrdersState, setAllOrdersState] = useState("");

  useEffect(() => {
    console.log("Order List from Context:", orderList); // Log order list from context
  }, [orderList]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: "#dee2e6",
      minHeight: "30px",
      height: "46px",
      // width: "200px",
      boxShadow: state.isFocused ? null : null,
      borderRadius: "0.5rem",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "5px",
    }),
  };

  //Assign values to fields from api
  useEffect(() => {
    if (allOrders) {
      const selectedOrder = orderList.find(
        (order) => order.id === allOrders.value
      );
      if (selectedOrder) {
        setName(selectedOrder.customerName);
        setPhone(selectedOrder.phone);

        const selectedStore = storeList.find(
          (store) => store.name === selectedOrder.storeName
        );
        setStore(
          selectedStore
            ? { label: selectedStore.name, value: selectedStore.id }
            : null
        );

        const selectedBuilding = buildingList.find(
          (building) => building.name === selectedOrder.buildingName
        );
        setBuilding(
          selectedBuilding
            ? { label: selectedBuilding.name, value: selectedBuilding.id }
            : null
        );

        setPaymentStatus({
          label: getPaymentStatus(selectedOrder.paymentStatus),
          value: selectedOrder.paymentStatus,
        });
        setPaymentName({
          label: getPaymentName(selectedOrder.paymentName),
          value: selectedOrder.paymentName,
        });
        setModeId(selectedOrder.modeId);
        setTotal(selectedOrder.total);
        setShipCost(selectedOrder.shipCost);
        setNoteOfOrder(selectedOrder.note);
        setNoteOfCustomer(selectedOrder.note);
      }
    }
  }, [allOrders, orderList]);
  // Ensure orderList is an array before mapping
  const optionsOrder = Array.isArray(orderList)
    ? orderList.map((item) => ({
        label: item.id,
        value: item.id,
      }))
    : [];

  const optionsStore = storeList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const optionsBuilding = buildingList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const getModeId = (item) => {
    switch (item) {
      case 1:
        return "Từ cửa hàng đến hub";
      case 2:
        return "Từ hub đến khách hàng";
      case 3:
        return "Từ cửa hàng đến khách hàng";
      default:
        return "";
    }
  };

  const optionsModeId = [1, 2, 3].map((item) => {
    return {
      label: getModeId(item),
      value: item,
    };
  });

  const getPaymentStatus = (item) => {
    switch (item) {
      case 0:
        return "Chưa thanh toán";
      case 1:
        return "Đã thanh toán";
      case 2:
        return "Đã huỷ";
      default:
        return "";
    }
  };

  const optionsPaymentStatus = [0, 1, 2].map((item) => {
    return {
      label: getPaymentStatus(item),
      value: item,
    };
  });

  const getPaymentName = (item) => {
    switch (item) {
      case 0:
        return "Thu hộ tiền mặt";
      case 1:
        return "Thu hộ chuyển khoản";
      case 2:
        return "Đã thanh toán";
      default:
        return "";
    }
  };

  const optionsPaymentName = [0, 1, 2].map((item) => {
    return {
      label: getPaymentName(item),
      value: item,
    };
  });

  const checkPhoneValid = () => {
    if (phone.match(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im)) {
      return true;
    }
    return false;
  };

  // Get Time and Date current
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setCreateOrderDate(formattedDate);
    setTimeCreate(formattedTime);
    setTimeReceived(formattedTime);
  }, []);

  // Check date time not is past
  const checkDateTime = (date, time) => {
    const dateTimeStr = `${date}T${time}`;
    const selectedDateTime = new Date(dateTimeStr);
    const now = new Date();

    // Kiểm tra xem ngày và thời gian đã chọn có ở quá khứ không
    if (selectedDateTime < now) {
      return false;
    }
    return true;
  };
  const validateCustomStylesForm = () => {
    let valid = true;

    // All Order
    if (allOrders === "") {
      valid = false;
      setAllOrdersState("invalid");
    } else {
      setAllOrdersState("valid");
    }

    // Shipping Type
    if (modeId === "") {
      valid = false;
      setModeIdState("invalid");
    } else {
      setModeIdState("valid");
    }
    // Product information
    switch (true) {
      case productInformation.trim() === "":
        valid = false;
        setProductInformationState("invalid");
        setProductInformationMessage("Thông tin sản phẩm không được để trống");
        break;
      case productInformation.length > 100:
        valid = false;
        setProductInformationState("invalid");
        setProductInformationMessage(
          "Thông tin sản phẩm không được vượt quá 100 kí tự"
        );
        break;
      case !/^[A-Za-z0-9\sÀ-ỹ]{1,100}$/.test(productInformation):
        valid = false;
        setProductInformationState("invalid");
        setProductInformationMessage(
          "Thông tin sản phẩm chỉ chứa kí tự chữ, số và khoảng trắng"
        );
        break;
      default:
        setProductInformationState("valid");
        setProductInformationMessage("");
    }
    // Kiểm tra ngày tạo đơn
    if (!checkDateTime(createOrderDate, "00:00")) {
      valid = false;
      setCreateOrderDateState("invalid");
      setCreateOrderDateMessage("Ngày tạo đơn không được ở quá khứ");
    } else {
      setCreateOrderDateState("valid");
      setCreateOrderDateMessage("");
    }

    // Kiểm tra thời gian tạo đơn
    if (!checkDateTime(createOrderDate, timeCreate)) {
      valid = false;
      setTimeCreateState("invalid");
      setTimeCreateMessage("Thời gian tạo đơn không được ở quá khứ");
    } else {
      setTimeCreateState("valid");
      setTimeCreateMessage("");
    }

    // STORE
    if (store === "") {
      valid = false;
      setStoreState("invalid");
    } else {
      setStoreState("valid");
    }

    // BUILDING
    if (building === "") {
      valid = false;
      setBuildingState("invalid");
    } else {
      setBuildingState("valid");
    }

    // NAME
    switch (true) {
      case name.trim() === "":
        valid = false;
        setNameState("invalid");
        setNameMessage("Tên khách hàng không được để trống");
        break;
      case name.length > 50:
        valid = false;
        setNameState("invalid");
        setNameMessage("Tên khách hàng không được vượt quá 50 kí tự");
        break;
      case !/^[A-Za-z\sÀ-ỹ]{1,50}$/.test(name):
        valid = false;
        setNameState("invalid");
        setNameMessage("Tên khách hàn chỉ chứa kí tự chữ và khoảng trắng");
        break;
      default:
        setNameState("valid");
        setNameMessage("");
    }

    // PHONE NUMBER
    if (phone === "") {
      setPhoneState("invalid");
      setPhoneMessage("Số điện thoại không được để trống");
    } else if (!checkPhoneValid()) {
      valid = false;
      setPhoneState("invalid");
      setPhoneMessage("Số điện thoại không hợp lệ");
    } else {
      setPhoneState("valid");
      setPhoneMessage("Số điện thoại không được để trống");
    }

    // PAYMENT

    if (paymentStatus === "") {
      valid = false;
      setPaymentStatusState("invalid");
    } else {
      setPaymentStatusState("valid");
    }

    if (paymentName === "") {
      valid = false;
      setPaymentNameState("invalid");
    } else {
      setPaymentNameState("valid");
    }

    // TOTAL
    if (total === "") {
      valid = false;
      setTotalState("invalid");
    } else if (total < 0) {
      setTotal(0);
      setTotalState("invalid");
    } else {
      setTotalState("valid");
    }

    // SHIP COST
    if (shipCost === "") {
      valid = false;
      setShipCostState("invalid");
    } else {
      setShipCostState("valid");
    }

    return valid;
  };

  const handleSubmit = () => {
    if (validateCustomStylesForm()) {
      setIsLoadingCircle(true);
      let order = {
        productInformation: productInformation,
        dateCreate: createOrderDate,
        timeCreate: timeCreate,
        // timeReceived: timeReceived,
        paymentName: paymentName.value,
        paymentStatus: paymentStatus.value,
        modeId: modeId.value,
        total: parseFloat(total),
        shipCost: shipCost,
        noteOfOrder: noteOfOrder,
        phoneNumber: phone,
        fullName: name,
        buildingId: building.value,
        noteOfCustomer: noteOfCustomer,
        deliveryTimeId: "6",
      };

      createOrder(store.value, order)
        .then((res) => {
          console.log(res);
          if (res.data) {
            setIsLoadingCircle(false);
            notify("Thêm mới thành công", "Success");
            setStore("");
            setBuilding("");
            setName("");
            setPhone("");
            setTotal("");
            setNoteOfOrder("");
            setNoteOfCustomer("");
            setPaymentName("");
            setPaymentStatus("");
            setModeId("");
            setShipCost("");
            setCreateOrderDate("");
            setTimeCreate("");
            // setTimeReceived("");
          }
        })
        .catch((error) => {
          console.log(error);
          setIsLoadingCircle(false);
          notify("Đã xảy ra lỗi gì đó!!", "Error");
        });
    }
  };

  return (
    <>
      <SimpleHeader name="Tạo vận đơn" parentName="Quản Lý" />
      <Container className="mt--6" fluid>
        <Row>
          <div className="col-lg-12">
            <Card>
              {/* TITLE dơn hàng */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "10px 0px",
                }}
                className="align-items-center"
              >
                <CardHeader className="border-0" style={{ padding: "15px" }}>
                  <h2 className="mb-0">Thông tin đơn hàng </h2>
                </CardHeader>
              </div>

              {/* FORM NEW MENU */}
              <div className="col-md-12">
                <form>
                  <div className="row">
                    {/* All Order */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Mã đơn hàng <span style={{ color: "red" }}>*</span>
                        </label>
                        <div
                          className={`${
                            allOrdersState === "invalid" && "error-select"
                          }`}
                        >
                          <Select
                            options={optionsOrder}
                            styles={customStyles}
                            value={allOrders}
                            onChange={(e) => {
                              setAllOrders(e);
                            }}
                            isClearable
                            isSearchable
                            onCreateOption={(inputValue) => {
                              setAllOrders({
                                label: inputValue,
                                value: inputValue,
                              });
                            }}
                            onBlur={() => {
                              if (customOrder && !allOrders) {
                                setAllOrders({
                                  label: customOrder,
                                  value: customOrder,
                                });
                              }
                            }}
                            inputValue={customOrder}
                            onInputChange={(inputValue) => {
                              setCustomOrder(inputValue);
                            }}
                          />
                        </div>
                        {allOrdersState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            Mã đơn hàng không được để trống
                          </div>
                        )}
                      </div>
                    </div>

                    {/* STORE */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Cửa hàng <span style={{ color: "red" }}>*</span>
                        </label>
                        <div
                          className={`${
                            storeState === "invalid" && "error-select"
                          }`}
                        >
                          <Select
                            options={optionsStore}
                            placeholder="Cửa hàng"
                            styles={customStyles}
                            value={store}
                            onChange={(e) => {
                              setStore(e);
                            }}
                          />
                        </div>
                        {storeState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            Cửa hàng không được để trống
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Create Order Date */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ngày tạo đơn <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          className="form-control"
                          type="date"
                          value={createOrderDate}
                          onChange={(e) => setCreateOrderDate(e.target.value)}
                        />
                        {createOrderDateState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {createOrderDateMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time Create */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian tạo đơn{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          className="form-control"
                          type="time"
                          value={timeCreate}
                          onChange={(e) => setTimeCreate(e.target.value)}
                        />
                        {timeCreateState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {timeCreateStateMessage}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Product Information */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thông tin sản phẩm{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={productInformationState === "valid"}
                          invalid={productInformationState === "invalid"}
                          className="form-control"
                          type="text"
                          value={productInformation}
                          onChange={(e) => {
                            setProductInformation(e.target.value);
                          }}
                        />
                        {productInformationState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {productInformationMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address Store */}
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Địa chỉ cửa hàng{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={nameState === "valid"}
                          invalid={nameState === "invalid"}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={`${name}`}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        {nameState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {nameMessage}
                          </div>
                        )}
                      </div>
                    </div> */}

                    {/* TOTAL (Giá trị đơn hàng chứa ship) */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Giá trị đơn hàng chưa tính phí dịch vụ{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          min={0}
                          valid={totalState === "valid"}
                          invalid={totalState === "invalid"}
                          className="form-control"
                          type="number"
                          id="example-search-input"
                          value={`${total}`}
                          onChange={(e) => {
                            if (parseFloat(e.target.value) < 0) {
                              setTotal("0");
                            } else {
                              setTotal(e.target.value);
                            }
                          }}
                        />
                        <div className="invalid-feedback">
                          Giá trị đơn hàng không được để trống
                        </div>
                      </div>
                    </div>

                    {/* SHIP COST */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Phí dịch vụ <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          min={0}
                          valid={shipCostState === "valid"}
                          invalid={shipCostState === "invalid"}
                          className="form-control"
                          type="number"
                          id="example-search-input"
                          value={`${shipCost}`}
                          onChange={(e) => {
                            if (parseFloat(e.target.value) < 0) {
                              setShipCost("0");
                            } else {
                              setShipCost(e.target.value);
                            }
                          }}
                        />
                        <div className="invalid-feedback">
                          Phí dịch vụ không được để trống
                        </div>
                      </div>
                    </div>

                    {/* Shipping Type */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Loại giao hàng <span style={{ color: "red" }}>*</span>
                        </label>
                        <div
                          className={`${
                            modeIdState === "invalid" && "error-select"
                          }`}
                        >
                          <Select
                            options={optionsModeId}
                            placeholder=""
                            styles={customStyles}
                            value={modeId}
                            onChange={(e) => {
                              setModeId(e);
                            }}
                          />
                        </div>
                        {modeIdState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            Trạng thái thanh toán không được để trống
                          </div>
                        )}
                      </div>
                    </div>
                    {/* PAYMENT Status */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Trạng thái thanh toán{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div
                          className={`${
                            paymentStatusState === "invalid" && "error-select"
                          }`}
                        >
                          <Select
                            options={optionsPaymentStatus}
                            placeholder="Chưa thanh toán"
                            styles={customStyles}
                            value={paymentStatus}
                            onChange={(e) => {
                              setPaymentStatus(e);
                            }}
                          />
                        </div>
                        {paymentStatusState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            Trạng thái thanh toán không được để trống
                          </div>
                        )}
                      </div>
                    </div>
                    {/* PAYMENT NAME */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Phương thức thanh toán{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div
                          className={`${
                            paymentNameState === "invalid" && "error-select"
                          }`}
                        >
                          <Select
                            options={optionsPaymentName}
                            placeholder="Thu hộ"
                            styles={customStyles}
                            value={paymentName}
                            onChange={(e) => {
                              setPaymentName(e);
                            }}
                          />
                        </div>
                        {paymentNameState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            Phương thức thanh toán không được để trống
                          </div>
                        )}
                      </div>
                    </div>

                    {/* NOTE OF ORDER */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ghi chú của đơn hàng
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <textarea
                          rows={3}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={`${noteOfOrder}`}
                          onChange={(e) => {
                            setNoteOfOrder(e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    {/* TITLE Customer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "10px 0px",
                      }}
                      className="align-items-center"
                    >
                      <CardHeader
                        className="border-0"
                        style={{ padding: "15px" }}
                      >
                        <h2 className="mb-0">Thông tin khách hàng </h2>
                      </CardHeader>
                    </div>

                    {/* FULL NAME */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Tên khách hàng <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={nameState === "valid"}
                          invalid={nameState === "invalid"}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={`${name}`}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        {nameState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {nameMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PHONE NUMBER */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Số điện thoại <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={phoneState === "valid"}
                          invalid={phoneState === "invalid"}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={`${phone}`}
                          onChange={(e) => {
                            setPhone(e.target.value);
                          }}
                        />
                        {phoneState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {phoneMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BUILDING */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Địa điểm giao <span style={{ color: "red" }}>*</span>
                        </label>
                        <div
                          className={`${
                            buildingState === "invalid" && "error-select"
                          }`}
                        >
                          <Select
                            options={optionsBuilding}
                            placeholder="Địa điểm giao"
                            styles={customStyles}
                            value={building}
                            onChange={(e) => {
                              setBuilding(e);
                            }}
                          />
                        </div>
                        {buildingState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            Địa điểm giao không được để trống
                          </div>
                        )}
                      </div>
                    </div>

                    {/* NOTE OF CUSTOMER */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ghi chú của khách hàng
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </label>
                        <textarea
                          rows={3}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={`${noteOfCustomer}`}
                          onChange={(e) => {
                            setNoteOfCustomer(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <Col className="mt-3  text-md-right mb-4" lg="12" xs="5">
                    {/* CREATE BUTTON */}
                    <Button
                      onClick={() => {
                        handleSubmit();
                      }}
                      className="btn-neutral"
                      color="default"
                      size="lg"
                      disabled={isLoadingCircle}
                      style={{
                        background: "var(--primary)",
                        color: "#000",
                        padding: "0.875rem 2rem",
                      }}
                    >
                      <div
                        className="flex"
                        style={{
                          alignItems: "center",
                          width: 99,
                          justifyContent: "center",
                        }}
                      >
                        {isLoadingCircle ? (
                          <Spinner
                            style={{
                              color: "#000",
                              height: 25,
                              width: 25,
                              margin: "auto",
                            }}
                          />
                        ) : (
                          "Tạo"
                        )}
                      </div>
                    </Button>
                  </Col>
                </form>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};
export default CreateOrder;

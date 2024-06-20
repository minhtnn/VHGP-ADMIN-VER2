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

import axios from "axios";

const CreateOrder = () => {
  const [commandBoxValue, setCommandBoxValue] = useState("");
  const [commandBoxValueState, setCommandBoxValueState] = useState("");
  const [commandBoxValueMessage, setCommandBoxValueMessage] = useState("");
  const [commandBoxStatus, setCommandBoxStatus] = useState("");

  const { buildingList, storeList } = useContext(AppContext);

  const [productInformation, setProductInformation] = useState("");
  const [productInformationState, setProductInformationState] = useState("");
  const [productInformationMessage, setProductInformationMessage] = useState("");

  const [timeReceived, setTimeReceived] = useState("");
  const [timeReceivedState, setTimeReceivedState] = useState("");
  const [timeReceivedMessage, setTimeReceivedMessage] = useState("");
  const [timeDelivery, setTimeDelivery] = useState("");
  const [timeDeliveryState, setTimeDeliveryState] = useState("");
  const [timeDeliveryMessage, setTimeDeliveryMessage] = useState("");

  const [store, setStore] = useState("");
  const [storeState, setStoreState] = useState("");
  const [storeMessage, setStoreMessage] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingState, setBuildingState] = useState("");
  const [buildingMessage, setBuildingMessage] = useState("");

  const [name, setName] = useState("");
  const [nameState, setNameState] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneState, setPhoneState] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const [total, setTotal] = useState("");
  const [totalState, setTotalState] = useState("");
  const [totalMessage, setTotalMessage] = useState("");
  const [shipCost, setShipCost] = useState("");
  const [shipCostState, setShipCostState] = useState("");
  const [shipCostMessage, setShipCostMessage] = useState("");

  const [noteOfOrder, setNoteOfOrder] = useState("");
  const [noteOfOrderState, setNoteOfOrderState] = useState("");
  const [noteOfOrderMessage, setNoteOfOrderMessage] = useState("");
  const [noteOfCustomer, setNoteOfCustomer] = useState("");
  const [noteOfCustomerState, setNoteOfCustomerState] = useState("");
  const [noteOfCustomerMessage, setNoteOfCustomerMessage] = useState("");

  const [paymentName, setPaymentName] = useState("");
  const [paymentNameState, setPaymentNameState] = useState("");
  const [isLoadingCircle, setIsLoadingCircle] = useState(false);

  const handleCommandChange = (e) => {
    const value = e.target.value;
    setCommandBoxValue(value);
    parseCommand(value);
  };

  useEffect(() => {
    if (commandBoxValue !== "") {
      validateCustomStylesForm();
    }
  }, [
    store,
    total,
    timeReceived,
    paymentName,
    shipCost,
    phone,
    name,
    building,
    commandBoxValue,
  ]);

  const checkPhoneValid = () => {
    return phone.match(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im);
  };

  const parseCommand = (command) => {
    const parts = command.split("_");
    if (parts.length === 7) {
      const [
        storeCode,
        orderNote,
        phoneNumber,
        buildingName,
        orderTotal,
        paymentName,
        customerNote,
      ] = parts;

      const storeOption = optionsStore.find((opt) => opt.value === storeCode);
      const buildingOption = optionsBuilding.find(
        (opt) => opt.label.toLowerCase() === buildingName.toLowerCase()
      );
      const paymentOption = optionsPaymentName.find(
        (opt) =>
          opt.label.toLowerCase() === paymentName.toLowerCase() ||
          opt.shorthand.toLowerCase() === paymentName.toLowerCase()
      );

      if (!storeOption) {
        setStoreState("invalid");
        setStoreMessage("Cửa hàng không tồn tại");
      } else {
        setStore(storeOption);
        setStoreState("valid");
      }

      if (!buildingOption) {
        setBuildingState("invalid");
        setBuildingMessage("Địa điểm giao không tồn tại");
      } else {
        setBuilding(buildingOption);
        setBuildingState("valid");
      }

      if (!paymentOption) {
        setPaymentNameState("invalid");
      } else {
        setPaymentName(paymentOption);
        setPaymentNameState("valid");
      }

      setPhone(phoneNumber);
      setPhoneState(checkPhoneValid() ? "valid" : "invalid");

      setTotal(orderTotal);
      setTotalState(orderTotal >= 0 ? "valid" : "invalid");

      setNoteOfOrder(orderNote);
      setNoteOfCustomer(customerNote);
      setCommandBoxValueMessage("Command hợp lệ");
      setCommandBoxValueState("valid");

      // Gọi API để kiểm tra thông tin khách hàng dựa trên số điện thoại
      fetchCustomerInfo(phoneNumber);
    } else {
      setCommandBoxValueMessage(
        "Command không đúng định dạng. Vui lòng nhập lại."
      );
      setCommandBoxValueState("invalid");
    }
  };

  const fetchCustomerInfo = async (phoneNumber) => {
    try {
      const response = await axios.get(
        `https://api-pointify.reso.vn/api/memberships?apiKey=34519997-3d4b-4b31-857f-d6612082c11b&phoneNumber=${phoneNumber}`
      );

      if (response.data.items.length > 0) {
        // Nếu tìm thấy thông tin khách hàng, tự động điền vào trường tên khách hàng
        const customerName = response.data.items[0].fullname;
        setName(customerName);
        setNameState("valid");
      } else {
        // Nếu không tìm thấy thông tin khách hàng, để trống tên khách hàng
        setName("");
        setNameState(""); // Có thể để trống state của tên khách hàng để người dùng tự nhập
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const optionsStore = storeList.map((item) => {
    return {
      label: item.name,
      value: item.storeCode,
    };
  });
  const optionsBuilding = buildingList.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const getPaymentName = (item) => {
    switch (item) {
      case 0:
        return ["Thu hộ tiền mặt", "TM"];
      case 1:
        return ["Thu hộ chuyển khoản", "CK"];
      case 2:
        return ["Đã thanh toán", "DTT"];
      default:
        return ["", ""];
    }
  };

  const optionsPaymentName = [0, 1, 2].map((item) => {
    const [label, shorthand] = getPaymentName(item);
    return {
      label: label,
      value: item,
      shorthand: shorthand,
    };
  });

  // Get Time and Date current
  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setTimeReceived(formattedTime);
    setTimeDelivery(formattedTime);
  }, []);

  // VALIDATION FORM
  const validateCustomStylesForm = () => {
    let valid = true;

    if (noteOfOrder === "") {
      valid = false;
      setNoteOfOrderState("invalid");
      setNoteOfOrderMessage("Ghi chú đơn hàng không được để trống");
    } else {
      setNoteOfOrderState("valid");
      setNoteOfOrderMessage("");
    }

    if (timeReceived === "") {
      valid = false;
      setTimeReceivedState("invalid");
      setTimeReceivedMessage("Thời gian nhận đơn không được để trống");
    } else {
      setTimeReceivedState("valid");
      setTimeReceivedMessage("");
    }

    if (timeDelivery === "") {
      valid = false;
      setTimeDeliveryState("invalid");
      setTimeDeliveryMessage("Thời gian giao hàng không được để trống");
    } else {
      setTimeDeliveryState("valid");
      setTimeDeliveryMessage("");
    }

    if (store === "") {
      valid = false;
      setStoreState("invalid");
    } else {
      setStoreState("valid");
    }

    if (building === "") {
      valid = false;
      setBuildingState("invalid");
    } else {
      setBuildingState("valid");
    }

    // switch (true) {
    //   case name.trim() === "":
    //     valid = false;
    //     setNameState("invalid");
    //     setNameMessage("Tên khách hàng không được để trống");
    //     break;
    //   case name.length > 50:
    //     valid = false;
    //     setNameState("invalid");
    //     setNameMessage("Tên khách hàng không được vượt quá 50 kí tự");
    //     break;
    //   case !/^[A-Za-z\sÀ-ỹ]{1,50}$/.test(name):
    //     valid = false;
    //     setNameState("invalid");
    //     setNameMessage("Tên khách hàng chỉ chứa kí tự chữ và khoảng trắng");
    //     break;
    //   default:
    //     setNameState("valid");
    //     setNameMessage("");
    // }
    if (name.trim() === "") {
      setNameMessage("Tên khách hàng không được để trống");
      setNameState("invalid");
      valid = false;
    }

    if (paymentName === "") {
      valid = false;
      setPaymentNameState("invalid");
    } else {
      setPaymentNameState("valid");
    }

    if (total === "") {
      valid = false;
      setTotalState("invalid");
      setTotalMessage("Giá trị đơn hàng không được để trống");
    } else if (!/^\d+(\.\d+)?$/.test(total)) {
      valid = false;
      setTotalState("invalid");
      setTotalMessage("Giá trị đơn hàng không hợp lệ");
    } else if (total < 0) {
      setTotal(0);
      valid = false;
      setTotalState("invalid");
      setTotalMessage("Giá trị đơn hàng không thể là một giá trị âm");
    } else {
      setTotalState("valid");
    }

    if (shipCost === "") {
      valid = false;
      setShipCostState("invalid");
      setShipCostMessage("Phí dịch vụ không được để trống");
    } else if (!/^\d+(\.\d+)?$/.test(shipCost)) {
      valid = false;
      setShipCostState("invalid");
      setShipCostMessage("Phí dịch vụ không hợp lệ");
    } else {
      setShipCostState("valid");
    }

    if (phone === "") {
      valid = false;
      setPhoneState("invalid");
      setPhoneMessage("Số điện thoại không được để trống");
    } else if (!checkPhoneValid()) {
      valid = false;
      setPhoneState("invalid");
      setPhoneMessage("Số điện thoại không hợp lệ");
    } else {
      setPhoneState("valid");
    }
    return valid;
  };


  // Hàm kiểm tra user tồn tại
  const checkUserExists = async (phoneNumber) => {
    try {
      const response = await axios.get(
        `https://api-pointify.reso.vn/api/memberships?apiKey=34519997-3d4b-4b31-857f-d6612082c11b&phoneNumber=${phoneNumber}`
      );
      // Kiểm tra xem có bất kỳ mục nào trong mảng items có phoneNumber khớp không
      return response.data.items.some(item => item.phoneNumber === phoneNumber);
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };
  
  const handleSubmit = async () => {
    if (validateCustomStylesForm()) {
      setIsLoadingCircle(true);
  
      // Lấy thông tin khách hàng từ các trường nhập
      const customerInfo = {
        fullName: name,
        phoneNumber: phone,
        buildingId: building.value,
        isEnroll:false,
      };
  
      try {
     
        const userExists = await checkUserExists(customerInfo.phoneNumber);
  
        if (!userExists) {
         
          console.log("User does not exist, creating user.");
  
          await axios.post(
            "https://api.vhgp.net/api/v1/customer-management",
            customerInfo
          );
          console.log("User created:", customerInfo);
        } else {
          console.log("User exists:", customerInfo);
        }
  
       
        let order = {
          timeReceived: timeReceived,
          timeDelivery: timeDelivery,
          paymentType: paymentName.value,
          total: parseFloat(total),
          shipCost: shipCost,
          orderNote: noteOfOrder,
          customerNote: noteOfCustomer,
          phoneNumber: phone,
          fullName: name,
          buildingId: building.value,
          deliveryTimeId: "6",
        };
  
        const res = await createOrder(store.value, order);
        console.log("Create order (res):", res);
  
        if (res.data) {
          // Đặt lại trạng thái của các trường nhập
          setIsLoadingCircle(false);
          notify("Thêm mới thành công", "Success");
          resetFields();
        }
      } catch (error) {
        console.error("Error creating order or customer:", error);
        setIsLoadingCircle(false);
        notify("Đã xảy ra lỗi khi tạo đơn hàng hoặc khách hàng", "Error");
      }
    }
  };
  
  // Hàm đặt lại giá trị của các trường nhập
  const resetFields = () => {
    setStore("");
    setBuilding("");
    setName("");
    setPhone("");
    setTotal("");
    setNoteOfOrder("");
    setNoteOfCustomer("");
    setPaymentName("");
    setShipCost("");
    setTimeReceived("");
    setTimeDelivery("");
  };
  
  
  

  const getSelectStyles = (isValid, isInvalid) => ({
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: isInvalid ? "#fb6340" : isValid ? "#2dce89" : "#dee2e6",
      minHeight: "30px",
      height: "46px",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(50, 151, 211, 0.25)"
        : null,
      "&:hover": {
        borderColor: isInvalid ? "#fb6340" : isValid ? "#2dce89" : "#dee2e6",
      },
      borderRadius: "0.5rem",
    }),
    input: (provided) => ({
      ...provided,
      margin: "5px",
    }),
  });


  return (
    <>
      <SimpleHeader name="Tạo vận đơn" parentName="Quản Lý" />
      <Container className="mt--6" fluid>
        <Row>
          {/* Command Box */}
          <div className="col-md-12" style={{ marginBottom: "-10px" }}>
            <div className="form-group">
              <label className="form-control-label">
                Hộp lệnh
                <span style={{ color: "red" }}> * </span>
              </label>
              <span style={{ color: "grey", fontSize: "13px" }}>
                Mã cửa hàng_Thông tin sản phẩm_Số điện thoại_Mã toà nhà_Tổng tiền_Loại thanh toán_Ghi chú
              </span>
              <Input
                type="text"
                id="input-command-box"
                placeholder="Nhập command"
                value={commandBoxValue}
                onChange={handleCommandChange}
                className={
                  commandBoxValueState === "invalid" ? "is-invalid" : ""
                }
              />
              {commandBoxValueState && (
                <div
                  className={
                    commandBoxValueState === "valid" ? "valid" : "invalid"
                  }
                  style={{
                    fontSize: "80%",
                    color:
                      commandBoxValueState === "valid" ? "#2dce89" : "#fb6340",
                    marginTop: "0.25rem",
                  }}
                >
                  {commandBoxValueMessage}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-12">
            <Card>
              {/* TITLE ĐƠN HÀNG */}
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
                  <h2 className="mb-0">Thông tin đơn hàng</h2>
                </CardHeader>
              </div>

              {/* FORM NEW MENU */}
              <div className="col-md-12">
                <form>
                  <div className="row">
                    {/* Ghi chú của đơn hàng - thông tin sản phẩm*/}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ghi chú đơn hàng{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={noteOfOrderState === "valid"}
                          invalid={noteOfOrderState === "invalid"}
                          className="form-control"
                          type="text"
                          value={`${noteOfOrder}`}
                          
                          onChange={(e) => {
                            setNoteOfOrder(e.target.value);
                          }}
                        />
                        {noteOfOrderState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {noteOfOrderMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Information */}
                    {/* <div className="col-md-6">
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
                          onPaste={handlePaste}
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
                    </div> */}

                    {/* Time Received */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian nhận hàng dự kiến{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={timeReceivedState === "valid"}
                          invalid={timeReceivedState === "invalid"}
                          className="form-control"
                          type="time"
                          value={timeReceived}
                          onChange={(e) => setTimeReceived(e.target.value)}
                        />
                        {timeDeliveryState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {timeDeliveryMessage}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ESTIMATED DELIVERY TIME */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian giao hàng dự kiến{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={timeDeliveryState === "valid"}
                          invalid={timeDeliveryState === "invalid"}
                          className="form-control"
                          type="time"
                          value={timeDelivery}
                          onChange={(e) => setTimeDelivery(e.target.value)}
                        />
                        {timeDeliveryState === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {timeDeliveryMessage}
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
                            styles={getSelectStyles(
                              storeState === "valid",
                              storeState === "invalid"
                            )}
                            value={store}
                            onChange={(e) => {
                              setStore(e);
                            }}
                          ></Select>
                        </div>
                      </div>
                    </div>

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
                          type="text"
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
                        <div className="invalid-feedback">{totalMessage}</div>
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
                          type="text"
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
                          {shipCostMessage}
                        </div>
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
                            styles={getSelectStyles(
                              paymentNameState === "valid",
                              paymentNameState === "invalid"
                            )}
                            value={paymentName}
                            // onPaste={handlePaste}
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
                    {/* <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ghi chú của đơn hàng
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
                    </div> */}

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
                          value={phone}
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
                            styles={getSelectStyles(
                              buildingState === "valid",
                              buildingState === "invalid"
                            )}
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

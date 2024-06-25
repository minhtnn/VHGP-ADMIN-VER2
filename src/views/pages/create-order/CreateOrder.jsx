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


  const { buildingList, storeList } = useContext(AppContext);

  const [formData, setFormData] = useState({ 
    productInformation: "",
    timeReceived: "",
    timeDelivery: "",
    store: "",
    building: "",
    name: "",
    phone: "",
    total: "",
    shipCost: "",
    noteOfOrder: "",
    noteOfCustomer: "",
    paymentName: "",
  });

  const [formState, setFormState] = useState({
    productInformation: "",
    timeReceived: "",
    timeDelivery: "",
    store: "",
    building: "",
    name: "",
    phone: "",
    total: "",
    shipCost: "",
    noteOfOrder: "",
    noteOfCustomer: "",
    paymentName: "",
  });

  const [formMessages, setFormMessages] = useState({
    productInformation: "",
    timeReceived: "",
    timeDelivery: "",
    store: "",
    building: "",
    name: "",
    phone: "",
    total: "",
    shipCost: "",
    noteOfOrder: "",
    noteOfCustomer: "",
    paymentName: "",
  });

  const [isLoadingCircle, setIsLoadingCircle] = useState(false);

  const handleCommandChange = (e) => {
    const value = e.target.value;
    console.log("Command value changed:", value);
    setCommandBoxValue(value);
    parseCommand(value);
  };

  useEffect(() => {
    if (commandBoxValue !== "") {
      console.log("Validating form after command box value change.");
      validateForm();
    }
  }, [formData, commandBoxValue]);

  const checkPhoneValid = (phone) => {
    return phone.match(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im);
  };

  const parseCommand = (command) => {
     console.log("Parsing command:", command);
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
      console.log("Parsed command data:", {
        storeOption,
        orderNote,
        phoneNumber,
        buildingOption,
        orderTotal,
        paymentOption,
        customerNote,
      });

      setFormData((prev) => ({
        ...prev,
        store: storeOption || "",
        noteOfOrder: orderNote,
        phone: phoneNumber,
        building: buildingOption || "",
        total: orderTotal,
        paymentName: paymentOption || "",
        noteOfCustomer: customerNote,
      }));

      setFormState((prev) => ({
        ...prev,
        store: storeOption ? "valid" : "invalid",
        building: buildingOption ? "valid" : "invalid",
        paymentName: paymentOption ? "valid" : "invalid",
        phone: checkPhoneValid(phoneNumber) ? "valid" : "invalid",
        total: orderTotal >= 0 ? "valid" : "invalid",
      }));

      setFormMessages((prev) => ({
        ...prev,
        store: storeOption ? "" : "Cửa hàng không tồn tại",
        building: buildingOption ? "" : "Địa điểm giao không tồn tại",
      }));

      setCommandBoxValueState("valid");
      setCommandBoxValueMessage("Command hợp lệ");

      fetchCustomerInfo(phoneNumber);
    } else {
      setCommandBoxValueState("invalid");
      setCommandBoxValueMessage("Command không đúng định dạng. Vui lòng nhập lại.");
    }
  };

  const optionsStore = storeList.map((item) => ({
    label: item.name,
    value: item.storeCode,
  }));

  const optionsBuilding = buildingList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

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

  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5);

    setFormData((prev) => ({
      ...prev,
      timeReceived: formattedTime,
      timeDelivery: formattedTime,
    }));
  }, []);

  const validateForm = () => {
    let valid = true;
    const newState = {};
    const newMessages = {};

    if (formData.noteOfOrder === "") {
      valid = false;
      newState.noteOfOrder = "invalid";
      newMessages.noteOfOrder = "Ghi chú đơn hàng không được để trống";
    } else {
      newState.noteOfOrder = "valid";
      newMessages.noteOfOrder = "";
    }

    if (formData.timeReceived === "") {
      valid = false;
      newState.timeReceived = "invalid";
      newMessages.timeReceived = "Thời gian nhận đơn không được để trống";
    } else {
      newState.timeReceived = "valid";
      newMessages.timeReceived = "";
    }

    if (formData.timeDelivery === "") {
      valid = false;
      newState.timeDelivery = "invalid";
      newMessages.timeDelivery = "Thời gian giao hàng không được để trống";
    } else {
      newState.timeDelivery = "valid";
      newMessages.timeDelivery = "";
    }

    if (formData.store === "") {
      valid = false;
      newState.store = "invalid";
    } else {
      newState.store = "valid";
    }

    if (formData.building === "") {
      valid = false;
      newState.building = "invalid";
    } else {
      newState.building = "valid";
    }

    if (formData.name.trim() === "") {
      valid = false;
      newState.name = "invalid";
      newMessages.name = "Tên khách hàng không được để trống";
    } else {
      newState.name = "valid";
      newMessages.name = "";
    }

    if (formData.paymentName === "") {
      valid = false;
      newState.paymentName = "invalid";
    } else {
      newState.paymentName = "valid";
    }

    if (formData.total === "") {
      valid = false;
      newState.total = "invalid";
      newMessages.total = "Giá trị đơn hàng không được để trống";
    } else if (!/^\d+(\.\d+)?$/.test(formData.total)) {
      valid = false;
      newState.total = "invalid";
      newMessages.total = "Giá trị đơn hàng không hợp lệ";
    } else if (formData.total < 0) {
      setFormData((prev) => ({ ...prev, total: 0 }));
      valid = false;
      newState.total = "invalid";
      newMessages.total = "Giá trị đơn hàng không thể là một giá trị âm";
    } else {
      newState.total = "valid";
      newMessages.total = "";
    }

    if (formData.shipCost === "") {
      valid = false;
      newState.shipCost = "invalid";
      newMessages.shipCost = "Phí dịch vụ không được để trống";
    } else if (!/^\d+(\.\d+)?$/.test(formData.shipCost)) {
      valid = false;
      newState.shipCost = "invalid";
      newMessages.shipCost = "Phí dịch vụ không hợp lệ";
    } else {
      newState.shipCost = "valid";
      newMessages.shipCost = "";
    }

    if (formData.phone === "") {
      valid = false;
      newState.phone = "invalid";
      newMessages.phone = "Số điện thoại không được để trống";
    } else if (!checkPhoneValid(formData.phone)) {
      valid = false;
      newState.phone = "invalid";
      newMessages.phone = "Số điện thoại không hợp lệ";
    } else {
      newState.phone = "valid";
      newMessages.phone = "";
    }

    setFormState(newState);
    setFormMessages(newMessages);

    return valid;
  };

  const fetchCustomerInfo = async (phoneNumber) => {
    try {
      console.log("Fetching customer info for phone number:...", phoneNumber);
      const response = await axios.get(
        `https://api-pointify.reso.vn/api/memberships?apiKey=34519997-3d4b-4b31-857f-d6612082c11b&phoneNumber=${phoneNumber}`
      );

      if (response.data.items.length > 0) {
        const customerName = response.data.items[0].fullname;
        console.log("Customer found:", customerName);
        setFormData((prev) => ({ ...prev, name: customerName }));
        setFormState((prev) => ({ ...prev, name: "valid" }));
      } else {
        console.log("Customer not found.");
        setFormData((prev) => ({ ...prev, name: "" }));
        setFormState((prev) => ({ ...prev, name: "" }));
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };

  const checkUserExists = async (phoneNumber) => {
    console.log("Checking if user exists for phone number:", phoneNumber);
    try {
      const response = await axios.get(
        `https://api-pointify.reso.vn/api/memberships?apiKey=34519997-3d4b-4b31-857f-d6612082c11b&phoneNumber=${phoneNumber}`
      );
      const exists = response.data.items.some(item => item.phoneNumber === phoneNumber);
      console.log("User exists:", exists);
      return exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoadingCircle(true);
      console.log("Form is valid, proceeding to submit...");

      const customerInfo = {
        fullName: formData.name,
        phoneNumber: formData.phone,
        buildingId: formData.building.value,
        isEnroll: false,
      };

      try {
        const userExists = await checkUserExists(customerInfo.phoneNumber);
        console.log("User does not exist, creating new user...");
        if (!userExists) {
          await axios.post(
            "https://api.vhgp.net/api/v1/customer-management",
            customerInfo
          );
        }

        let order = {
          timeReceived: formData.timeReceived,
          timeDelivery: formData.timeDelivery,
          paymentType: formData.paymentName.value,
          total: parseFloat(formData.total),
          shipCost: formData.shipCost,
          orderNote: formData.noteOfOrder,
          customerNote: formData.noteOfCustomer,
          phoneNumber: formData.phone,
          fullName: formData.name,
          buildingId: formData.building.value,
          deliveryTimeId: "6",
        };
        console.log("Order data:", order);

        const res = await createOrder(formData.store.value, order);

        if (res.data) {
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

  const resetFields = () => {
    console.log("Resetting form fields...");
    setFormData({
      productInformation: "",
      timeReceived: "",
      timeDelivery: "",
      store: "",
      building: "",
      name: "",
      phone: "",
      total: "",
      shipCost: "",
      noteOfOrder: "",
      noteOfCustomer: "",
      paymentName: "",
    });
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
                className={commandBoxValueState === "invalid" ? "is-invalid" : ""}
              />
              {commandBoxValueState && (
                <div
                  className={commandBoxValueState === "valid" ? "valid" : "invalid"}
                  style={{
                    fontSize: "80%",
                    color: commandBoxValueState === "valid" ? "#2dce89" : "#fb6340",
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
                          valid={formState.noteOfOrder === "valid"}
                          invalid={formState.noteOfOrder === "invalid"}
                          className="form-control"
                          type="text"
                          value={formData.noteOfOrder}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, noteOfOrder: e.target.value }));
                            setFormState((prev) => ({ ...prev, noteOfOrder: "" }));
                          }}
                        />
                        {formState.noteOfOrder === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.noteOfOrder}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* Time Received */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian nhận hàng dự kiến{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          valid={formState.timeReceived === "valid"}
                          invalid={formState.timeReceived === "invalid"}
                          className="form-control"
                          type="time"
                          value={formData.timeReceived}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, timeReceived: e.target.value }));
                            setFormState((prev) => ({ ...prev, timeReceived: "" }));
                          }}
                        />
                        {formState.timeReceived === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.timeReceived}
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
                          valid={formState.timeDelivery === "valid"}
                          invalid={formState.timeDelivery === "invalid"}
                          className="form-control"
                          type="time"
                          value={formData.timeDelivery}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, timeDelivery: e.target.value }));
                            setFormState((prev) => ({ ...prev, timeDelivery: "" }));
                          }}
                        />
                        {formState.timeDelivery === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.timeDelivery}
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
                        <div className={`${formState.store === "invalid" && "error-select"}`}>
                          <Select
                            options={optionsStore}
                            placeholder="Cửa hàng"
                            styles={getSelectStyles(
                              formState.store === "valid",
                              formState.store === "invalid"
                            )}
                            value={formData.store}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, store: e }));
                              setFormState((prev) => ({ ...prev, store: "" }));
                            }}
                          />
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
                          valid={formState.total === "valid"}
                          invalid={formState.total === "invalid"}
                          className="form-control"
                          type="text"
                          id="example-search-input"
                          value={formData.total}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setFormData((prev) => ({ ...prev, total: isNaN(value) ? "" : value.toString() }));
                            setFormState((prev) => ({ ...prev, total: "" }));
                          }}
                        />
                        <div className="invalid-feedback">{formMessages.total}</div>
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
                          valid={formState.shipCost === "valid"}
                          invalid={formState.shipCost === "invalid"}
                          className="form-control"
                          type="text"
                          id="example-search-input"
                          value={formData.shipCost}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setFormData((prev) => ({ ...prev, shipCost: isNaN(value) ? "" : value.toString() }));
                            setFormState((prev) => ({ ...prev, shipCost: "" }));
                          }}
                        />
                        <div className="invalid-feedback">{formMessages.shipCost}</div>
                      </div>
                    </div>
  
                    {/* PAYMENT NAME */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Phương thức thanh toán{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className={`${formState.paymentName === "invalid" && "error-select"}`}>
                          <Select
                            options={optionsPaymentName}
                            placeholder="Thu hộ"
                            styles={getSelectStyles(
                              formState.paymentName === "valid",
                              formState.paymentName === "invalid"
                            )}
                            value={formData.paymentName}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, paymentName: e }));
                              setFormState((prev) => ({ ...prev, paymentName: "" }));
                            }}
                          />
                        </div>
                        {formState.paymentName === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.paymentName}
                          </div>
                        )}
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
                      <CardHeader className="border-0" style={{ padding: "15px" }}>
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
                          valid={formState.name === "valid"}
                          invalid={formState.name === "invalid"}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                            setFormState((prev) => ({ ...prev, name: "" }));
                          }}
                        />
                        {formState.name === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.name}
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
                          valid={formState.phone === "valid"}
                          invalid={formState.phone === "invalid"}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, phone: e.target.value }));
                            setFormState((prev) => ({ ...prev, phone: "" }));
                          }}
                        />
                        {formState.phone === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.phone}
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
                        <div className={`${formState.building === "invalid" && "error-select"}`}>
                          <Select
                            options={optionsBuilding}
                            placeholder="Địa điểm giao"
                            styles={getSelectStyles(
                              formState.building === "valid",
                              formState.building === "invalid"
                            )}
                            value={formData.building}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, building: e }));
                              setFormState((prev) => ({ ...prev, building: "" }));
                            }}
                          />
                        </div>
                        {formState.building === "invalid" && (
                          <div
                            className="invalid"
                            style={{
                              fontSize: "80%",
                              color: "#fb6340",
                              marginTop: "0.25rem",
                            }}
                          >
                            {formMessages.building}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* NOTE OF CUSTOMER */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-control-label">
                          Ghi chú của khách hàng
                        </label>
                        <textarea
                          rows={3}
                          className="form-control"
                          type="search"
                          id="example-search-input"
                          value={formData.noteOfCustomer}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, noteOfCustomer: e.target.value }));
                            setFormState((prev) => ({ ...prev, noteOfCustomer: "" }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* ACTION BUTTONS */}
                  <Col className="mt-3  text-md-right mb-4" lg="12" xs="5">
                    {/* CREATE BUTTON */}
                    <Button
                      onClick={handleSubmit}
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

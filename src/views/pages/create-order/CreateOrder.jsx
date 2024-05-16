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

const CreateOrder = ({ navigateToPage }) => {
  const { buildingList, storeList } = useContext(AppContext);

  const [productInformation, setProductInformation] = useState("");

  const [createOrderDate, setCreateOrderDate] = useState("");
  const [area, setArea] = useState("");
  const [orderType, setOrderType] = useState("");
  const [timeReceived, setTimeReceived] = useState("");
  const [shipper, setShipper] = useState("");

  const [store, setStore] = useState("");
  const [storeState, setStoreState] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingState, setBuildingState] = useState("");
  const [name, setName] = useState("");
  const [nameState, setNameState] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneState, setPhoneState] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [total, setTotal] = useState("");
  const [totalState, setTotalState] = useState("");
  const [note, setNote] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentStatusState, setPaymentStatusState] = useState("");

  const [paymentType, setPaymentType] = useState("");
  const [paymentTypeState, setPaymentTypeState] = useState("");
  const [shipCost, setShipCost] = useState("");
  const [shipCostState, setShipCostState] = useState("");
  const [isLoadingCircle, setIsLoadingCircle] = useState(false);
  const [areaList, setAreaList] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [orderTypeList, setOrderTypeList] = useState([]);
  const [filteredShopList, setFilteredShopList] = useState([]);
  const [filteredOrderTypeList, setFilteredOrderTypeList] = useState([]);

  useEffect(() => {
    // Fetch Area data
    fetch("https://65e177e7a8583365b3166e9d.mockapi.io/Area")
      .then((response) => response.json())
      .then((data) => {
        setAreaList(data);
      });

    // Fetch Shop data
    fetch("https://65e177e7a8583365b3166e9d.mockapi.io/Shop")
      .then((response) => response.json())
      .then((data) => {
        setShopList(data);
      });

    // Fetch Order Type data
    fetch("https://66430f913c01a059ea2153cd.mockapi.io/orderType")
      .then((response) => response.json())
      .then((data) => {
        setOrderTypeList(data);
      });
  }, []);
  // Filter shop list when area changes
  useEffect(() => {
    if (area) {
      const filteredShops = shopList.filter(
        (shop) => shop.idArea === area.value
      );
      setFilteredShopList(filteredShops);
    }
  }, [area, shopList]);

  // Filter order type list when store changes
  useEffect(() => {
    if (store) {
      const selectedShop = shopList.find((shop) => shop.idShop === store.value);
      if (selectedShop) {
        const filteredOrderTypes = orderTypeList.filter((orderType) =>
          selectedShop.idType.includes(orderType.idType)
        );
        setFilteredOrderTypeList(filteredOrderTypes);
      }
    }
  }, [store, shopList, orderTypeList]);

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

  const optionsStore = storeList.map((item) => {
    return {
      label: item.nameShop,
      value: item.idShop,
    };
  });

  const optionsBuilding = buildingList.map((item) => {
    return {
      label: item.nameArea,
      value: item.idArea,
    };
  });

  const getPaymentStatus = (item) => {
    switch (item) {
      case 0:
        return "Chưa thanh toán";
      case 1:
        return "Đã thanh toán";
      default:
        return "";
    }
  };

  const optionsPaymentStatus = [0, 1].map((item) => {
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
      default:
        return "";
    }
  };

  const optionsPayment = [0, 1].map((item) => {
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

  const validateCustomStylesForm = () => {
    let valid = true;

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
    if (name === "") {
      valid = false;
      setNameState("invalid");
    } else {
      setNameState("valid");
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
      setPaymentTypeState("invalid");
    } else {
      setPaymentTypeState("valid");
    }

    if (paymentType === "") {
      valid = false;
      setPaymentTypeState("invalid");
    } else {
      setPaymentTypeState("valid");
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
        phoneNumber: phone,
        total: parseFloat(total),
        buildingId: building.value,
        note: note,
        fullName: name,
        deliveryTimeId: "1",
        paymentType: paymentType.value,
        paymentStatus: paymentStatus.value,

        shipCost: shipCost,
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
            setNote("");
            setPaymentType("");
            setShipCost("");
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
                    {/* Product Information */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thông tin sản phẩm
                        </label>
                        <Input
                          className="form-control"
                          type="text"
                          value={productInformation}
                          onChange={(e) =>
                            setProductInformation(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Create Order Date */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">Ngày tạo</label>
                        <Input
                          className="form-control"
                          type="date"
                          value={createOrderDate}
                          onChange={(e) => setCreateOrderDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Time Create */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian tạo đơn
                        </label>
                        <Input
                          className="form-control"
                          type="time"
                          value={timeReceived}
                          onChange={(e) => setTimeReceived(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Time Received */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="form-control-label">
                          Thời gian nhận hàng từ Shop
                        </label>
                        <Input
                          className="form-control"
                          type="time"
                          value={timeReceived}
                          onChange={(e) => setTimeReceived(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* PAYMENT Status */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Trạng thái thanh toán
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

                    {/* TOTAL */}
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

                    {/* PAYMENT TYPE */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">
                          Phương Thức thanh toán
                        </label>
                        <div
                          className={`${
                            paymentTypeState === "invalid" && "error-select"
                          }`}
                        >
                          <Select
                            options={optionsPayment}
                            placeholder="Thu hộ"
                            styles={customStyles}
                            value={paymentType}
                            onChange={(e) => {
                              setPaymentType(e);
                            }}
                          />
                        </div>
                        {paymentTypeState === "invalid" && (
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
                          value={`${note}`}
                          onChange={(e) => {
                            setNote(e.target.value);
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
                        <div className="invalid-feedback">
                          Tên không được để trống
                        </div>
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

                    {/* Area */}
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">Khu vực</label> */}
                        {/* Assume areaList is an array of area options */}
                        {/* <Select
                          options={areaList.map((area) => ({
                            label: area.nameArea,
                            value: area.idArea,
                          }))}
                          placeholder="Chọn khu vực"
                          value={area}
                          onChange={(selectedOption) => setArea(selectedOption)}
                        />
                      </div>
                    </div> */}

                    {/* STORE */}
                    {/* <div className="col-md-6">
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
                            options={filteredShopList.map((shop) => ({
                              label: shop.nameShop,
                              value: shop.idShop,
                            }))}
                            placeholder="Cửa hàng"
                            value={store}
                            onChange={(selectedOption) =>
                              setStore(selectedOption)
                            }
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
                    </div> */}

                    {/* Order Type */}
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">Loại Đơn</label> */}
                        {/* Assume orderTypeList is an array of order type options */}
                        {/* <Select
                          options={filteredOrderTypeList.map((orderType) => ({
                            label: orderType.nameType,
                            value: orderType.idType,
                          }))}
                          placeholder="Chọn loại đơn"
                          value={orderType}
                          onChange={(selectedOption) =>
                            setOrderType(selectedOption)
                          }
                        />
                      </div>
                    </div> */}


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
                          value={`${note}`}
                          onChange={(e) => {
                            setNote(e.target.value);
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

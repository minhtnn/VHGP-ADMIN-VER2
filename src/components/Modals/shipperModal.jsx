import React, { useContext, useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import { putShipper } from "../../apis/shiperApiService";
import { getStoreDetail, putStore } from "../../apis/storeApiService";
import { getBase64Image } from "../../constants";
import { AppContext } from "../../context/AppProvider";
import { notify } from "../Toast/ToastCustom";
import WithdrawModal from "./WithdrawModal";
import RechargeModal from "./RechargeModal";
import TransactionHistoryModal from './TransactionHistoryModal';
export const ShipperModal = ({ handleReload }) => {
  const { openModal, setOpenModal, shipperModal, setShipperModal } =
    useContext(AppContext);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [transactionHistoryModalOpen, setTransactionHistoryModalOpen] = useState(false);

  // Function to open WithdrawModal
  const openWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };
  // Function to close WithdrawModal
  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };
  const toggleRechargeModal = () => {
    setRechargeModalOpen(!isRechargeModalOpen);
  };

  const toggleTransactionHistoryModal = () => {
    setTransactionHistoryModalOpen(!transactionHistoryModalOpen);
  };
  const [driverName, setDriverName] = useState("");
  const [driverNameState, setDriverNameState] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [phoneState, setPhoneState] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [recharge, setRecharge] = useState(""); //
  const [vehicleTypeState, setVehicleTypeState] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleColorState, setVehicleColorState] = useState("");
  const [deliveryTeam, setdeliveryTeam] = useState("");
  const [deliveryTeamState, setDeliveryTeamState] = useState("");
  const [status, setStatus] = useState(0);
  const [userName, setUserName] = useState("");
  const [userNameState, setUserNameState] = useState("");
  const [password, setPassword] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [numberVehicle, setNumberVehicle] = useState("");
  const [numberVehicleState, setNumberVehicleState] = useState("");
  const [isLoadingCircle, setIsLoadingCircle] = useState(false);
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };
  const customStylesPayment = {
    control: (provided, state) => ({
      ...provided,
      background: "#fff",
      borderColor: "#dee2e6",
      minHeight: "30px",
      height: "46px",
      boxShadow: state.isFocused ? null : null,
      borderRadius: "0.5rem",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "5px",
    }),
  };
  const optionsDeliveryTeam = [
    {
      label: "Unico",
      value: 1,
    },
  ];
  const optionsVehicleType = [
    {
      label: "Xe máy",
      value: 1,
    },
    {
      label: "Ô tô",
      value: 2,
    },
    {
      label: "Xe tải",
      value: 3,
    },
  ];

  const checkPhoneValid = () => {
    if (phone.match(/^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/im)) {
      return true;
    }
    return false;
  };

  const validateCustomStylesForm = () => {
    let valid = true;
    if (driverName === "") {
      valid = false;
      setDriverNameState("invalid");
    } else {
      setDriverNameState("valid");
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

    if (vehicleType === "") {
      valid = false;
      setVehicleTypeState("invalid");
    } else {
      setVehicleTypeState("valid");
    }
    if (numberVehicle === "") {
      valid = false;
      setNumberVehicleState("invalid");
    } else {
      setNumberVehicleState("valid");
    }
    if (vehicleColor === "") {
      valid = false;
      setVehicleColorState("invalid");
    } else {
      setVehicleColorState("valid");
    }
    if (deliveryTeam === "") {
      valid = false;
      setDeliveryTeamState("invalid");
    } else {
      setDeliveryTeamState("valid");
    }

    return valid;
  };
  useEffect(() => {
    setDriverName(shipperModal.fullName);
    setPhone(shipperModal.phone);
    setdeliveryTeam({
      label: shipperModal.deliveryTeam,
      value: shipperModal.deliveryTeam,
    });
    setNumberVehicle(shipperModal.licensePlates);
    setVehicleType({
      label: shipperModal.vehicleType,
      value: shipperModal.vehicleType,
    });
    setVehicleColor(shipperModal.colour);
    setStatus(
      shipperModal.status === "Active" ? optionsStatus[0] : optionsStatus[1]
    );
    if (shipperModal.image !== null && shipperModal.image !== "") {
      setImages([{ data_url: shipperModal.image }]);
    } else {
      setImages([]);
    }

    return () => {};
  }, [shipperModal]);

  const handleSubmit = () => {
    if (validateCustomStylesForm()) {
      setIsLoadingCircle(true);
      let shipper = {
        id: shipperModal.id,
        fullName: driverName,
        phone: phone,
        email: shipperModal.id,
        vehicleType: vehicleType.label,
        image: images[0]
          ? getBase64Image(images[0].data_url || "", images[0]?.file?.type) ||
            ""
          : "",
        deliveryTeam: deliveryTeam.label,
        password: shipperModal.password,
        licensePlates: numberVehicle,
        colour: vehicleColor,
        status: status.value,
      };
      console.log({ shipper });
      putShipper(shipper)
        .then((res) => {
          if (res.data) {
            setIsLoadingCircle(false);
            handleReload();
            notify("Cập nhật thành công", "Success");
            setOpenModal(false);
            setShipperModal({});
            setImages([]);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsLoadingCircle(false);
          notify("Đã xảy ra lỗi gì đó!!", "Error");
        });
    }
  };
  const optionsStatus = [
    { label: "Hoạt động", value: "Active" },
    { label: "Ngưng hoạt động", value: "Deactive" },
  ];
  return (
    <>
      <Row>
        <Col md="4">
          <Modal
            className="modal-dialog-centered"
            size="xl"
            isOpen={openModal}
            toggle={() => {
              setShipperModal({});
              setImages([]);
              setOpenModal(false);
            }}
          >
            <div className="modal-body p-0">
              <Card className="bg-secondary border-0 mb-0">
                <CardHeader
                  className="bg-transparent "
                  style={{ border: "none" }}
                >
                  <h3>Chi tiết</h3>
                </CardHeader>
                <CardBody className="" style={{ paddingTop: 0 }}>
                  <Container className="" fluid style={{ padding: "0 0px" }}>
                    <Row>
                      <div className="col-lg-4 modal-product">
                        <Card>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              padding: "10px 0px",
                            }}
                            className="align-items-center"
                          >
                            <CardHeader className="border-0">
                              <h2 className="mb-0">Hình ảnh</h2>
                            </CardHeader>
                          </div>
                          <div className="col-md-12">
                            <form>
                              <div className="row">
                                <div
                                  className=""
                                  id="dropzone-single"
                                  style={{
                                    width: "100%",
                                    padding: "0 30px 30px 30px",
                                  }}
                                >
                                  <div className="" style={{ height: "100%" }}>
                                    <ImageUploading
                                      value={images}
                                      onChange={onChange}
                                      maxNumber={maxNumber}
                                      dataURLKey="data_url"
                                      acceptType={["jpg", "png", "jpeg"]}
                                    >
                                      {({
                                        imageList,
                                        onImageUpload,
                                        onImageRemoveAll,
                                        onImageUpdate,
                                        onImageRemove,
                                        isDragging,
                                        dragProps,
                                      }) => (
                                        <div
                                          className="upload-img"
                                          onClick={onImageUpload}
                                        >
                                          {images.length <= 0 && (
                                            <span
                                              style={
                                                isDragging
                                                  ? { color: "red" }
                                                  : undefined
                                              }
                                              onClick={onImageUpload}
                                              {...dragProps}
                                            >
                                              Tải hình ảnh
                                            </span>
                                          )}
                                          {imageList.map((image, index) => (
                                            <div
                                              key={index}
                                              className="upload-img"
                                              style={{
                                                position: "relative",
                                              }}
                                            >
                                              <img
                                                src={image.data_url}
                                                alt=""
                                                width="100"
                                                style={{
                                                  position: "relative",
                                                  zIndex: 10,
                                                }}
                                              />
                                              <div className="image-item__btn-wrapper">
                                                {/* <Button
                                                  color="danger"
                                                  size="sm"
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.preventDefault()
                                                    onImageRemove(index)
                                                  }}
                                                >
                                                  Xóa
                                                </Button> */}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </ImageUploading>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </Card>
                      </div>
                      <div className="col-lg-8 modal-product">
                        <Card
                          style={{ height: "100%" }}
                          className="shadow-none"
                        >
                          <CardBody>
                            <Row>
                              <Col lg="6">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-username"
                                  >
                                    Tên tài xế
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    placeholder="Tên tài xế"
                                    type="text"
                                    value={driverName}
                                    onChange={(e) =>
                                      setDriverName(e.target.value)
                                    }
                                    invalid={driverNameState === "invalid"}
                                    valid={driverNameState === "valid"}
                                  />
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                  >
                                    Số điện thoại
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-email"
                                    placeholder="Số điện thoại"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    invalid={phoneState === "invalid"}
                                    valid={phoneState === "valid"}
                                  />
                                  {phoneState === "invalid" && (
                                    <div
                                      style={{
                                        color: "red",
                                        fontSize: 12,
                                      }}
                                    >
                                      {phoneMessage}
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-first-name"
                                  >
                                    Loại xe
                                  </label>
                                  <Select
                                    value={vehicleType}
                                    onChange={(option) =>
                                      setVehicleType(option)
                                    }
                                    options={optionsVehicleType}
                                    styles={customStylesPayment}
                                  />
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-last-name"
                                  >
                                    Màu xe
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-last-name"
                                    placeholder="Màu xe"
                                    type="text"
                                    value={vehicleColor}
                                    onChange={(e) =>
                                      setVehicleColor(e.target.value)
                                    }
                                    invalid={vehicleColorState === "invalid"}
                                    valid={vehicleColorState === "valid"}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-username"
                                  >
                                    Biển số xe
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    placeholder="Biển số xe"
                                    type="text"
                                    value={numberVehicle}
                                    onChange={(e) =>
                                      setNumberVehicle(e.target.value)
                                    }
                                    invalid={numberVehicleState === "invalid"}
                                    valid={numberVehicleState === "valid"}
                                  />
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                  >
                                    Đội vận chuyển
                                  </label>
                                  <Select
                                    value={deliveryTeam}
                                    onChange={(option) =>
                                      setdeliveryTeam(option)
                                    }
                                    options={optionsDeliveryTeam}
                                    styles={customStylesPayment}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="form-group">
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                  >
                                    Trạng thái
                                  </label>
                                  <Select
                                    value={status}
                                    onChange={(option) => setStatus(option)}
                                    options={optionsStatus}
                                    styles={customStylesPayment}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <div
                              className="text-center"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "15px",
                                flexWrap: "wrap", // To handle responsive layout
                                gap: "10px", // To add space between buttons
                              }}
                            >
                              <Button
                                color="success"
                                type="button"
                                onClick={toggleRechargeModal}
                              >
                                Nạp tiền
                              </Button>
                              <RechargeModal
                                isOpen={isRechargeModalOpen}
                                toggle={toggleRechargeModal}
                              />
                              <Button
                                color="danger"
                                onClick={openWithdrawModal}
                                type="button"
                                style={{ marginLeft: "10px" }}
                              >
                                Rút tiền
                              </Button>
                              <WithdrawModal
                                isOpen={isWithdrawModalOpen}
                                toggle={closeWithdrawModal}
                              />
                              <Button
                                color="primary"
                                type="button"
                                style={{ marginLeft: "10px" }}
                                onClick={toggleTransactionHistoryModal}
                              >
                                Lịch sử giao dịch
                              </Button>
                              <TransactionHistoryModal isOpen={transactionHistoryModalOpen} toggle={toggleTransactionHistoryModal} />
                              {isLoadingCircle ? (
                                <Button
                                  className="btn-neutral btn-icon"
                                  color="default"
                                  disabled
                                >
                                  <Spinner size="sm">Loading...</Spinner>
                                </Button>
                              ) : (
                                <Button
                                  className="btn-neutral btn-icon"
                                  color="default"
                                  onClick={handleSubmit}
                                >
                                  Lưu
                                </Button>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </Row>
                  </Container>
                </CardBody>
              </Card>
            </div>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

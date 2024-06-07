import axios from "axios";
import { BASE_URL, SHIP, BASE_URL_CORAL_TEAM_VERSION } from "./constants";

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/shipper-management/shippers?pageIndex=1&pageSize=20
export const getListShipper = (page, size) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers?pageIndex=${page}&pageSize=${size}`,
    {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  );
};
// https://api.vhgp.net/api/v1/shipper-management/shippers/search-name?shipName=thien&pageIndex=1&pageSize=100'
export const getListShipperbyKey = (key, page, size) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers/search-name?shipName=${key}&pageIndex=${page}&pageSize=${size}`,
    {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  );
};
//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/shipper-management/shippers
export const postShipper = (shipper) => {
  return axios.post(`${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers`, shipper, {
    Accept: "application/json",
    "Content-Type": "application/json",
  });
};
//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/shipper-management/shippers/1
export const putShipper = (shipper) => {
  return axios.patch(
    `${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers/${shipper.id}`,
    shipper,
    {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  );
};
//http://vhgp-api.vhgp.net/api/Shipper/GetRedis
export const getShipperRedis = async () => {
  return await axios.get("https://vhgp-api.vhgp.net/api/Shipper/GetRedis");
};

//https://api.vhgp.net/api/v1/routes/get-delivery-point/${shipper.id}
export const getShipperLocation = async (shipper) => {
  return await axios.get(
    `https://vhgp-api.vhgp.net/api/locations/${shipper.id}`
  );
};

//http://vhgp-api.vhgp.net/api/locations/${shipper.id}
export const getEndPoitLocation = async (shipper) => {
  return await axios.get(
    `https://api.vhgp.net/api/v1/routes/get-delivery-point/${shipper.id}`
  );
};

//https://vhgp-api.vhgp.net/api/Shipper
export const getAllShipper = async () => {
  return await axios.get(`https://vhgp-api.vhgp.net/api/Shipper`);
};

//https://vhgp-api.vhgp.net/api/Shipper/GetTimeShipperOff/{shipperId}
export const getTimeShipperOffline = async (shipper) => {
  return await axios.get(
    `https://vhgp-api.vhgp.net/api/Shipper/GetTimeShipperOff/${shipper.id}`
  );
};

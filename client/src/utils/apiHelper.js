import axios from "axios";
import { getAccessToken } from "./appHelper";
import { _api } from "../config/environment";

const API_HOST = _api.url;

export const getRequest = async (url, options = {}) => {
  return await axios.get(API_HOST + url, {
    ...(options || {}),
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      ...(options.headers || {}),
    },
  });
};

export const postRequest = async (url, data = {}, queryParams = {}, options = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${API_HOST + url}?${queryString}` : API_HOST + url;

  console.log("🚀 ~ postRequest ~ url:", fullUrl);
  return await axios.post(fullUrl, data, {
    ...(options || {}),
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      ...(options.headers || {}),
    },
  });
};

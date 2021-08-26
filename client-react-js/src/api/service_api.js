import axios from "axios";

const {
  REACT_APP_COMMON_DATA_SERVICE_PORT,
  REACT_APP_AUTHENTICATION_SERVICE_PORT,
  REACT_APP_SEARCH_SUGGESTION_SERVICE_PORT,
  REACT_APP_COMMON_DATA_SERVICE_URL,
  REACT_APP_AUTHENTICATION_SERVICE_URL,
  REACT_APP_SEARCH_SUGGESTION_SERVICE_URL,
} = process.env;

export const commonServiceAPI = axios.create({
  baseURL: "http://localhost:9000",
});

export const authServiceAPI = axios.create({
  baseURL: `http://localhost:9001`,
});

export const searchSuggestionServiceAPI = axios.create({
  baseURL: `http://localhost:9002`,
});

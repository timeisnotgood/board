import { setAlert } from "../store/reducers/uiReducer";

export const parseErrorResponses = (errResponse, dispatch) => {
  console.log(errResponse);
  const errStatus = errResponse?.status || errResponse?.code;
  let alert = {};
  switch (errStatus) {
    case "ERR_NETWORK":
      alert = {
        type: "error",
        message: "Network Error",
      };
      break;
    // Invalid Credentials or UnAuthorized
    case 401:
      alert = {
        type: "error",
        message: "Invalid Credentials",
      };
      break;
    default:
  }

  if (dispatch) {
    dispatch(setAlert(alert));
  }
};

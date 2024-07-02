import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import "./bootstrap.min.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "../AptiComponents/store";



function index() {
  return (
    <Provider store={store}>
    <App />
  </Provider>
  )
}

export default index

import React from 'react';
import ReactDOM from 'react-dom';
// import './AdminDashboard/assets/boxicons-2.0.7/css/boxicons.min.css'
// import './AdminDashboard/assets/css/grid.css'
// import './AdminDashboard/assets/css/theme.css'
import { Provider } from "react-redux";
import store from "./AptiComponents/store";


import './index.css';
// import App from './App';
import Homepage from './Components/Homepage'


ReactDOM.render(
  <Provider store={store}>
    <Homepage />
  </Provider>,
  document.getElementById('root')
);


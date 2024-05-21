import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import SynthKeys from './SynthKeys'
import MyRecordings from './MyRecordings'
import CommunitySounds from './CommunitySounds';
import Home from './Home';

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/record",
    element: <SynthKeys />,
  },
  {
    path: "/myrecordings",
    element: <MyRecordings />,
  },
  {
    path: "/commsounds",
    element: <CommunitySounds />
  }
]

const router = createBrowserRouter (routes)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

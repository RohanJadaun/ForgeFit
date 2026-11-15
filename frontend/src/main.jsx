import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./store/store";

if (window.localStorage.getItem("forgefit_theme") === "dark") {
  document.documentElement.dataset.theme = "dark";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

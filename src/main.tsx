import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import App from "./App";
import { store } from "./app/store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <HelmetProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          classNames: {
            toast: "my-toast",
            title: "my-toast-title",
            description: "my-toast-description",
            icon: "my-toast-icon",

            success: "my-toast-success",
            error: "my-toast-error",
            info: "my-toast-info",
            warning: "my-toast-warning",
          },
        }}
      />
    </HelmetProvider>
  </Provider>,
);

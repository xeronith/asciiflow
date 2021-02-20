import React = require("react");
import {
  Controller,
  DesktopController,
  TouchController,
} from "asciiflow/client/controller";
import { Drawer } from "asciiflow/client/drawer";
import { DrawingId, store } from "asciiflow/client/store";
import { View } from "asciiflow/client/view";
import { BrowserRouter, Route, useParams } from "react-router-dom";
import ReactDOM = require("react-dom");
import * as styles from "asciiflow/client/app.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useObserver } from "mobx-react";

const controller = new Controller();
const touchController = new TouchController(controller);
const desktopController = new DesktopController(controller);

export interface IRouteProps {
  local: string;
  share: string;
}

export const App = () => {
  return useObserver(() => {
    const routeProps = useParams<IRouteProps>();
    store.setRoute(
      routeProps.share
        ? DrawingId.share(decodeURIComponent(routeProps.share))
        : DrawingId.local(routeProps.local || null)
    );

    const theme = React.useMemo(
      () =>
        createMuiTheme({
          palette: {
            type: store.darkMode.get() ? "dark" : "light",
          },
        }),
      [store.darkMode.get()]
    );
    return (
      <ThemeProvider theme={theme}>
        <div
          className={[styles.app, store.darkMode.get() ? "dark" : ""].join(" ")}
        >
          <Drawer />
          <View
            {...desktopController.getHandlerProps()}
            {...touchController.getHandlerProps()}
          />
        </div>
      </ThemeProvider>
    );
  });
};

async function render() {
  ReactDOM.render(
    <BrowserRouter>
      <Route exact path="/" component={App} />
      <Route path="/local/:local" component={App} />
      <Route path="/share/:share" component={App} />
    </BrowserRouter>,
    document.getElementById("root")
  );
}

// tslint:disable-next-line: no-console
render().catch((e) => console.log(e));

window.addEventListener("keypress", (e) => controller.handleKeyPress(e));
window.addEventListener("keydown", (e) => controller.handleKeyDown(e));
window.addEventListener("keyup", (e) => controller.handleKeyUp(e));

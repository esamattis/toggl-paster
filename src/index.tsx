import ReactDOM from "react-dom";
import moment from "moment";
import "moment/locale/fi";
import { Provider } from "react-redux";
moment.locale("fi");
import React from "react";
import { Main } from "./components/Main";
import { HashRouter as Router } from "react-router-dom";
import { createStore } from "./redux/state";
import { FileDrop } from "./components/FileDrop";

function Root() {
    const store = createStore();
    return (
        <Provider store={store as any}>
            <Router>
                <FileDrop>
                    <Main></Main>
                </FileDrop>
            </Router>
        </Provider>
    );
}

ReactDOM.render(<Root></Root>, document.getElementById("app"));

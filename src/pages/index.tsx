import ReactDOM from "react-dom";
import moment from "moment";
import "moment/locale/fi";
import { Provider } from "react-redux";
moment.locale("fi");
import React, { useEffect, useState } from "react";
import { Main } from "../components/Main";
import { HashRouter as Router } from "react-router-dom";
import { createStore } from "../redux/store";
import { FileDrop } from "../components/FileDrop";

function useWindow() {
    const [myWin, setWindow] = useState<typeof window | undefined>();

    useEffect(() => {
        setWindow(window);
    });

    return myWin;
}

function css(styleString: TemplateStringsArray) {
    if (typeof window === "undefined") {
        return;
    }

    const style = document.createElement("style");
    style.textContent = styleString[0];
    document.head.append(style);
}

css`
    .bemed {
        display: flex;
        position: relative;
        flex-direction: column;
        box-sizing: border-box;
    }
    .ant-message-notice {
        text-align: left !important;
    }
`;

export default function Root() {
    const window = useWindow();

    if (!window) {
        return <div>Loading...</div>;
    }

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

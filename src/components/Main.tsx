import React, { useEffect, useRef } from "react";
import { useRouteDate } from "../utils";
import { Month } from "./Month";
import { DayDetails } from "./DayDetails";
import { bemed } from "react-bemed";
import { css } from "react-bemed/css";
import { Button } from "antd";
import { ExportButton } from "./ExportButton";
import { IntraAuth } from "./IntraAuth";

const Blk = bemed({
    css: css``,

    elements: {
        ExportButton: bemed({
            as: ExportButton,
            css: css`
                position: absolute;
                top: 10px;
                right: 10px;
            `,
        }),
    },
})("Layout");

function Layout(props: { children: React.ReactNode }) {
    return (
        <Blk>
            {props.children}
            <Blk.ExportButton />
        </Blk>
    );
}

export function Main() {
    const [year, month, day] = useRouteDate();

    if (day !== undefined) {
        return (
            <Layout>
                <IntraAuth />
                <DayDetails />
            </Layout>
        );
    }

    return (
        <Layout>
            <IntraAuth />
            <Month />
        </Layout>
    );
}

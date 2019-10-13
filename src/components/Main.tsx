import "antd/dist/antd.css";
import React from "react";
import { useRouteDate } from "../utils";
import { Month } from "./Month";
import { DayDetails } from "./DayDetails";

export function Main() {
    const [year, month, day] = useRouteDate();

    if (day !== undefined) {
        return <DayDetails />;
    }

    return <Month />;
}

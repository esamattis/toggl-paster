import "antd/dist/antd.css";
import React from "react";
import { Calendar } from "antd";
import { useHistory } from "react-router-dom";
import { DayCell } from "./DayCell";
import { useCurrentDate } from "../utils";

export function Main() {
    const panelDate = useCurrentDate();

    const history = useHistory();

    return (
        <div>
            <h1>{panelDate.format("YYYY-MM-DD")}</h1>;
            <Calendar
                value={panelDate}
                mode="month"
                // onSelect={e => {
                //     console.log("selected", e);
                //     setValue(e);
                // }}
                onPanelChange={month => {
                    if (month) {
                        console.log("panel changel", month.format("/YYYY/MM"));
                        history.push(month.format("/YYYY/MM"));
                    }
                }}
                dateCellRender={date => {
                    return <DayCell date={date.toDate()}></DayCell>;
                }}
            />
        </div>
    );
}

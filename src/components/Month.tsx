import React from "react";
import { Calendar } from "antd";
import { useHistory } from "react-router-dom";
import { DayCell } from "./DayCell";
import { useCurrentDate } from "../utils";
import { bemed } from "react-bemed";
import { css } from "react-bemed/css";
import moment from "moment";
import { format } from "date-fns";

const Blk = bemed({
    css: css`
        /* Hide the month / year view selector */
        .ant-fullcalendar-header .ant-radio-group {
            display: none;
        }
        .ant-fullcalendar-date {
            cursor: default !important;
        }
    `,
    elements: {
        Header: bemed({
            css: css`
                margin-left: 0.5rem;
            `,
        }),
    },
})("MonthContainer");

export function Month() {
    const date = useCurrentDate();
    const history = useHistory();

    return (
        <Blk>
            <Blk.Header>
                <h1>{format(date, "MMMM yyyy")}</h1>
                <p>
                    Just drop your Toggl_time_entries_*.csv files here.{" "}
                    <a href="https://github.com/epeli/toggl-paster">Github</a>.
                </p>
            </Blk.Header>
            <Calendar
                value={moment(date)}
                mode="month"
                // onSelect={e => {
                //     console.log("selected", e);
                //     setValue(e);
                // }}
                onPanelChange={(month) => {
                    if (month) {
                        console.log("panel changel", month.format("/YYYY/MM"));
                        history.push(month.format("/YYYY/MM"));
                        window.scrollTo(0, 0);
                    }
                }}
                dateCellRender={(date) => {
                    return <DayCell date={date.toDate()}></DayCell>;
                }}
            />
        </Blk>
    );
}

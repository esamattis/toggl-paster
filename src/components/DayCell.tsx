import React from "react";
import { bemed } from "react-bemed";
import { Button, Tooltip, message, Typography } from "antd";
import prettyMs from "pretty-ms";
import { useAppSelector, formatDate, Actions } from "../redux/state";
import { useDispatch } from "react-redux";
import { useRouteDate, copyToClipboard } from "../utils";
import { getMonth } from "date-fns/esm";
import { css } from "react-bemed/css";

const { Paragraph } = Typography;

const Blk = bemed({
    css: css`
        /* background-color: red; */
        text-align: center;
    `,
    elements: {
        Duration: bemed({
            as: Paragraph,
            css: css`
                font-size: 140%;
                color: red;
            `,
            mods: {
                ok: css`
                    color: lightgreen;
                `,
            },
        }),
    },
})("CellContainer");

function formatClock(duration: number) {
    const hours = duration / 1000 / 60 / 60;
    const hoursOnly = Math.floor(hours);
    const minutes = (hours - hoursOnly) * 60;

    const formattedHours = String(hoursOnly).padStart(2, "0");
    const formattedMinutes = String(Math.round(minutes)).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
}

export function DayCell(props: { date: Date }) {
    console.log("CHcka", formatDate(props.date));

    const day = useAppSelector(state => {
        return state.days[formatDate(props.date)];
    });

    const [_year, month] = useRouteDate();

    const isCurrentMonth = month === getMonth(props.date) + 1;

    const dispatch = useDispatch();

    if (!day) {
        return null;
    }

    const duration = day.entries.reduce((acc, current) => {
        return acc + current.duration;
    }, 0);

    return (
        <Blk>
            <Blk.Duration strong ok={day.copied}>
                {prettyMs(duration)}
            </Blk.Duration>

            {/* {day.copied ? "OK" : "NOPE"} */}

            <Tooltip title={formatClock(duration)}>
                <Button
                    disabled={!isCurrentMonth}
                    onClick={() => {
                        copyToClipboard(formatClock(duration));
                        dispatch(Actions.setCopied(props.date));
                        message.info(
                            `Copied "${formatClock(duration)}" to clipboard`,
                        );
                    }}
                >
                    Copy
                </Button>
            </Tooltip>
        </Blk>
    );
}

import React from "react";
import { bemed } from "react-bemed";
import { Button, Tooltip, message, Typography, Icon } from "antd";
import { Link } from "react-router-dom";
import prettyMs from "pretty-ms";
import { Actions } from "../redux/state";
import { useDispatch } from "react-redux";
import {
    useRouteDate,
    copyToClipboard,
    useDay,
    formatDatePath,
} from "../utils";
import { getMonth } from "date-fns/esm";
import { css } from "react-bemed/css";
import { uniq } from "lodash-es";

const Blk = bemed({
    css: css`
        /* background-color: red; */
        text-align: center;
    `,
    mods: {
        otherMonth: css`
            opacity: 0.2;
        `,
    },
    elements: {
        Duration: bemed({
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
        ProjectsLink: bemed({
            as: Link,
            css: css`
                flex-direction: row;
                justify-content: center;
                align-items: center;
                color: red;
            `,
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
    const day = useDay(props.date);

    const [_year, month] = useRouteDate();

    const isCurrentMonth = month === getMonth(props.date) + 1;

    const dispatch = useDispatch();

    if (!day) {
        return null;
    }

    const duration = day.entries.reduce((acc, current) => {
        return acc + current.duration;
    }, 0);

    const projects = uniq(day.entries.map(entry => entry.project))
        .filter(Boolean)
        .join(",");

    return (
        <Tooltip title={projects}>
            <Blk otherMonth={!isCurrentMonth}>
                <Blk.Duration ok={day.copied}>
                    {prettyMs(duration)}
                </Blk.Duration>

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
                <Blk.ProjectsLink to={formatDatePath(props.date)}>
                    Projects
                    <Icon type="caret-right" />
                </Blk.ProjectsLink>
            </Blk>
        </Tooltip>
    );
}

import React from "react";
import { bemed } from "react-bemed";
import { Button, Tooltip, message, Typography, Icon, Badge } from "antd";
import { Link } from "react-router-dom";
import prettyMs from "pretty-ms";
import { Actions, useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import {
    useRouteDate,
    copyToClipboard,
    useDay,
    formatDatePath,
    getDayKey,
    useModifiedDay,
} from "../utils";
import { getMonth } from "date-fns";
import { css } from "react-bemed/css";
import { uniq } from "lodash";

const Blk = bemed({
    css: css`
        text-align: center;
        justify-content: space-between;
        height: 100%;
    `,
    mods: {
        otherMonth: css`
            opacity: 0.2;
        `,
        lastCopied: css`
            background-color: rgba(251, 255, 0, 0.3);
        `,
    },
    elements: {
        CopyButton: bemed({
            as: Button,
            css: css`
                padding: 0;
                height: 30px;
                width: 30px;
                text-align: center;
                justify-content: center;
                align-items: center;
            `,
        }),
        DurationRow: bemed({
            css: css`
                flex-direction: row;
                justify-content: space-between;
            `,
        }),
        Duration: bemed({
            as: "span",
            css: css`
                flex-direction: row;
                font-size: 140%;
                color: red;
            `,
            mods: {
                ok: css`
                    color: lightgreen;
                `,
            },
        }),
        DurationNote: bemed({
            as: "span",
            css: css`
                color: red;
                font-size: 120%;
            `,
        }),
        DetailsLink: bemed({
            as: Link,
            css: css`
                flex-direction: row;
                justify-content: center;
                align-items: center;
                color: red;
                text-decoration: underline;
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
    const lastCopiedDate = useAppSelector((state) => state.lastCopiedDate);
    const day = useDay(props.date);
    const modifiedDay = useModifiedDay(props.date);

    const [_year, month] = useRouteDate();

    const isCurrentMonth = month === getMonth(props.date) + 1;

    const dispatch = useDispatch();

    if (!day) {
        return null;
    }

    const duration = day.entries.reduce((acc, current) => {
        return acc + current.duration;
    }, 0);

    const projects = uniq(day.entries.map((entry) => entry.project))
        .filter(Boolean)
        .join(",");

    const projectsOk = day.entries.every(
        (entry) => day.projectsCopied[entry.project],
    );

    return (
        <Tooltip title={projects}>
            <Blk
                otherMonth={!isCurrentMonth}
                lastCopied={lastCopiedDate === getDayKey(props.date)}
            >
                <Blk.DurationRow>
                    <Blk.Duration ok={day.copied}>
                        {prettyMs(duration)}
                        {Boolean(modifiedDay) && (
                            <Blk.DurationNote>*</Blk.DurationNote>
                        )}
                    </Blk.Duration>
                    <Blk.CopyButton
                        type={day.copied ? "ghost" : "primary"}
                        disabled={!isCurrentMonth}
                        onClick={() => {
                            copyToClipboard(formatClock(duration));
                            dispatch(Actions.setCopied(props.date));
                        }}
                    >
                        <Icon type="copy" />
                    </Blk.CopyButton>
                </Blk.DurationRow>

                <Blk.DetailsLink
                    to={formatDatePath(props.date)}
                    ok={projectsOk}
                >
                    Details
                    <Icon type="caret-right" />
                </Blk.DetailsLink>
            </Blk>
        </Tooltip>
    );
}

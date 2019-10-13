import React from "react";
import prettyMs from "pretty-ms";
import { Link } from "react-router-dom";
import { List, Button } from "antd";
import {
    useRouteDate,
    useCurrentDate,
    useDay,
    formatMonthPath,
    copyToClipboard,
    formatDate,
    formatDatePath,
} from "../utils";
import { bemed } from "react-bemed";
import { css } from "react-bemed/css";
import { Entry, Actions } from "../redux/state";
import { uniq } from "lodash-es";
import { useDispatch } from "react-redux";
import { addDays } from "date-fns";

const Blk = bemed({
    css: css`
        margin-left: 1rem;
        margin-right: 1rem;
    `,
    elements: {
        Title1: bemed({
            as: "h1",
            css: css`
                font-size: 30pt;
                text-align: center;
            `,
        }),
        Title2: bemed({
            as: "h2",
            css: css`
                font-size: 18pt;
                text-align: center;
            `,
        }),
        Header: bemed({
            css: css`
                flex-direction: row;
                justify-content: space-around;
            `,
        }),
        Link: bemed({
            as: Link,
            css: css``,
        }),
        DurationText: bemed({
            as: "span",
            css: css`
                color: red;
            `,
            mods: {
                ok: css`
                    color: lightgreen;
                `,
            },
        }),
    },
})("DayDetailsContainer");

interface Projects {
    [project: string]: {
        project: string;
        duration: number;
        descriptions: string[];
    };
}

function listByProject(entries: Entry[]) {
    const projects: Projects = {};

    for (const entry of entries) {
        let project = projects[entry.project];
        if (!project) {
            project = projects[entry.project] = {
                project: entry.project,
                duration: 0,
                descriptions: [],
            };
        }

        project.duration += entry.duration;
        project.descriptions.push(entry.description);
        project.descriptions = uniq(project.descriptions);
    }

    return Object.keys(projects)
        .sort()
        .map(project => projects[project]);
}

function formatDuration(duration: number) {
    return (duration / 1000 / 60 / 60).toFixed(2);
}

function Entries() {
    const date = useCurrentDate();
    const day = useDay(date);
    const dispatch = useDispatch();

    if (!day) {
        return null;
    }

    const projects = listByProject(day.entries);

    const allProjects = day.entries.reduce((acc, current) => {
        return acc + current.duration;
    }, 0);

    return (
        <Blk>
            <Blk.Title2>Total {formatDuration(allProjects)}h</Blk.Title2>
            <List
                itemLayout="horizontal"
                dataSource={projects}
                renderItem={item => {
                    const ok = day.projectsCopied[item.project];

                    function handleClick() {
                        copyToClipboard(formatDuration(item.duration));
                        dispatch(Actions.setProjectCopied(date, item.project));
                    }

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={item.project}
                                description={item.descriptions.join(", ")}
                            />
                            <List.Item.Meta
                                title="Duration"
                                description={
                                    <Blk.DurationText ok={ok}>
                                        {formatDuration(item.duration)}h
                                    </Blk.DurationText>
                                }
                            />
                            <Button type="primary" onClick={handleClick}>
                                Copy
                            </Button>
                        </List.Item>
                    );
                }}
            />
        </Blk>
    );
}

export function DayDetails() {
    const date = useCurrentDate();

    return (
        <Blk>
            <Blk.Header>
                <Blk.Link to={formatDatePath(addDays(date, -1))}>
                    Yesterday
                </Blk.Link>
                <Blk.Link to={formatMonthPath(date)}>
                    Back to month view
                </Blk.Link>
                <Blk.Link to={formatDatePath(addDays(date, 1))}>
                    Tomorrow
                </Blk.Link>
            </Blk.Header>
            <Blk.Title1>{formatDate(date)}</Blk.Title1>
            <Entries />
        </Blk>
    );
}

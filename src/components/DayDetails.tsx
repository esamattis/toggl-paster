import React from "react";
import { Link } from "react-router-dom";
import { List, Button } from "antd";
import {
    useRouteDate,
    useCurrentDate,
    useDay,
    formatMonthPath,
    copyToClipboard,
    getDayKey,
    formatDatePath,
    useModifiedDay,
} from "../utils";
import { bemed } from "react-bemed";
import { css } from "react-bemed/css";
import { Entry, Actions } from "../redux/store";
import { uniq } from "lodash";
import { useDispatch } from "react-redux";
import { addDays, format } from "date-fns";

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
        ModifiedButton: bemed({
            as: Button,
            css: css`
                width: 200px;
                margin-right: 25px;
            `,
            mods: {
                redBorders: css`
                    border-color: red;
                `,
            },
        }),
        ButtonRow: bemed({
            css: css`
                flex-direction: row;
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
        .map((project) => projects[project]);
}

function formatDuration(duration: number) {
    return (duration / 1000 / 60 / 60).toFixed(2);
}

function Entries() {
    const date = useCurrentDate();
    const day = useDay(date);
    const [previewModified, setPreviewModified] = React.useState(false);
    const modifiedDay = useModifiedDay(date);
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

            {modifiedDay && (
                <Blk.ButtonRow>
                    {Boolean(!previewModified) && (
                        <Blk.ModifiedButton
                            type="dashed"
                            redBorders
                            onClick={() => {
                                setPreviewModified(true);
                            }}
                        >
                            Preview modified changes
                        </Blk.ModifiedButton>
                    )}

                    {Boolean(previewModified) && (
                        <Blk.ModifiedButton
                            type="dashed"
                            onClick={() => {
                                setPreviewModified(false);
                            }}
                        >
                            Cancel
                        </Blk.ModifiedButton>
                    )}

                    {previewModified && (
                        <Blk.ModifiedButton
                            type="danger"
                            onClick={() => {
                                dispatch(Actions.acceptModifiedDay(date));
                                setPreviewModified(false);
                            }}
                        >
                            Accept modified changes
                        </Blk.ModifiedButton>
                    )}
                </Blk.ButtonRow>
            )}

            <List
                itemLayout="horizontal"
                dataSource={projects}
                renderItem={(item) => {
                    const ok =
                        day.projectsCopied[item.project] && !previewModified;

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
                            <Button
                                type={ok ? "ghost" : "primary"}
                                onClick={handleClick}
                                disabled={previewModified}
                            >
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
            <Blk.Title1>{format(date, "d.L EEEE")}</Blk.Title1>
            <Entries />
        </Blk>
    );
}

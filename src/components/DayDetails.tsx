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
        SecondHeader: bemed({
            css: css`
                flex-direction: row;
                justify-content: center;
            `,
        }),
        CopySumInfo: bemed({
            css: css`
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                width: 100px;
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
    [project: string]: Entry;
}

function listByProject(entries: Entry[]) {
    const projects: Projects = {};

    for (const entry of entries) {
        let project = projects[entry.project];
        if (!project) {
            project = projects[entry.project] = {
                project: entry.project,
                duration: 0,
                description: "",
            };
        }

        project.duration += entry.duration;
        if (!project.description.includes(entry.description)) {
            project.description += entry.description;
        }
    }

    return Object.keys(projects)
        .sort()
        .map((project) => projects[project]);
}

function formatDuration(duration: number) {
    return (duration / 1000 / 60 / 60).toFixed(2);
}

function calculateSum(entries: Entry[]) {
    return entries.reduce((acc, current) => {
        return acc + current.duration;
    }, 0);
}

function Entries() {
    const date = useCurrentDate();
    const day = useDay(date);
    const [previewModified, setPreviewModified] = React.useState(false);
    const modifiedDay = useModifiedDay(date);
    const dispatch = useDispatch();
    const [sumProjects, setSumpProjects] = React.useState<Entry[]>([]);

    if (!day) {
        return null;
    }

    const projects = listByProject(day.entries);

    const allProjects = calculateSum(day.entries);

    return (
        <Blk>
            <Blk.SecondHeader>
                <Blk.Title2>Total {formatDuration(allProjects)}h</Blk.Title2>
                <Blk.CopySumInfo>
                    Copied total {formatDuration(calculateSum(sumProjects))} h
                </Blk.CopySumInfo>
            </Blk.SecondHeader>

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

                    const inSum = sumProjects.some(
                        (p) => p.project === item.project,
                    );

                    function handleClick() {
                        setSumpProjects([item]);
                        copyToClipboard(formatDuration(item.duration));
                        dispatch(Actions.setProjectCopied(date, item.project));
                    }

                    function handleSumClick() {
                        if (inSum) {
                            return;
                        }

                        const nextSum = [...sumProjects, item];
                        const total = calculateSum(nextSum);
                        copyToClipboard(formatDuration(total));
                        setSumpProjects(nextSum);
                        dispatch(Actions.setProjectCopied(date, item.project));
                    }

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={item.project}
                                description={item.description}
                            />
                            <List.Item.Meta
                                title="Duration"
                                description={
                                    <Blk.DurationText ok={ok}>
                                        {formatDuration(item.duration)} h
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

                            <Button
                                style={{ marginLeft: 3 }}
                                type={inSum ? "ghost" : "primary"}
                                onClick={handleSumClick}
                                disabled={previewModified || inSum}
                            >
                                Sum
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

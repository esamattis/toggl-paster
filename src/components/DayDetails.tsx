import React from "react";
import prettyMs from "pretty-ms";
import { Link } from "react-router-dom";
import { List, Button } from "antd";
import {
    useRouteDate,
    useCurrentDate,
    useDay,
    formatMonthPath,
} from "../utils";
import { bemed } from "react-bemed";
import { css } from "react-bemed/css";
import { Entry } from "../redux/state";
import { uniq } from "lodash-es";

const Blk = bemed({
    css: css`
        margin-left: 1rem;
        margin-right: 1rem;
    `,
    elements: {
        Title: bemed({
            css: css`
                margin-left: 0.5rem;
            `,
        }),
        MonthLink: bemed({
            as: Link,
            css: css``,
        }),
    },
})("DayDetailsContainer");

const columns = [
    {
        title: "Project",
        dataIndex: "project",
        key: "project",
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
    },
    {
        title: "Descriptions",
        dataIndex: "description",
        key: "description",
    },
];

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

function Entries() {
    const date = useCurrentDate();
    const day = useDay(date);

    if (!day) {
        return null;
    }

    const projects = listByProject(day.entries);

    return (
        <Blk>
            <List
                itemLayout="horizontal"
                dataSource={projects}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.project}
                            description={item.descriptions.join(", ")}
                        />
                        <List.Item.Meta
                            title="Duration"
                            description={prettyMs(item.duration)}
                        />
                        <Button>Copy</Button>
                    </List.Item>
                )}
            />
        </Blk>
    );
}

export function DayDetails() {
    const date = useCurrentDate();

    return (
        <Blk>
            <Blk.MonthLink to={formatMonthPath(date)}>
                Back to month view
            </Blk.MonthLink>
            <Entries />
        </Blk>
    );
}

import React from "react";
import sha1 from "sha1";
import stringify from "json-stable-stringify";
import Papa from "papaparse";
import { bemed } from "react-bemed";
import { css } from "react-bemed/css";
import { Entry, Actions, State } from "../redux/store";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { readBrowserFile } from "../utils";

const Blk = bemed({
    css: css``,
    elements: {
        Overlay: bemed({
            css: css`
                position: absolute;
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                background-color: rgba(0, 0, 0, 0.75);
                z-index: 50;
            `,
        }),
        DropText: bemed({
            css: css`
                font-size: 44pt;
                color: white;
                justify-content: center;
                align-items: center;
            `,
        }),
    },
})("FileDropContainer");

function parseDuration(duration: string): number {
    if (!duration) {
        return 0;
    }

    const [hours, minutes, seconds] = duration
        .split(":")
        .map(section => parseInt(section, 10));

    return hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
}

function parseTogglEntries(res: Papa.ParseResult) {
    const days: Record<
        string,
        | {
              entries: Entry[];
          }
        | undefined
    > = {};

    for (const row of res.data.slice(1)) {
        const [
            user,
            email,
            client,
            project,
            task,
            description,
            billable,
            startDate,
            startTime,
            endDate,
            endTime,
            duration,
            tags,
            amount,
        ] = row;

        if (!startDate) {
            continue;
        }

        let day = days[startDate];

        if (!day) {
            day = {
                entries: [],
            };
            days[startDate] = day;
        }

        day.entries.push({
            project: project || "[no project]",
            description: description,
            duration: parseDuration(duration),
        });
    }

    return days;
}

async function generateId(ob: any): Promise<string> {
    const str = stringify(ob);
    return sha1(str);
}

async function importJsonData(dispatch: Function, file: File) {
    const stringData = await readBrowserFile(file);
    const state: State = JSON.parse(stringData);

    const count = Object.keys(state.days).length;

    if (confirm(`Want to replace state with ${count} entries?`)) {
        dispatch(Actions.importState(state));
    }
}

function useFileParser() {
    const dispatch = useDispatch();

    return async (file: File) => {
        if (file.name.startsWith("toggl-paster-export-")) {
            importJsonData(dispatch, file);
            return;
        }

        if (!file.name.startsWith("Toggl_time_entries_")) {
            message.error(
                `Bad file name ${file.name} - file name must start with Toggl_time_entries_`,
            );
            return;
        }

        const days: ReturnType<typeof parseTogglEntries> = await new Promise(
            resolve => {
                Papa.parse(file, {
                    complete(res) {
                        resolve(parseTogglEntries(res));
                    },
                });
            },
        );

        for (const [date, day] of Object.entries(days)) {
            if (day) {
                const id = await generateId(day);
                dispatch(Actions.addDay(new Date(date), id, day.entries));
            }
        }
    };
}

export function FileDrop(props: { children: React.ReactNode }) {
    const [isHovering, setHovering] = React.useState(false);
    const parseFile = useFileParser();

    return (
        <div
            onDragEnter={e => {
                e.preventDefault();
                console.log("enter");
                setHovering(true);
            }}
            onDragOver={e => {
                e.preventDefault();
            }}
            onDrag={e => {
                e.preventDefault();
                console.log("just dragggg");
            }}
            // onDragLeave={() => {
            //     setHovering(false);
            //     console.log("leave");
            // }}
            onDrop={e => {
                e.preventDefault();
                for (const file of Array.from(e.dataTransfer.files)) {
                    parseFile(file);
                }
                setHovering(false);
            }}
        >
            {props.children}
            {isHovering && (
                <Blk.Overlay
                    onClick={() => {
                        setHovering(false);
                    }}
                >
                    <Blk.DropText>Drop it!</Blk.DropText>
                </Blk.Overlay>
            )}
        </div>
    );
}

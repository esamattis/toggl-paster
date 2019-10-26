import React from "react";

import { saveAs } from "file-saver";
import { format } from "date-fns";

import { Button } from "antd";
import { useStore } from "react-redux";

export function ExportButton(props: { className?: string }) {
    const store = useStore();

    return (
        <Button
            className={props.className}
            onClick={() => {
                const domain = window.location.hostname;
                const date = format(new Date(), "yyyyLLddHHmmss");

                const name = `toggl-paster-export-${domain}-${date}.json`;

                const data = new Blob([JSON.stringify(store.getState())], {
                    type: "application/json",
                });
                saveAs(data, name);
            }}
        >
            Export
        </Button>
    );
}

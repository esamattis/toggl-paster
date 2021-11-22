import { message } from "antd";
import React, { useEffect, useRef } from "react";
import { bemed } from "react-bemed";
import { css } from "react-bemed/css";
import { format } from "date-fns";

const IntraForm = bemed({
    as: "form",
    css: css`
        flex-direction: row;
        height: 25px;
    `,

    elements: {
        Input: bemed({
            as: "input",
            css: css`
                font-size: 8p;
            `,
        }),
        Label: bemed({
            as: "span",
            css: css`
                font-size: 8p;
            `,
        }),
    },
})("Intra");

export async function sendHours(opts: { date: Date; hours: string }) {
    const el = document.querySelector("#intra-auth-form");

    if (!(el instanceof HTMLFormElement)) {
        throw new Error("Bad element");
    }

    const form = new FormData(el);

    const username = form.get("username");
    const password = form.get("password");
    const url = form.get("url");

    if (!username || !password || !url) {
        message.error("Fill the credentials");
        return;
    }

    message.info("Sending to Intra...");

    const date = format(opts.date, "yyyy-MM-dd");

    const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa(username + ":" + password),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ date, amount: opts.hours }),
    });

    if (res.ok) {
        message.info(`Sent ${opts.hours} for ${date} to Intra`);
        return true;
    } else {
        message.error("Failed to sync with Intra. See console.");
    }

    return false;
}

export function IntraAuth() {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const url = localStorage.getItem("url");
        if (url) {
            ref.current.value = url;
        }
    }, []);

    return (
        <IntraForm id="intra-auth-form">
            Username:
            <IntraForm.Input type="text" name="username" />
            Password:
            <IntraForm.Input type="password" name="password" />
            endpoint:
            <IntraForm.Input
                ref={ref}
                type="text"
                name="url"
                onBlur={(e) => {
                    localStorage.setItem("url", e.target.value);
                }}
            />
        </IntraForm>
    );
}

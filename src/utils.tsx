import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { useAppSelector } from "./redux/store";
import { message } from "antd";

export function useRouteDate(): [number, number, number | undefined] {
    const location = useLocation();

    let path = location.pathname;

    if (path === "/") {
        return [new Date().getFullYear(), new Date().getMonth() + 1, undefined];
    }

    return location.pathname
        .split("/")
        .filter(Boolean)
        .map(n => parseInt(n, 10)) as any;
}

export function useCurrentDate() {
    const [year, month, day] = useRouteDate();

    return new Date(year, month - 1, day || new Date().getDate());
}

export function copyToClipboard(text: string) {
    var el = document.createElement("textarea");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.setAttribute("readonly", "");
    el.value = text;

    document.body.appendChild(el);
    el.select();
    var success = document.execCommand("copy");
    document.body.removeChild(el);
    message.info(`Copied "${text}" to clipboard`);
    return success;
}

/**
 * Format date for redux state key
 */
export function formatDate(date: Date) {
    return format(date, "yyyy-LL-dd");
}

/**
 * Format date for url
 */
export function formatDatePath(date: Date) {
    return format(date, "/yyyy/LL/dd");
}

export function formatMonthPath(date: Date) {
    return format(date, "/yyyy/LL");
}

export function useDay(date: Date) {
    return useAppSelector(state => {
        return state.days[formatDate(date)];
    });
}

export function useModifiedDay(date: Date) {
    return useAppSelector(state => {
        return state.modifiedDays[formatDate(date)];
    });
}

export async function readBrowserFile(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise(resolve => {
        reader.onload = (e: any) => {
            resolve(e.target.result as string);
        };
        reader.readAsText(file);
    });
}

import { useLocation } from "react-router-dom";
import moment from "moment";

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

    return moment({ year, month: month - 1, day: day || new Date().getDate() });
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
    return success;
}

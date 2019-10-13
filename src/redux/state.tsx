import { configureStore } from "@epeli/redux-stack";
import { message } from "antd";
import { useSelector } from "react-redux";

import {
    ImmerReducer,
    createReducerFunction,
    createActionCreators,
} from "immer-reducer";
import moment, { Moment } from "moment";
import { debounce } from "lodash-es";
import { formatDate } from "../utils";

export interface Entry {
    project: string;
    description: string;
    duration: number;
}

export interface Day {
    id: string;
    copied: boolean;
    projectCopied: {
        [project: string]: boolean | undefined;
    };
    entries: Entry[];
}

export interface State {
    days: {
        [day: string]: Day | undefined;
    };
}

const initialState: State = {
    days: {},
};

const STATE_KEY = "togglePasterState";

const saveState = debounce(state => {
    console.log("Saving!");
    window.localStorage[STATE_KEY] = JSON.stringify(state);
    message.success("State saved!");
}, 500);

export function createStore() {
    let savedState;

    try {
        savedState = JSON.parse(window.localStorage[STATE_KEY]);
    } catch (error) {
        // pass
    }

    const reducer = createReducerFunction(Reducer);

    const wrappedReducer = (state: any, action: any) => {
        const newState = reducer(state, action);
        if (action.type !== "@@INIT") {
            saveState(state);
        }
        return newState;
    };

    return configureStore({
        preloadedState: savedState || initialState,
        reducer: wrappedReducer,
    });
}

class Reducer extends ImmerReducer<State> {
    addDay(date: Date, id: string, entries: Entry[]) {
        const day = this.state.days[formatDate(date)];
        // if (day && day.id === id) {
        //     return;
        // }

        this.draftState.days[formatDate(date)] = {
            id: id,
            entries: entries,
            copied: false,
            projectCopied: {},
        };
    }

    setCopied(date: Date) {
        const day = this.draftState.days[formatDate(date)];
        if (day) {
            day.copied = true;
        }
    }
}

export function useAppSelector<T>(selector: (state: State) => T) {
    return useSelector(selector);
}

export const Actions = createActionCreators(Reducer);

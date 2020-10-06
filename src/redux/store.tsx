import { configureStore } from "@epeli/redux-stack";
import { message } from "antd";
import { useSelector } from "react-redux";

import {
    ImmerReducer,
    createReducerFunction,
    createActionCreators,
} from "immer-reducer";
import { debounce } from "lodash";
import { getDayKey } from "../utils";

export interface Entry {
    project: string;
    description: string;
    duration: number;
}

export interface Day {
    id: string;
    copied: boolean;
    projectsCopied: {
        [project: string]: boolean | undefined;
    };
    entries: Entry[];
}

export interface State {
    days: {
        [day: string]: Day | undefined;
    };
    modifiedDays: {
        [day: string]: Day | undefined;
    };
    lastCopiedDate?: string;
}

const initialState: State = {
    days: {},
    modifiedDays: {},
};

const STATE_KEY = "togglePasterState";

export function createStore() {
    let savedState;

    try {
        savedState = {
            ...initialState,
            ...JSON.parse(window.localStorage[STATE_KEY]),
        };
    } catch (error) {
        // pass
    }

    const reducer = createReducerFunction(Reducer);

    const saveState = debounce(() => {
        console.log("Saving!");
        const state = store.getState();
        window.localStorage[STATE_KEY] = JSON.stringify(state);
        console.log("Saved", state);
        message.success("State saved!");
    }, 500);

    const wrappedReducer = (state: any, action: any) => {
        const newState = reducer(state, action);
        if (action.type !== "@@INIT") {
            saveState();
        }
        return newState;
    };

    const store = configureStore({
        preloadedState: savedState || initialState,
        reducer: wrappedReducer,
    });

    return store;
}

export function isCopied(day: Day) {
    return day.copied || Object.keys(day.projectsCopied).length > 0;
}

class Reducer extends ImmerReducer<State> {
    addDay(date: Date, id: string, entries: Entry[]) {
        const key = getDayKey(date);
        const prevDay = this.state.days[key];

        const newDay = {
            id: id,
            entries: entries,
            copied: false,
            projectsCopied: {},
        };

        if (!prevDay) {
            this.draftState.days[key] = newDay;
            return;
        }

        const modifiedExistingDay = prevDay.id !== id;

        if (!modifiedExistingDay) {
            return;
        }

        if (isCopied(prevDay)) {
            this.draftState.modifiedDays[key] = newDay;
        } else {
            this.draftState.days[key] = newDay;
        }
    }

    acceptModifiedDay(date: Date) {
        const key = getDayKey(date);
        const modifiedDay = this.draftState.modifiedDays[key];
        if (modifiedDay) {
            this.draftState.days[key] = modifiedDay;
            delete this.draftState.modifiedDays[key];
        }
    }

    setCopied(date: Date) {
        const day = this.draftState.days[getDayKey(date)];
        if (day) {
            day.copied = true;
        }
        this.setLastCopiedDate(date);
    }

    setProjectCopied(date: Date, project: string) {
        const day = this.draftState.days[getDayKey(date)];
        if (!day) {
            return;
        }

        day.projectsCopied[project] = true;
        this.setLastCopiedDate(date);
    }

    setLastCopiedDate(date?: Date) {
        if (date) {
            this.draftState.lastCopiedDate = getDayKey(date);
        } else {
            delete this.draftState.lastCopiedDate;
        }
    }

    importState(state: State) {
        this.draftState = { ...initialState, ...state };
    }
}

export function useAppSelector<T>(selector: (state: State) => T) {
    return useSelector(selector);
}

export const Actions = createActionCreators(Reducer);

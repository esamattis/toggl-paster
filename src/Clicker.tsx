import React from "react";

const style = {
    padding: 10,
    border: "5px solid green",
};

const ClickerContext = React.createContext<any>(null);

function useClickerState() {
    const [count, setCount] = React.useState(2);
    const inc = () => {
        setCount(i => i + 1);
    };
    const double = () => {
        setCount(i => i * 2);
    };

    return {
        count,
        double,
        inc,
    };
}

export function CountProvider(props: any) {
    const tools = useClickerState();

    return (
        <ClickerContext.Provider value={tools}>
            {props.children}
        </ClickerContext.Provider>
    );
}

export function useCounter() {
    return React.useContext(ClickerContext);
}

export function Clicker() {
    const tools = useCounter();

    return (
        <div>
            <button onClick={tools.double}>click</button>

            <div style={style}>{tools.count}</div>
        </div>
    );
}

import * as React from 'react';

export const Counter: React.FC = () => {

    const [currentCount, setCurrentCount] = React.useState<number>(0);

    const increment = React.useCallback(
        () => setCurrentCount(prevState => prevState + 1),
        [setCurrentCount]
    );

    return (
        <div>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p aria-live="polite">Current count: <strong>{currentCount}</strong></p>

            <button className="btn btn-primary" onClick={increment}>Increment</button>
        </div>
    );
}

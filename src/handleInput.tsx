import { ChangeEventHandler } from 'react';

function handleInput(
    changeHandler: (value: string) => void
): ChangeEventHandler<HTMLInputElement> {
    return event => changeHandler(event.target.value);
}

export default handleInput;

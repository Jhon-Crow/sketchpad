import React, {memo, useCallback, useState} from 'react';
import cls from './ColorCell.module.scss'

const ColorCell = memo(({initialColor, onClick, onChangeHandler}) => {
    const [disabled, setDisabled] = useState(true);
    const enableOnClickHandler = useCallback((event) => {
        if (disabled){
            event.preventDefault();
            setDisabled(false);
            onClick(event);
            setTimeout(() => {
                setDisabled(true)
            }, 1000)
        } else {
            setDisabled(true);
        }
    },[onClick, disabled]);

    return (
            <input
                onClick={enableOnClickHandler}
                onChange={onChangeHandler}
                value={initialColor}
                className={cls.ColorCell}
                type={"color"} />
           );
});

export default ColorCell;
import React, {useState} from 'react';
import cls from './ColorCell.module.scss'

const ColorCell = ({initialColor, key}) => {
    const [color, setColor] = useState(initialColor);
    const [disabled, setDisabled] = useState(true)
    const onChangeHandler = (event) => {
        const newColor = event.target.value;
        setColor(newColor);
    };

    const enableOnClickHandler = (event) => {
        if (disabled){
            event.preventDefault();
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };

    return (
            <input key={key} onClick={enableOnClickHandler} onChange={onChangeHandler} value={color} className={cls.ColorCell} type={"color"} />
           );
};

export default ColorCell;
import React, {useState} from 'react';
import cls from './SizeInput.module.scss'

const SizeInput = ({value, onChange, color}) => {

    const [isOpen, setIsOpen] = useState(false);

    const onChangeHandler = (e) => {
        onChange?.(e.target.value);
    };

    const onClickHandler = () => {
        isOpen ? setIsOpen(false) : setIsOpen(true)
    }

    return (
        <div className={cls.wrapper}>
            <button
                className={cls.button}
                onClick={onClickHandler}
                style={{color: color}}
            >{value}</button>
            {isOpen && <input
                min='1'
                className={cls.input}
                onMouseUp={() => setIsOpen(false)}
                onChange={onChangeHandler}
                value={value}
                type={"range"}/>}
        </div>
    );
};

export default SizeInput;
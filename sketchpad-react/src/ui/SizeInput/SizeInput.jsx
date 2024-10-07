import React, {useState} from 'react';
import cls from './SizeInput.module.scss'

const SizeInput = (
    // {value, onChange, initialState, color}
) => {

    const [value, setValue] = useState(10);
    const [isOpen, setIsOpen] = useState(false);

    // const onChangeHandler = (e) => {
    //     onChange?.(e.target.value);
    // };


    const onClickHandler = () => {
        isOpen ? setIsOpen(false) : setIsOpen(true)
    }



    return (
        <div className={cls.wrapper}>
            <button
                className={cls.button}
                onClick={onClickHandler}
                style={{color: '#3152be'}}
            >{value}</button>
            {isOpen && <input
                className={cls.input}
                onMouseUp={() => setIsOpen(false)}
                onChange={(e) => setValue(e.target.value)}
                value={value}
                type={"range"}/>}
        </div>
    );
};

export default SizeInput;
import React, {useMemo} from 'react';
import cls from './Select.module.scss';


export const Select = (props) => {
    const { className, lable, options, value, onChange, readonly } = props;

    const onChangeHandler = (e) => {
        onChange?.(e.target.value);
    };

    const optionsList = useMemo(
        () =>
            options?.map((opt) => (
                <option
                    className={cls.option}
                    value={opt.value}
                    key={opt.value}
                >
                    {opt.content}
                </option>
            )),
        [options],
    );

    return (
        <div className={classNames(cls.Wrapper, mods, [className])}>
            {lable && <span className={cls.label}>{`${lable}>`}</span>}
            <select
                disabled={readonly}
                className={cls.select}
                value={value}
                onChange={onChangeHandler}
            >
                {optionsList}
            </select>
        </div>
    );
};
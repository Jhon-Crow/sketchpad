import React, {useMemo} from 'react';
import cls from './Select.module.scss';
import AngleDown from '../../../assets/Icon/angle-down.svg?react';

export const Select = (props) => {
    const { className, lable, options, value, onChange, readonly, fontColor } = props;

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
                    style={{color: fontColor}}
                >
                    {opt.content}
                </option>
            )),
        [options],
    );

    return (
        <div className={cls.Wrapper}>
            {lable && <span className={cls.label}>{`${lable}>`}</span>}
            <select
                disabled={readonly}
                className={cls.select}
                value={value}
                onChange={onChangeHandler}
                style={{
                    color: fontColor,
                    // fill: fontColor,
                    // backgroundImage: AngleDown

            }}

            >
                {/*<AngleDown fill={fontColor} width={14} height={10}/>*/}
                {optionsList}
            </select>
            <AngleDown className={cls.icon} fill={fontColor} />
        </div>
    );
};
import React from 'react';
import cls from './themeSwitcher.module.scss'
import Sun from '../../assets/Icon/sun.svg?react'
import Moon from '../../assets/Icon/white/moon.svg?react'


const ThemeSwitcher = ({isLight, themeChecker}) => {
    return (
        <button onClick={themeChecker} className={cls.themeSwitcher}>
            {isLight ? <Moon /> : <Sun />}
        </button>
    );
};

export default ThemeSwitcher;
import React, {useEffect} from 'react';
import cls from './themeSwitcher.module.scss'
import Sun from '../../assets/Icon/sun.svg?react'
import Moon from '../../assets/Icon/white/moon.svg?react'
import {getFromLocalStorage} from "../../helpers/getFromLocalStorage.js";
import {THEME_LOCALSTORAGE_KEY} from "../../app/const/localStorage.js";
import {Theme} from "../../app/const/theme.js";


const ThemeSwitcher = ({isDark, setIsDark}) => {

    useEffect(() => {
        const storedIsLight = getFromLocalStorage(THEME_LOCALSTORAGE_KEY);
        if (typeof storedIsLight === "boolean"){
            setIsDark(storedIsLight);
            document.body.className = storedIsLight ? Theme.light : Theme.dark;
        } else {
            setIsDark(true);
            document.body.className = Theme.light;
        }
    },[])

    const themeToggle = () => {
        if (isDark === true){
            document.body.className = document.body.className.replace('light', 'dark')
            setIsDark(false)
        } else if(isDark === false){
            document.body.className = document.body.className.replace('dark', 'light')
            setIsDark(true)
        }
    }

    return (
        <button onKeyDown={(e) => e.preventDefault()}
                onClick={themeToggle}
                className={cls.themeSwitcher}>
            {isDark ? <Moon /> : <Sun />}
        </button>
    );
};

export default ThemeSwitcher;
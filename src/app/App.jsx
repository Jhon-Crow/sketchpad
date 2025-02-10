import './styles/index.scss'
import cls from './App.module.scss'
import ThemeSwitcher from "../features/ThemeSwitcher/ui/ThemeSwitcher.jsx";
import {useEffect, useState} from "react";
import Canvas from "../features/Canvas/ui/Canvas.jsx";
import CapsLockIdentifier from "../entities/CapsLockIdentifier/ui/CapsLockIdentifier.jsx";
import {Select} from "../shared/Select/ui/Select.jsx";
import Palette from "../widgets/Palette/ui/Palette.jsx";
import {saveToLocalStorage} from "../helpers/saveToLocalStorage.js";
import {THEME_LOCALSTORAGE_KEY} from "./const/localStorage.js";

function App() {
    const [isDark, setIsDark] = useState();
    const [capsLockPressed, setCapsLockPressed] = useState();
    const [fontColor, setFontColor] = useState();
    const [fontFamily, setFontFamily] = useState(2);
    const [penColor, setPenColor] = useState();
    const [fontSize, ] = useState(16);
    const [penSize, ] = useState(1);

    const fontsDefault = [
        {value: 0, content: 'Arial'},
        {value: 1, content: 'Times New Roman'},
        {value: 2, content: 'Courier'},
        {value: 3, content: 'Helvetica'},
        {value: 4, content: 'Verdana'},
        {value: 5, content: 'Tahoma'},
        {value: 6, content: 'Georgia'},
        {value: 7, content: 'Impact'},
        {value: 8, content: 'Comic Sans MS'},
        {value: 9, content: 'Lucida Console'},
        {value: 10, content: 'Monaco'},
        {value: 11, content: 'Courier New'},
        {value: 12, content: 'Calibri'},
        {value: 13, content: 'Segoe UI'},
        {value: 14, content: 'Tahoma'},
        {value: 15, content: 'Microsoft Sans Serif'},
    ];

     useEffect(() => saveToLocalStorage(isDark, THEME_LOCALSTORAGE_KEY), [isDark])

  return (
    <div className={cls.App}>
        {/*TODO удалить при релизе*/}
        {/*<Select*/}
        {/*    value={fontFamily}*/}
        {/*    onChange={setFontFamily}*/}
        {/*    options={fontsDefault} fontColor={fontColor}/>*/}
        <Palette
            setPenColor={setPenColor}
            setFontColor={setFontColor}
        />
        <CapsLockIdentifier capsLockPressed={capsLockPressed}/>
        <ThemeSwitcher
            setIsDark={setIsDark}
            isDark={isDark}/>
        <Canvas
            setCapsLockPressed={setCapsLockPressed}
            isLight={isDark}
            fontColor={fontColor}
            lineColor={penColor}
            lineSize={penSize}
            fontFamily={fontsDefault[fontFamily].content}
            fontSize={fontSize}/>
    </div>
  )
}

export default App

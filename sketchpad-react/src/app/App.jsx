import './styles/index.scss'
import cls from './App.module.scss'
import ThemeSwitcher from "../ui/themeSwitcher/themeSwitcher.jsx";
import {useEffect, useState} from "react";
import Canvas from "../ui/Canvas/Canvas.jsx";
import CapsLockIdentifier from "../ui/CapsLockIdentifier/CapsLockIdentifier.jsx";
import {Select} from "../ui/examples/Select/Select.jsx";
import Palette from "../ui/Palette/Palette.jsx";
import {saveToLocalStorage} from "../helpers/saveToLocalStorage.js";
import {THEME_LOCALSTORAGE_KEY} from "./const/localStorage.js";
import SizeInput from "../ui/SizeInput/SizeInput.jsx";

function App() {
    const [isDark, setIsDark] = useState();
    const [capsLockPressed, setCapsLockPressed] = useState();
    const [fontColor, setFontColor] = useState();
    const [fontFamily, setFontFamily] = useState(2);
    const [penColor, setPenColor] = useState();
    const [fontSize, setFontSize] = useState(16);
    //TODO сохранять + получать сайзы LS
    const [penSize, setPenSize] = useState(1);

    const fontsExample = [
        {value: 1, content: 'AREAL'},
        {value: 2, content: 'ROBOT'},
        {value: 3, content: 'COMIC SANS'},
    ];
    //TODO это пример, нужно подгрузить реальные шрифты

     useEffect(() => saveToLocalStorage(isDark, THEME_LOCALSTORAGE_KEY), [isDark])


  return (
    <div className={cls.App}>
        <Select
            value={fontFamily}
            onChange={setFontFamily}
            options={fontsExample} fontColor={fontColor}/>
        <Palette
            setPenColor={setPenColor}
            setFontColor={setFontColor}
        />
        <div className={cls.sizeInputWrapper}>
            <SizeInput value={fontSize} onChange={setFontSize} color={fontColor}/>
            <SizeInput value={penSize} onChange={setPenSize} color={penColor}/>
        </div>
        <CapsLockIdentifier capsLockPressed={capsLockPressed}/>
        <ThemeSwitcher
            setIsDark={setIsDark}
            isDark={isDark}/>
        <Canvas getCapsLockPressed={setCapsLockPressed} isLight={isDark} fontColor={fontColor} lineColor={penColor} lineSize={penSize} fontFamily={'Arial'} fontSize={fontSize}/>
    </div>
  )
}

export default App

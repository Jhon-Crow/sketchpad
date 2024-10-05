import './styles/index.scss'
import cls from './App.module.scss'
import ThemeSwitcher from "../ui/themeSwitcher/themeSwitcher.jsx";
import {useState} from "react";
import Canvas from "../ui/Canvas/Canvas.jsx";
import CapsLockIdentifier from "../ui/CapsLockIdentifier/CapsLockIdentifier.jsx";
import {Select} from "../ui/examples/Select/Select.jsx";
import Palette from "../ui/Palette/Palette.jsx";

function App() {
    //TODO доставать initialValue из localStorage
    const [isLight, setIsLight] = useState(true)

    const fontsExample = [
        {value: 1, content: 'AREAL'},
        {value: 2, content: 'ROBOT'},
        {value: 3, content: 'COMIC SANS'},
    ];


    const themeChecker = () => {
        if (isLight){
            document.body.className = document.body.className.replace('light', 'dark')
            setIsLight(false)
        } else {
            document.body.className = document.body.className.replace('dark', 'light')
            setIsLight(true)
        }
    }
    //TODO передать onChange с отправкой value в локалСторэж и App

  return (
    <div className={cls.App}>
        <Select
            options={fontsExample} fontColor={'#be3178'}/>
        <Palette/>
        <CapsLockIdentifier/>
        <ThemeSwitcher themeChecker={themeChecker} isLight={isLight}/>
        <Canvas isLight={isLight} fontColor={'#be3178'} lineColor={'#3abe31'} fontFamily={'Arial'} fontSize={14}/>
    </div>
  )
}

export default App

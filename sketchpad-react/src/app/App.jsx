import './styles/index.scss'
import cls from './App.module.scss'
import ThemeSwitcher from "../ui/themeSwitcher/themeSwitcher.jsx";
import {useState} from "react";
import Canvas from "../ui/Canvas/Canvas.jsx";
import CapsLockIdentifier from "../ui/CapsLockIdentifier/CapsLockIdentifier.jsx";

function App() {

    const [isLight, setIsLight] = useState(true)

    const themeChecker = () => {
        if (isLight){
            document.body.className = document.body.className.replace('light', 'dark')
            setIsLight(false)
        } else {
            document.body.className = document.body.className.replace('dark', 'light')
            setIsLight(true)
        }
    }

  return (
    <div className={cls.App}>
        <CapsLockIdentifier/>
        <ThemeSwitcher themeChecker={themeChecker} isLight={isLight}/>
        <Canvas isLight={isLight} fontColor={'#be3178'} lineColor={'#3abe31'} fontFamily={'Arial'} fontSize={14}/>
    </div>
  )
}

export default App

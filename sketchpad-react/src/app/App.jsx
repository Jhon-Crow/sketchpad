import './styles/index.scss'
import cls from './App.module.scss'
import ThemeSwitcher from "../ui/themeSwitcher/themeSwitcher.jsx";
import {useState} from "react";
import Canvas from "../ui/Canvas/Canvas.jsx";

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
        <ThemeSwitcher themeChecker={themeChecker} isLight={isLight}/>
        <Canvas isLight={isLight} fontColor={'#31be98'} lineColor={'#ffffff'} fontFamily={'Arial'} fontSize={14}/>
    </div>
  )
}

export default App

import './styles/index.scss'
import SaveButton from "../ui/SaveButton/SaveButton.jsx";
import cls from './App.module.scss'
import ThemeSwitcher from "../ui/themeSwitcher/themeSwitcher.jsx";
import {useState} from "react";

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
      <SaveButton isLight={isLight}/>
        <ThemeSwitcher themeChecker={themeChecker} isLight={isLight}/>
    </div>
  )
}

export default App

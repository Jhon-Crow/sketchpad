import React from 'react';
import cls from './SaveButton.module.scss'
import SaveIcon from '../assets/Icon/save-icon.svg?react'
import WhiteSaveIcon from '../assets/Icon/white/white-save-icon.svg?react'
const SaveButton = (props) => {
    const {light} = props;
    const save = () => {
        // получали из гетЭлементБай айди
        console.log('написать сохранение')
        // const canvasData = canvas.toDataURL('image/png');
        // const link = document.createElement('a');
        // link.href = canvasData;
        // link.download = 'canvas_note_image.png';
        // link.click();
    }

    return (
        <button className={cls.SaveButton} onClick={save}>
            {light ? <SaveIcon/> : <WhiteSaveIcon/>} <p className={cls.textContent}>SAVE AS PNG</p>
        </button>
    );
};

export default SaveButton;
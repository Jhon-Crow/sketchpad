import React from 'react';
import cls from './SaveButton.module.scss'
import SaveIcon from '../../assets/Icon/save-icon.svg?react'
import WhiteSaveIcon from '../../assets/Icon/white/white-save-icon.svg?react'

const SaveButton = ({isLight, onClick}) => {

    return (
        <button className={cls.SaveButton} onClick={onClick}>
            {isLight ? <WhiteSaveIcon/> : <SaveIcon/>} <p className={cls.textContent}>SAVE AS PNG</p>
        </button>
    );
};

export default SaveButton;
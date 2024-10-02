import React, {useEffect, useState} from 'react';
import cls from './Palette.module.scss'
import FontCase from '../../assets/Icon/font-case.svg?react'
import PenNib from '../../assets/Icon/pen-nib.svg?react'
import ColorCell from "../ColorCell/ColorCell.jsx";

const Palette = () => {
    //TODO сделать гет фр Локал единажды
    // если там ничего то получить дефолтные цвета и записать
    // при изменении цвета обновлять paletteColors
    // при выходе выгружать в ЛС если есть отличия
    const [paletteColors, setPaletteColors] = useState();
    const [selectedFont, setSelectedFont] = useState();
    const [selectedPen, setSelectedPen] = useState();

    useEffect(() => {
        const appElement = document.querySelector('.App');
        const colorValue = getComputedStyle(appElement).getPropertyValue('--default-red');
        // setColor(colorValue);
        console.log(colorValue)
    }, []);


    return (
        <div className={cls.Palette}>
            <FontCase fill={selectedFont} width={41} height={41}/><PenNib fill={selectedPen} width={35} height={35}/>
            <ColorCell/>
            <ColorCell/>
            <ColorCell/>
            <ColorCell/>
            <ColorCell/>
            <ColorCell/>
            <ColorCell/>
            <ColorCell/>
        </div>
    );
};

export default Palette;
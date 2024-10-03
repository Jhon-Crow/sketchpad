import React, {useEffect, useState} from 'react';
import cls from './Palette.module.scss'
import FontCase from '../../assets/Icon/font-case.svg?react'
import PenNib from '../../assets/Icon/pen-nib.svg?react'
import ColorCell from "../ColorCell/ColorCell.jsx";
import {getFromLocalStorage} from "../../helpers/getFromLocalStorage.js";
import {LOCALSTORAGE_SKETCHPAD_COLORS, SKETCHPAD_SELECTED_COLORS} from "../../app/const/localStorage.js";
import {saveToLocalStorage} from "../../helpers/saveToLocalStorage.js";

const namesColorsFromScss = ['--default-red', '--default-blue', '--default-black', '--default-green'];

const Palette = () => {
    //TODO
    // при изменении цвета обновлять paletteColors

    const [paletteColors, setPaletteColors] = useState([]);
    const [selectedColors, setSelectedColors] = useState([2,3]);
    const selectedFont = paletteColors[selectedColors[0]];
    const selectedPen = paletteColors[selectedColors[1]];
    const [localStorageState, setLocalStorageState] = useState({});

    console.log(selectedPen)
    useEffect(() => {
    let writeColors;
        if (!getFromLocalStorage(LOCALSTORAGE_SKETCHPAD_COLORS)) {
            let colorsFromScss = [];
            const appElement = document.querySelector('.App');
            colorsFromScss = namesColorsFromScss.map((name) => getComputedStyle(appElement).getPropertyValue(name));
            colorsFromScss = [...colorsFromScss, ...colorsFromScss];
            saveToLocalStorage(colorsFromScss, LOCALSTORAGE_SKETCHPAD_COLORS);
            writeColors = colorsFromScss;
        } else {
            writeColors = getFromLocalStorage(LOCALSTORAGE_SKETCHPAD_COLORS);
        };
        setPaletteColors(writeColors);
        if (!getFromLocalStorage(SKETCHPAD_SELECTED_COLORS)){
            saveToLocalStorage(selectedColors, SKETCHPAD_SELECTED_COLORS)
        } else {
            const selectedToWrite = getFromLocalStorage(SKETCHPAD_SELECTED_COLORS);
            setSelectedColors(selectedToWrite);
        };
    },[]);
    useEffect(() => {
        const writeObj = {};
        if (selectedColors !== localStorageState.selectedColors){
            writeObj.selectedColors = selectedColors;
        }
        if (paletteColors !== localStorageState.paletteColors){
            writeObj.paletteColors = paletteColors;
        }
        setLocalStorageState({...writeObj})
    }, [selectedColors, paletteColors]);

    useEffect(() => {
        if (paletteColors.length === 8) saveToLocalStorage(paletteColors, LOCALSTORAGE_SKETCHPAD_COLORS);
        if (selectedColors.length === 2) saveToLocalStorage(selectedColors, SKETCHPAD_SELECTED_COLORS);
    },[localStorageState]);

    const onChangeHandler = (event) => {
        const newColor = event.target.value;
        const clicked = event.target.parentNode.id;
        setPaletteColors((prevPaletteColors) => {
            const newPaletteColors = [...prevPaletteColors];
            newPaletteColors[clicked] = newColor;
            return newPaletteColors;
        })
    };

    const onClickSelectHandler = (event) => {
        const clicked = event.target.parentNode.id;
        const column = clicked % 2;
        setSelectedColors((prevSelectedColors) => {
            const newSelectedColors = [...prevSelectedColors];
            newSelectedColors[column] = clicked - 0;
            return newSelectedColors;
        });
    };

    return (
        <div className={cls.Palette}>
            <FontCase fill={selectedFont} width={41} height={41}/>
            <PenNib fill={selectedPen} width={35} height={35}/>
            {
                paletteColors.map((color, index) => <div id={index} className={selectedColors.includes(index) ? cls.selected : null}><ColorCell onChangeHandler={onChangeHandler} onDoubleClick={onClickSelectHandler} key={index} initialColor={color}/></div>)
            }
        </div>
    );
};

export default Palette;
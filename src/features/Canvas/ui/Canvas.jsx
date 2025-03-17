import React, {useEffect, useRef, useState} from 'react';
import cls from './Canvas.module.scss'
import SaveButton from "../../SaveButton/ui/SaveButton.jsx";
import {checkLinesLimit, updateTextOnCanvas} from "../functions/updateTextOnCanvas.js";
import {doSeveralTimes} from "../../../helpers/doSeveralTimes.js";

const keysDontPrint = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F12', 'F5', 'CapsLock', 'Meta'];
const delDirections = {back: 'backspace', forward: 'delete'};

const coordsDisabled = [];
let textHistoryIndex = 0;
const textHistory = [{'text': [[{character: 0, color: 'black', fontFamily: 'Courier', fontSize: 16, line: 0, text: ''}]], 'caretPosition': {line: 0, character: 0} }];
// todo BEFORE PULL -> RELEASE branch
//  отрефакторить код!

// todo FIX полностью переделать текстовую истроию


// let textX = 10;
// let textY = 20;
// let caretX = textX;
// let caretY = textY;
// let caretPosition = { line: 0, character: 0 };



// let textWrapLimit;
// присвивалась но не использовалась

const Canvas = ({
                    fontColor,
                    lineColor,
                    lineSize,
                    fontFamily,
                    fontSize,
                    isLight,
                    setCapsLockPressed}) => {
    const coords = useRef([]);

    const textX = useRef(10);
    const textY = useRef(20);
    const caretX = useRef(textX.current);
    const caretY = useRef(textY.current);
    const caretPosition = useRef({
        line: 0,
        character: 0
    });

    const [canvasDimensions, setCanvasDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    let [textArr, setTextArr] = useState([]);
    // let textArr = [];
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    let canvasData;
    let link;
    let isDrawing = false;

    const coordsDisabledLimit = 10000;

    let linesLimit = window.innerHeight / (fontSize * 1.5);
    const lineLengthLimit = Math.floor(window.innerWidth / (fontSize - 2));

    // const drawBg = (ctx) => {
    //     ctx.fillStyle = isLight ? '#F2F0E7FF' : '#2A2A2B';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }



    useEffect(() => {
        // canvas = canvasRef.current;
        ctxRef.current = canvasRef.current.getContext('2d');
        canvasRef.current.width = canvasDimensions.width / 1.32;
        canvasRef.current.height = canvasDimensions.height / 1.05;
        // textWrapLimit = canvasRef.current.width / 6.5;
        updateTextOnCanvas(
            textArr,
            ctxRef.current,
            canvasRef.current,
            isLight,
            fontSize,
            fontFamily,
            textY.current,
            textX.current,
            isDrawing,
            redraw,
            calculateCaretPosition,
            caretX.current,
            caretY.current,
            fontColor);
        canvasRef.current.focus();
    }, [isLight, canvasDimensions])



    useEffect(() => {
        const handleResize = () => {
            setCanvasDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        textX.current = 10;
        textY.current = fontSize * 1.5;
        caretX.current = textX.current;
        caretY.current = textY.current;
        // textWrapLimit = canvasRef.current.width / (fontSize * 1.5);
        linesLimit = window.innerHeight / (fontSize * 1.5);
        updateTextOnCanvas(
            textArr,
            ctxRef.current,
            canvasRef.current,
            isLight,
            fontSize,
            fontFamily,
            textY.current,
            textX.current,
            // colorAndIndex,
            isDrawing,
            redraw,
            calculateCaretPosition,
            caretX.current,
            caretY.current,
            fontColor);
    }, [fontSize]);

    useEffect(() => {
        console.log(textArr)
        updateTextOnCanvas(
            textArr,
            ctxRef.current,
            canvasRef.current,
            isLight,
            fontSize,
            fontFamily,
            textY.current,
            textX.current,
            // colorAndIndex,
            isDrawing,
            redraw,
            calculateCaretPosition,
            caretX.current,
            caretY.current,
            fontColor);
        console.log(textHistory)
        // console.log(textHistory[textHistoryIndex].text[caretPosition.current.line].map(i => i.text).join(''))
    }, [textArr, fontColor])

    function redraw() {
        ctxRef.current.beginPath();
        coords.current.forEach(function(coord) {
            if (coord === 'brake') {
                ctxRef.current.stroke();
                ctxRef.current.beginPath();
            } else if (coord.includes('#')) {
                console.log(coord)
                ctxRef.current.strokeStyle = coord;
            } else {
                ctxRef.current.lineWidth = coord[2];
                ctxRef.current.lineTo(coord[0], coord[1]);
            }
        });
        ctxRef.current.stroke();
    }

    function startDrawing(e) {
        coords.current.push(lineColor);
        coords.current.push('brake');
        coordsDisabled.length = 0;
        coords.current.push([e.offsetX, e.offsetY, Number(lineSize)]);
        isDrawing = true;
        ctxRef.current.beginPath();
        ctxRef.current.lineWidth = lineSize;
        ctxRef.current.moveTo(e.offsetX, e.offsetY);
    }

    function draw(e) {
        if (!isDrawing) return;
        ctxRef.current.strokeStyle = lineColor;
        ctxRef.current.lineWidth = lineSize;
        ctxRef.current.lineTo(e.offsetX, e.offsetY);
        ctxRef.current.stroke();
        coords.current.push([e.offsetX, e.offsetY, Number(lineSize)]);
    }

    function endDrawing() {
        if (isDrawing) {
            coords.current.push('brake');
            ctxRef.current.closePath();
            isDrawing = false;
        }
    }

    function loadFromHistory(textHistoryIndex){
        // console.log(textArr, textHistory[textHistoryIndex])
        caretPosition.current = textHistory[textHistoryIndex].caretPosition;
        setTextArr(structuredClone(textHistory[textHistoryIndex].text));
        // textArr = textHistory[textHistoryIndex].text;
        console.log(textHistoryIndex)
    }


    function saveToHistory(){
        // todo UPDATE добавить проверку на беспольезное сохранение (когда 2 раза подряд сохраняю пустой текст)
        let textArrToPush = structuredClone(textArr);
        textHistory.push({
            text: textArrToPush,
            caretPosition: {
                line: caretPosition.current.line,
                character: caretPosition.current.character
            }
        });
        // console.log(textArrToPush)
        textHistoryIndex++;
        console.log(textHistoryIndex)
    }

    function onKeyDownSwitch(e) {
        setCapsLockPressed(e.getModifierState('CapsLock'));
        if (e.ctrlKey) {
            withCtrlSwitchCase(e.keyCode, e);
        } else {
            ctrllessSwitchCase(e.key, e)
        }
        calculateCaretPosition()

        updateTextOnCanvas(
            textArr,
            ctxRef.current,
            canvasRef.current,
            isLight,
            fontSize,
            fontFamily,
            textY.current,
            textX.current,
            isDrawing,
            redraw,
            calculateCaretPosition,
            caretX.current,
            caretY.current,
            fontColor);
    }

    function withCtrlSwitchCase(eKeyCode, e){
        // todo UPDATE добавить ctrl+S для сохранения png
        // console.log(eKeyCode)
        const keyCodes = {
            37: () => ctrlArrowJumpAction('left'),
            39: () => ctrlArrowJumpAction('right'),
            86: () => ctrlVAction(e),
            90: () => ctrlZAction(e),
            89: () => ctrlYAction(e),
            8: () => ctrlDeleteAction(delDirections.back),
            46: () => ctrlDeleteAction(delDirections.forward)
        }
        return keyCodes[eKeyCode] ? keyCodes[eKeyCode]() : null;
    }

    function ctrlVAction(e){
        // todo fixed при привышении лимита всё равно происходит вставка
        if (textArr.length > linesLimit - 1){
            e.stopPropagation();
            e.preventDefault();
            alert('no space on page!\n' +
                'input blocked')
            return false;
        } else {
            console.log(textArr.length, linesLimit - 1)
            e.stopPropagation();
            e.preventDefault();
            pastText(saveToHistory);
        }
    }

    function ctrlZAction(e) {
        // todo UPDATE добавить восстановление позиции каретки
        if ((coords.current.length && coordsDisabled.length < coordsDisabledLimit) && e.getModifierState('CapsLock')){
            coordsDisabled.push(structuredClone(coords.current?.pop()));
        } else if (textHistoryIndex > 0 && !e.getModifierState('CapsLock')) {
            textHistoryIndex--;
            loadFromHistory(textHistoryIndex);
            // console.log(textArr, typeof textArr)
        }
    }

    function ctrlYAction(e) {
        if (coordsDisabled.length && e.getModifierState('CapsLock')){
            coords.current?.push(structuredClone(coordsDisabled?.pop()));
        } else if (textHistoryIndex < textHistory.length - 1 && !e.getModifierState('CapsLock')) {
            textHistoryIndex++;
            loadFromHistory(textHistoryIndex);
        }
    }


    function ctrllessSwitchCase(eKey, e) {
        const keys = {
            Enter: () => checkLinesLimit(enterKeyAction,textArr, saveToHistory, linesLimit),
            Tab: () => {
                e.preventDefault();
                checkLinesLimit(onTabAction,textArr, saveToHistory, linesLimit);
            },
            ArrowLeft: () => caretMoveLeft(),
            ArrowRight: () => caretMoveRight(),
            ArrowUp: () => caretMoveUp(),
            ArrowDown: () => caretMoveDown(),
            Backspace: () => {
                deleteCharacter(delDirections.back);
            },
            Delete: () => {
                deleteCharacter(delDirections.forward);
            }
        }
        return keys[eKey] ? keys[eKey]() : defaultKeyPressCase(eKey)
    }

    function defaultKeyPressCase(eKey){
        if (!keysDontPrint.includes(eKey) && checkLinesLimit(null,textArr, saveToHistory, linesLimit)) {
            addLetter(eKey);
            saveToHistory();
        }
    }

    function caretMoveLeft() {
        if (caretPosition.current.character > 0) {
            caretPosition.current.character--;
        } else if (caretPosition.current.line > 0) {
            caretPosition.current.line--;
            caretPosition.current.character = textArr[caretPosition.current.line].length;
        }
    }

    function caretMoveRight() {
        if (caretPosition.current.character < textArr[caretPosition.current.line].length) {
            caretPosition.current.character++;
        } else if (caretPosition.current.line < textArr[caretPosition.current.line].length - 1 && textArr[caretPosition.current.line+1]) {
            caretPosition.current.line++;
            caretPosition.current.character = 0;
        }
    }

    function caretMoveUp() {
        if (caretPosition.current.line > 0) {
            caretPosition.current.line--;
            caretPosition.current.character = Math.min(caretPosition.current.character, textArr[caretPosition.current.line].length);
        }
    }

    function caretMoveDown() {
        if (caretPosition.current.line < textArr.length - 1) {
            caretPosition.current.line++;
            caretPosition.current.character = Math.min(caretPosition.current.character, textArr[caretPosition.current.line].length);
        }
    }

    function addLetter(letter){
        // console.log(typeof textArr)
        function simpleAddLetter(){
            const currentLine = textArr[caretPosition.current.line];
            const beforeCaret = currentLine.slice(0, caretPosition.current.character);
            const afterCaret = currentLine.slice(caretPosition.current.character);
            textArr[caretPosition.current.line] = [...beforeCaret, itemToArr, ...afterCaret];
        }
        let itemToArr = {
            text: letter,
            color: fontColor,
            fontFamily,
            fontSize,
            line: caretPosition.current.line,
            character: caretPosition.current.character
        };
        if (!textArr.length){
            textArr.push([itemToArr]);
        } else {
            if (textArr[caretPosition.current.line].length >= lineLengthLimit) {
                enterKeyAction();
            }
            simpleAddLetter();
        }
        caretPosition.current.character++;
        calculateCaretPosition()
    }

    function onTabAction(){
        doSeveralTimes(() => addLetter(' '), 4);
    }

    function deleteCharacter(direction) {
        let currentLine = textArr[caretPosition.current.line];
        if (direction === delDirections.back) {
            if (caretPosition.current.character > 0) {
                currentLine.splice(caretPosition.current.character - 1, 1);
                caretPosition.current.character--;
            } else if (caretPosition.current.line > 0) {
                let previousLine = textArr[caretPosition.current.line - 1];
                textArr[caretPosition.current.line - 1] = [...previousLine, ...currentLine];
                textArr.splice(caretPosition.current.line, 1);
                caretPosition.current.line--;
                caretPosition.current.character = previousLine.length;
            }
        } else if (direction === delDirections.forward) {
            // Удаление символа под кареткой
            if (caretPosition.current.character < currentLine.length) {
                // Удаляем символ под курсором
                if (caretPosition.current.character === -1) caretPosition.current.character = 0;
                console.log(caretPosition.current.character)
                currentLine.splice(caretPosition.current.character, 1);
            } else if (caretPosition.current.line < textArr.length - 1) {
                // Объединяем текущую строку с следующей
                let nextLine = textArr[caretPosition.current.line + 1];
                currentLine.push(...nextLine); // Объединяем строки
                textArr.splice(caretPosition.current.line + 1, 1); // Удаляем следующую строку
            }
        }
        saveToHistory();
    }

    function ctrlDeleteAction(direction){
        // todo fixed ловить баги!!! при удалении в лево до края удаляется символ с правого края (проблема как и везде в позиции каретки = -1)
        if (direction === delDirections.back){
            const endIndex = caretPosition.current.character;
            ctrlArrowJumpAction('left');
            const startIndex = caretPosition.current.character !== -1 ? caretPosition.current.character : 0;
            textArr[caretPosition.current.line].splice(startIndex, endIndex - startIndex);
            saveToHistory();
        }
        if (direction === delDirections.forward){
            if (caretPosition.current.character === -1) caretPosition.current.character = 0;
            const startIndex = caretPosition.current.character;
            ctrlArrowJumpAction('right');
            const endIndex = caretPosition.current.character;
            textArr[caretPosition.current.line].splice(startIndex, endIndex - startIndex)
            caretPosition.current.character = startIndex;
            saveToHistory();
        }
    }

    function calculateCaretPosition() {
        let currentLine = textArr[caretPosition.current.line]?.map(i => i.text).join('') || '';

        //todo UPDATE проитерироваться по строке и считать размер с учётом фонтФэмли
        // возможно сравнивать позицию каретки с размером холста
        //
        let caretMeasurement = ctxRef.current.measureText(currentLine.substring(0, caretPosition.current.character));
        caretX.current = textX.current + caretMeasurement.width;

        caretY.current = textY.current + (fontSize + 5) * caretPosition.current.line;
    }

    // function calculateCaretPosition(fontOfLetter) {
    //     let currentLine = textArr[caretPosition.line]?.map(i => i.text).join('') || '';
    //     caretX = textX; // Начальная позиция по X
    //
    //     // Проходим по каждому символу до позиции курсора
    //     for (let i = 0; i < caretPosition.character; i++) {
    //         // Устанавливаем текущий шрифт для символа
    //         ctxRef.current.font = fontOfLetter; // Предполагается, что у вас есть функция, возвращающая шрифт для символа
    //         caretX += ctxRef.current.measureText(currentLine[i]).width; // Добавляем ширину символа к позиции курсора
    //     }
    //
    //     caretY = textY + (fontSize + 5) * caretPosition.line; // Позиция по Y остается прежней
    // }

    function pastText(callback){
        if (textArr.length > linesLimit - 1) return false;
        getPasteText().then(str => {
            str = str.trimStart();
            for (let i = 0; i < str.length; i++){
                if (textArr.length > linesLimit - 1) return false;

                if (str[i] === '\n'){
                    checkLinesLimit(enterKeyAction,textArr, saveToHistory, linesLimit);
                } else {
                    addLetter(str[i]);
                }
                updateTextOnCanvas(
                    textArr,
                    ctxRef.current,
                    canvasRef.current,
                    isLight,
                    fontSize,
                    fontFamily,
                    textY.current,
                    textX.current,
                    isDrawing,
                    redraw,
                    calculateCaretPosition,
                    caretX.current,
                    caretY.current,
                    fontColor
                );
            }
            callback();
        })
    }

    function enterKeyAction() {
        if (!textArr.length) textArr.push([]);
        // Получаем текущую строку
        const currentLine = textArr[caretPosition.current.line];

        // Разделяем текущую строку на две части: до и после курсора
        const beforeCaret = currentLine.slice(0, caretPosition.current.character);
        const afterCaret = currentLine.slice(caretPosition.current.character);

        // Обновляем текущую строку с новой частью до курсора
        textArr[caretPosition.current.line] = [...beforeCaret];

        // Вставляем новую строку после текущей
        textArr.splice(caretPosition.current.line + 1, 0, [...afterCaret]);

        // Обновляем позицию курсора
        caretPosition.current.line++;
        caretPosition.current.character = 0;
    }


    function ctrlArrowJumpAction (direction){
        const currentLine = textArr[caretPosition.current.line];
        let lineStr = currentLine.map(i => i.text).join('');
        let wordEndIndex;
        if (direction === 'left') {
            let searchStr = lineStr.slice(0, caretPosition.current.character);
            if (!searchStr.trim().length || caretPosition.current.character === 0) {
                wordEndIndex = -1
            }else {
                wordEndIndex = searchStr.lastIndexOf(' ', caretPosition.current.character)+1;
                if (caretPosition.current.character === -1) return;
            }
            if (caretPosition.current.character === wordEndIndex){
                const letterToFind = searchStr.trimEnd().slice(-1);
                wordEndIndex = searchStr.lastIndexOf(letterToFind, caretPosition.current) + 1;
            }
        }
        if (direction === 'right'){
            wordEndIndex = lineStr.indexOf(' ', caretPosition.current.character);
            if (wordEndIndex === 0){
                const letterToFind = lineStr.slice(caretPosition.current.character + 1, lineStr.length).trimStart();
                wordEndIndex = lineStr.indexOf(letterToFind, caretPosition.current.character);
            } else if (wordEndIndex === -1) {
                wordEndIndex = currentLine.length;
            } else if(caretPosition.current.character === wordEndIndex && wordEndIndex < currentLine.length){
                const letterToFind = lineStr.slice(caretPosition.current.character, lineStr.length).trimStart();
                wordEndIndex = lineStr.indexOf(letterToFind, caretPosition.current.character);
                if (!letterToFind) {
                    wordEndIndex = currentLine.length;
                }
            }

        }
        caretPosition.current.character = wordEndIndex !== -1 ? wordEndIndex : 0;
        console.log(caretPosition.current.character)

    }

    async function getPasteText() {
        if (!navigator.clipboard) return getPasteTextWithAlert();

        try {
            return await navigator.clipboard.readText();
        } catch (error) {
            console.error('Error reading from clipboard:', error);
        }
    }

    function getPasteTextWithAlert() {
        // Запрашиваем пользователя вставить текст
        const pastedText = prompt("Пожалуйста, вставьте текст, который вы скопировали:", "");

        if (pastedText !== null) {
            // Если пользователь ввел текст, возвращаем его
            return pastedText;
        } else {
            // Если пользователь отменил ввод
            return 'Ввод отменен';
        }
    }


    const savePng = () => {
        canvasData = canvasRef.current.toDataURL('image/png');
        link = document.createElement('a');
        link.href = canvasData;
        link.download = 'canvas_note_image.png';
        link.click();
    }

    const noBlur = (e) => e.target.focus();

    return (
        <>
            <canvas onBlur={noBlur} tabIndex={0} onKeyDown={(e) => onKeyDownSwitch(e)} onMouseDown={(e) => startDrawing(e.nativeEvent)} onMouseMove={(e) => draw(e.nativeEvent)} onMouseUp={endDrawing} onMouseOut={endDrawing} id='canvas' ref={canvasRef} className={cls.Canvas}></canvas>
            <SaveButton isLight={isLight} onClick={savePng}/>
        </>
    );
};

export default Canvas;
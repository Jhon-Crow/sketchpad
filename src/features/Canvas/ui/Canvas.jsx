import React, {useEffect, useRef, useState} from 'react';
import cls from './Canvas.module.scss'
import SaveButton from "../../SaveButton/ui/SaveButton.jsx";
import {checkLinesLimit, updateTextOnCanvas} from "../functions/updateTextOnCanvas.js";
import {textArrToLines} from "../functions/textArrToLines.js";
import {doSeveralTimes} from "../../../helpers/doSeveralTimes.js";

let canvas;
let ctx;
const coords = [];
const coordsDisabled = [];

let textArr = [];

const textHistory = [{'text': '', 'caretPosition': {line: 0, character: 0} }];
let textHistoryIndex = 0;
const keysDontPrint = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F12', 'F5', 'CapsLock', 'Meta'];

let textX = 10;
let textY = 20;
let caretX = textX;
let caretY = textY;
let textWrapLimit;

let caretPosition = { line: 0, character: 0 };

const Canvas = ({
                    fontColor,
                    lineColor,
                    lineSize,
                    fontFamily,
                    fontSize,
                    isLight,
                    setCapsLockPressed}) => {
    const [canvasDimensions, setCanvasDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const canvasRef = useRef(null);
    let canvasData;
    let link;
    let isDrawing = false;

    const coordsDisabledLimit = 10000;

    let linesLimit = window.innerHeight / (fontSize * 1.5);
    const lineLengthLimit = 30;

    // const drawBg = (ctx) => {
    //     ctx.fillStyle = isLight ? '#F2F0E7FF' : '#2A2A2B';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }

    useEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        canvas.width = canvasDimensions.width / 1.32;
        canvas.height = canvasDimensions.height / 1.05;
        textWrapLimit = canvas.width / 6.5;
        updateTextOnCanvas(
            textArr,
            ctx,
            canvas,
            isLight,
            fontSize,
            fontFamily,
            textY,
            textX,
            isDrawing,
            redraw,
            calculateCaretPosition,
            caretX,
            caretY,
            fontColor);
        canvas.focus();
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
        textX = 10;
        textY = fontSize * 1.5;
        caretX = textX;
        caretY = textY;
        textWrapLimit = canvas.width / (fontSize * 1.5);
        linesLimit = window.innerHeight / (fontSize * 1.5);
        updateTextOnCanvas(
            textArr,
            ctx,
            canvas,
            isLight,
            fontSize,
            fontFamily,
            textY,
            textX,
            // colorAndIndex,
            isDrawing,
            redraw,
            calculateCaretPosition,
            caretX,
            caretY,
            fontColor);
    }, [fontSize]);

   function redraw() {
        ctx.beginPath();
        coords.forEach(function(coord) {
            if (coord === 'brake') {
                ctx.stroke();
                ctx.beginPath();
            } else if (coord.includes('#')) {
                ctx.strokeStyle = coord;
            } else {
                ctx.lineWidth = coord[2];
                ctx.lineTo(coord[0], coord[1]);
            }
        });
        ctx.stroke();
    }

    function startDrawing(e) {
        coords.push(lineColor);
        coords.push('brake');
        coordsDisabled.length = 0;
        coords.push([e.offsetX, e.offsetY, Number(lineSize)]);
        isDrawing = true;
        ctx.beginPath();
        ctx.lineWidth = lineSize;
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineSize;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        coords.push([e.offsetX, e.offsetY, Number(lineSize)]);
    }

    function endDrawing() {
        if (isDrawing) {
            coords.push('brake');
            ctx.closePath();
            isDrawing = false;
        }
    }

    function loadFromHistory(textHistoryIndex){
        console.log('loadFromHistory, textHistoryIndex = ',textHistoryIndex )
    }
    //todo понять как это должно работать (сохранять весь стэйт может?)

    // логика та же что и с текстом
    // function loadFromHistory(textHistoryIndex){
    //     text = textHistory[textHistoryIndex].text;
    //     caretPosition = textHistory[textHistoryIndex].caretPosition;
    //     if (textHistory[textHistoryIndex].colorAndIndex[0].color !== 'default'){
    //         setColorAndIndex(textHistory[textHistoryIndex].colorAndIndex);
    //     }
    // }

    function saveToHistory(){
        textHistory.push({
            // todo возможно тут нужно будет кастовать в строку
            text: textArr,
            caretPosition: {
                line: caretPosition.line,
                character: caretPosition.character
            }
            // ,colorAndIndex: [...colorAndIndex]
        });
        textHistoryIndex++;
        // console.log(textHistory)
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
            ctx,
            canvas,
            isLight,
            fontSize,
            fontFamily,
            textY,
            textX,
            isDrawing,
            redraw,
            calculateCaretPosition,
            caretX,
            caretY,
            fontColor);
    }

    function withCtrlSwitchCase(eKeyCode, e){
        const keyCodes = {
            37: () => ctrlArrowJumpAction('left'),
            39: () => ctrlArrowJumpAction('right'),
            86: () => ctrlVAction(e),
            90: () => ctrlZAction(e),
            89: () => ctrlYAction(e)
        }
        return keyCodes[eKeyCode] ? keyCodes[eKeyCode]() : null;
    }

    function ctrlVAction(e){
        if (textArrToLines(textArr).length > linesLimit - 1){
                        e.stopPropagation();
                        e.preventDefault();
                        alert('no space on page!\n' +
                            'input blocked')
                    } else {
                        pastText(saveToHistory);
                    }
    }

    function ctrlZAction(e) {
        if ((coords.length && coordsDisabled.length < coordsDisabledLimit) && e.getModifierState('CapsLock')){
                        coordsDisabled.push(coords?.pop());
                    } else if (textHistoryIndex > 0 && !e.getModifierState('CapsLock')) {
                        textHistoryIndex--;
                        loadFromHistory(textHistoryIndex);
                    }
    }

    function ctrlYAction(e) {
        if (coordsDisabled.length && e.getModifierState('CapsLock')){
                    coords?.push(coordsDisabled?.pop());
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
                deleteCharacter('backspace');
                saveToHistory();
            },
            Delete: () => {
                deleteCharacter('delete');
                saveToHistory();
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

//todo it
//     function checkLinesLimit(action) {
//         if (textArrToLines(textArr).length > linesLimit - 1) {
//             alert('no space on page!\n' +
//                 'input blocked');
//             return false;
//         } else {
//             if (action){
//                 action();
//                 saveToHistory();
//             }
//             return true;
//         }
//     }



    function caretMoveLeft() {
        if (caretPosition.character > 0) {
            caretPosition.character--;
            console.log(caretPosition.character)
        } else if (caretPosition.line > 0) {
            caretPosition.line--;
            caretPosition.character = textArr[caretPosition.line].length;
        }
    }

    function caretMoveRight() {
        // todo вроде работает правильно
        if (caretPosition.character < textArr[caretPosition.line].length) {
            caretPosition.character++;
            // console.log(caretPosition.character)
        } else if (caretPosition.line < textArr[caretPosition.line].length - 1 && textArr[caretPosition.line+1]) {
            // console.log(caretPosition.character)
            caretPosition.line++;
            caretPosition.character = 0;
        }
    }

    function caretMoveUp() {
        if (caretPosition.line > 0) {
            caretPosition.line--;
            caretPosition.character = Math.min(caretPosition.character, textArr[caretPosition.line].length);
        }
    }

    function caretMoveDown() {
        if (caretPosition.line < textArr.length - 1) {
            caretPosition.line++;
            caretPosition.character = Math.min(caretPosition.character, textArr[caretPosition.line].length);
        }
    }

    function addLetter(letter){
        // todo добавить проверку на лимит строки
            let itemToArr = {
                text: letter,
                color: fontColor,
                fontFamily,
                fontSize,
                line: caretPosition.line,
                character: caretPosition.character
            };
            if (!textArr.length){
                textArr.push([itemToArr]);
            } else {
                    const currentLine = textArr[caretPosition.line];
                    const beforeCaret = currentLine.slice(0, caretPosition.character);
                    const afterCaret = currentLine.slice(caretPosition.character);
                    textArr[caretPosition.line] = [...beforeCaret, itemToArr, ...afterCaret];
                // todo добавить автоперенос

            }
            caretPosition.character++;
        calculateCaretPosition()
    }

    function onTabAction(){
        // addLetter('    ');
        doSeveralTimes(() => addLetter(' '), 4)
        // caretPosition.character += 3;
    }


    // function deleteCharacter(direction) {
    //     console.log('deleteCharacter, direction = ', direction)
    // }

    function deleteCharacter(direction) {
        let currentLine = textArr[caretPosition.line];






        if (direction === 'backspace') {
            if (caretPosition.character > 0) {
                currentLine.splice(caretPosition.character - 1, 1);
                caretPosition.character--;
            } else if (caretPosition.line > 0) {
                let previousLine = textArr[caretPosition.line - 1];
                textArr[caretPosition.line - 1] = [...previousLine, ...currentLine];
                textArr.splice(caretPosition.line, 1);
                caretPosition.line--;
                caretPosition.character = previousLine.length; // Устанавливаем позицию каретки в конец новой строки
            }





        } else if (direction === 'delete') {
            // todo не работает
            // Удаление символа под кареткой
            if (caretPosition.character < currentLine.length) {
                let newLine = currentLine.substring(0, caretPosition.character) + currentLine.substring(caretPosition.character + 1);
                let newLines = textArrToLines(textArr).map((line, index) => index === caretPosition.line ? newLine : line);
                textArr = newLines.map((line, index) => ({ text: line, color: textArr[index]?.color || 'default' })); // Сохраняем цвет
            } else if (caretPosition.line < textArrToLines(textArr).length - 1) {
                // Объединяем текущую строку с следующей
                let nextLine = textArrToLines(textArr, caretPosition.line + 1);
                let newCurrentLine = currentLine + nextLine; // Объединяем строки
                let newLines = textArrToLines(textArr).map((line, index) => index === caretPosition.line ? newCurrentLine : (index === caretPosition.line + 1 ? '' : line));
                textArr = newLines.map((line, index) => ({ text: line, color: textArr[index]?.color || 'default' })); // Сохраняем цвет
            }
        }
    }

    function calculateCaretPosition() {
        let currentLine = textArr[caretPosition.line]?.map(i => i.text).join('') || '';

        // todo проитерироваться по строке и считать размер с учётом фонтФэмли
        let caretMeasurement = ctx.measureText(currentLine.substring(0, caretPosition.character));
        caretX = textX + caretMeasurement.width;

        caretY = textY + (fontSize + 5) * caretPosition.line;
    }

    // function calculateCaretPosition(fontOfLetter) {
    //     let currentLine = textArr[caretPosition.line]?.map(i => i.text).join('') || '';
    //     caretX = textX; // Начальная позиция по X
    //
    //     // Проходим по каждому символу до позиции курсора
    //     for (let i = 0; i < caretPosition.character; i++) {
    //         // Устанавливаем текущий шрифт для символа
    //         ctx.font = fontOfLetter; // Предполагается, что у вас есть функция, возвращающая шрифт для символа
    //         caretX += ctx.measureText(currentLine[i]).width; // Добавляем ширину символа к позиции курсора
    //     }
    //
    //     caretY = textY + (fontSize + 5) * caretPosition.line; // Позиция по Y остается прежней
    // }

    function pastText(callback){
        // todo надо правильно распределить строки
        getPasteText().then(str => {
            addLetter(str);
            caretPosition.character--;
            calculateCaretPosition();
            updateTextOnCanvas(
                textArr,
                ctx,
                canvas,
                isLight,
                fontSize,
                fontFamily,
                textY,
                textX,
                // colorAndIndex,
                isDrawing,
                redraw,
                calculateCaretPosition,
                caretX,
                caretY,
                fontColor);
            callback();
        })
    }

    function enterKeyAction() {
       if (!textArr.length) textArr.push([]);
        // Получаем текущую строку
        const currentLine = textArr[caretPosition.line];

        // Разделяем текущую строку на две части: до и после курсора
        const beforeCaret = currentLine.slice(0, caretPosition.character);
        const afterCaret = currentLine.slice(caretPosition.character);

        // Обновляем текущую строку с новой частью до курсора
        textArr[caretPosition.line] = [...beforeCaret];

        // Вставляем новую строку после текущей
        textArr.splice(caretPosition.line + 1, 0, [...afterCaret]);

        // Обновляем позицию курсора
        caretPosition.line++;
        caretPosition.character = 0;
    }


    function ctrlArrowJumpAction (direction){
        // todo скачет по краям строки а не по словам
        let currentLine = textArr[caretPosition.line];
        let wordEndIndex;
        if (direction === 'left'){
            wordEndIndex = currentLine.lastIndexOf(' ', caretPosition.character - 1);
            if (wordEndIndex === -1) {
                wordEndIndex = 0;
            } else if(caretPosition.character - wordEndIndex !== 1){
                wordEndIndex++;
            }
        }
        if (direction === 'right'){
            wordEndIndex = currentLine.indexOf(' ', caretPosition.character);
            if (wordEndIndex === -1) {
                wordEndIndex = currentLine.length;
            }  else if(caretPosition.character === wordEndIndex){
                wordEndIndex++;
            }
        }
        caretPosition.character = wordEndIndex;
    }

    async function getPasteText() {
        try {
            return await navigator.clipboard.readText();
        } catch (error) {
        console.error('Error reading from clipboard:', error);
        }
    }

    const savePng = () => {
        canvasData = canvas.toDataURL('image/png');
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
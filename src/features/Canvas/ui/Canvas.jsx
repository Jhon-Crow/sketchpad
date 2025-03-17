import React, {useEffect, useMemo, useReducer, useRef, useState} from 'react';
import cls from './Canvas.module.scss'
import SaveButton from "../../SaveButton/ui/SaveButton.jsx";
import {checkLinesLimit, updateTextOnCanvas} from "../functions/updateTextOnCanvas.js";
import {doSeveralTimes} from "../../../helpers/doSeveralTimes.js";

let canvas;
let ctx;
const coords = [];
const coordsDisabled = [];

const textHistory = [{'text': [[{character: 0, color: 'black', fontFamily: 'Courier', fontSize: 16, line: 0, text: ''}]], 'caretPosition': {line: 0, character: 0} }];
let textHistoryIndex = 0;
const delDirections = {back: 'backspace', forward: 'delete'};

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
    let [textArr, _] = useState([]);
    const canvasRef = useRef(null);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let canvasData;
    let link;
    let isDrawing = false;

    const coordsDisabledLimit = 10000;

    let linesLimit = window.innerHeight / (fontSize * 1.5);
    const lineLengthLimit = Math.floor(window.innerWidth / (fontSize - 2));

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



    function loadFromHistory(index) {
        textArr.splice(0, textArr.length, ...structuredClone(textHistory[index].text));

        Object.assign(caretPosition, textHistory[index].caretPosition);

        forceUpdate();
    }

    function saveToHistory() {
        if (textHistoryIndex < textHistory.length - 1) {
            textHistory.splice(textHistoryIndex + 1);
        }

        const newEntry = {
            text: structuredClone(textArr.map(line =>
                line.map(char => ({...char}))
            )),
            caretPosition: {...caretPosition}
        };

        const lastEntry = textHistory[textHistory.length - 1];
        if (!lastEntry || !isEqualDeep(lastEntry, newEntry)) {
            textHistory.push(newEntry);
            textHistoryIndex = textHistory.length - 1;
        }
    }

    function isEqualDeep(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
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
            89: () => ctrlYAction(e),
            8: () => ctrlDeleteAction(delDirections.back),
            46: () => ctrlDeleteAction(delDirections.forward)
        }
        return keyCodes[eKeyCode] ? keyCodes[eKeyCode]() : null;
    }

    function ctrlVAction(e){
        if (textArr.length > linesLimit - 1){
                        e.stopPropagation();
                        e.preventDefault();
                        alert('no space on page!\n' +
                            'input blocked')
                    } else {
                        e.stopPropagation();
                        e.preventDefault();
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
                deleteCharacter(delDirections.back);
            },
            Delete: () => {
                deleteCharacter(delDirections.forward);
            }
        }
        return keys[eKey] ? keys[eKey]() : defaultKeyPressCase(eKey)
    }

    function defaultKeyPressCase(eKey){
        if (
            eKey.length < 2 && checkLinesLimit(null,textArr, saveToHistory, linesLimit)) {
                addLetter(eKey);
                saveToHistory();
        }
    }

    function caretMoveLeft() {
        if (caretPosition.character > 0) {
            caretPosition.character--;
        } else if (caretPosition.line > 0) {
            caretPosition.line--;
            caretPosition.character = textArr[caretPosition.line].length;
        }
    }

    function caretMoveRight() {
        if (caretPosition.character < textArr[caretPosition.line].length) {
            caretPosition.character++;
        } else if (caretPosition.line < textArr[caretPosition.line].length - 1 && textArr[caretPosition.line+1]) {
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
       function simpleAddLetter(){
           const currentLine = textArr[caretPosition.line];
           const beforeCaret = currentLine.slice(0, caretPosition.character);
           const afterCaret = currentLine.slice(caretPosition.character);
           textArr[caretPosition.line] = [...beforeCaret, itemToArr, ...afterCaret];
       }
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
                if (textArr[caretPosition.line].length >= lineLengthLimit) {
                    enterKeyAction();
                }
                simpleAddLetter();
            }
            caretPosition.character++;
        calculateCaretPosition()
    }

    function onTabAction(){
        doSeveralTimes(() => addLetter(' '), 4);
    }

    function deleteCharacter(direction) {
        let currentLine = textArr[caretPosition.line];
        if (direction === delDirections.back) {
            if (caretPosition.character > 0) {
                currentLine.splice(caretPosition.character - 1, 1);
                caretPosition.character--;
            } else if (caretPosition.line > 0) {
                let previousLine = textArr[caretPosition.line - 1];
                textArr[caretPosition.line - 1] = [...previousLine, ...currentLine];
                textArr.splice(caretPosition.line, 1);
                caretPosition.line--;
                caretPosition.character = previousLine.length;
            }
        } else if (direction === delDirections.forward) {
            if (caretPosition.character < currentLine.length) {
                if (caretPosition.character === -1) caretPosition.character = 0;
                currentLine.splice(caretPosition.character, 1);
            } else if (caretPosition.line < textArr.length - 1) {
                let nextLine = textArr[caretPosition.line + 1];
                currentLine.push(...nextLine);
                textArr.splice(caretPosition.line + 1, 1);
            }
        }
        saveToHistory();
   }

   function ctrlDeleteAction(direction){
        if (direction === delDirections.back){
            const endIndex = caretPosition.character;
            ctrlArrowJumpAction('left');
            const startIndex = caretPosition.character !== -1 ? caretPosition.character : 0;
            textArr[caretPosition.line].splice(startIndex, endIndex - startIndex);
            saveToHistory();
        }
        if (direction === delDirections.forward){
            if (caretPosition.character === -1) caretPosition.character = 0;
            const startIndex = caretPosition.character;
            ctrlArrowJumpAction('right');
            const endIndex = caretPosition.character;
            textArr[caretPosition.line].splice(startIndex, endIndex - startIndex)
            caretPosition.character = startIndex;
            saveToHistory();
        }
   }

    function calculateCaretPosition() {
        let currentLine = textArr[caretPosition.line]?.map(i => i.text).join('') || '';
        let caretMeasurement = ctx.measureText(currentLine.substring(0, caretPosition.character));
        caretX = textX + caretMeasurement.width;

        caretY = textY + (fontSize + 5) * caretPosition.line;
    }

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
                    fontColor
                );
            }
            callback();
        })
    }

    function enterKeyAction() {
       if (!textArr.length) textArr.push([]);
        const currentLine = textArr[caretPosition.line];

        const beforeCaret = currentLine.slice(0, caretPosition.character);
        const afterCaret = currentLine.slice(caretPosition.character);

        textArr[caretPosition.line] = [...beforeCaret];
        textArr.splice(caretPosition.line + 1, 0, [...afterCaret]);

        caretPosition.line++;
        caretPosition.character = 0;
    }

    function ctrlArrowJumpAction (direction){
        const currentLine = textArr[caretPosition.line];
        let lineStr = currentLine.map(i => i.text).join('');
        let wordEndIndex;
        if (direction === 'left') {
            let searchStr = lineStr.slice(0, caretPosition.character);
            if (!searchStr.trim().length || caretPosition.character === 0) {
                wordEndIndex = -1
            }else {
                wordEndIndex = searchStr.lastIndexOf(' ', caretPosition.character)+1;
                if (caretPosition.character === -1) return;
            }
            if (caretPosition.character === wordEndIndex){
                const letterToFind = searchStr.trimEnd().slice(-1);
                wordEndIndex = searchStr.lastIndexOf(letterToFind, caretPosition) + 1;
            }
        }
        if (direction === 'right'){
            wordEndIndex = lineStr.indexOf(' ', caretPosition.character);
            if (wordEndIndex === 0){
                const letterToFind = lineStr.slice(caretPosition.character + 1, lineStr.length).trimStart();
                wordEndIndex = lineStr.indexOf(letterToFind, caretPosition.character);
            } else if (wordEndIndex === -1) {
                wordEndIndex = currentLine.length;
            } else if(caretPosition.character === wordEndIndex && wordEndIndex < currentLine.length){
                const letterToFind = lineStr.slice(caretPosition.character, lineStr.length).trimStart();
                wordEndIndex = lineStr.indexOf(letterToFind, caretPosition.character);
                if (!letterToFind) {
                    wordEndIndex = currentLine.length;
                }
            }

        }
        caretPosition.character = wordEndIndex !== -1 ? wordEndIndex : 0;
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
        const pastedText = prompt("Пожалуйста, вставьте текст, который вы скопировали:", "");

        if (pastedText !== null) {
            return pastedText;
        } else {
            return 'Ввод отменен';
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
            <canvas
                onBlur={noBlur}
                tabIndex={0}
                onKeyDown={(e) => onKeyDownSwitch(e)}
                onMouseDown={(e) => startDrawing(e.nativeEvent)}
                onMouseMove={(e) => draw(e.nativeEvent)}
                onMouseUp={endDrawing} onMouseOut={endDrawing}
                id='canvas'
                ref={canvasRef}
                className={cls.Canvas}
            ></canvas>
            <SaveButton isLight={isLight} onClick={savePng}/>
        </>
    );
};

export default Canvas;
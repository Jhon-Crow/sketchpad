import React, {useEffect, useRef, useState} from 'react';
import cls from './Canvas.module.scss'
import SaveButton from "../SaveButton/SaveButton.jsx";

let canvas;
let ctx;

const coords = [];
const coordsDisabled = [];
let text = '';
// let colorAndIndex = [{index: 0, color: }];
//TODO надо сделать запись цвета текста по длине текста

//TODO добавить движение каретки на слово по ctrl+Arrow

const textHistory = [{'text': '', 'caretPosition': {line: 0, character: 0}}];
let textHistoryIndex = 0;
const keysDontPrint = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F12', 'F5', 'CapsLock', 'Meta'];

let textX = 10;
let textY = 20;
let caretX = textX;
let caretY = textY;

let caretPosition = { line: 0, character: 0 };

const Canvas = ({fontColor, lineColor, fontFamily, fontSize, isLight}) => {
    const [colorAndIndex, ] = useState([{index: 0, color: fontColor}]);
    const canvasRef = useRef(null);
    let canvasData;
    let link;
    let isDrawing = false;

    const textWrapLimit = Math.round(window.innerWidth );
    // console.log(textWrapLimit)
    //TODO найти все места где используется и заменить на вычисление размеров
    const coordsDisabledLimit = 10000;

    const linesLimit = window.innerHeight / (fontSize * 1.5);

    const drawBg = (ctx) => {
        ctx.fillStyle = isLight ? '#F2F0E7FF' : '#2A2A2B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    useEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth / 1.56;
        canvas.height = window.innerHeight / 1.05;
        updateTextOnCanvas(ctx);
        canvas.focus();
    }, [isLight])

    useEffect(() => {
        for (let i = 0; i < colorAndIndex.length; i++){
            //works!!!!
            console.log('for ', text.substring(colorAndIndex[i].index, colorAndIndex[i + 1]?.index))
        }
        // console.log(text.substring())

        console.log(colorAndIndex.length-1, text.length)
        console.log(colorAndIndex)
        if (text.length > colorAndIndex[colorAndIndex.length-1].index && colorAndIndex[colorAndIndex.length-1].color !== fontColor) {
            colorAndIndex.push({index: text.length, color: fontColor});
            console.log('push ', colorAndIndex)
        }
        if (text.length === colorAndIndex[colorAndIndex.length-1].index && colorAndIndex[colorAndIndex.length-1].color !== fontColor){
            if (colorAndIndex[colorAndIndex.length-2] && colorAndIndex[colorAndIndex.length-2].color === fontColor){
                colorAndIndex.pop();
                console.log('pop ', colorAndIndex)
            } else {
                colorAndIndex[colorAndIndex.length-1].color = fontColor;
                console.log('edit ', colorAndIndex)
            }
        }

    },[fontColor])


    function updateTextOnCanvas(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBg(ctx);
        //TODO добавить проверку длинны текста и краску
        // удалять совпадающие соседние индексы
        ctx.font = fontSize + 'px ' + fontFamily;
        // ctx.fillStyle = fontColor;
        let lines = text.split('\n');
        let y = textY;
        let countText = 0;
        let checkIndex = 1;
        for (let i = 0; i < lines.length; i++) {
            let x = textX; // Initialize x-coordinate for each line
            for (let j = 0; j < lines[i].length; j++) {

                if (!colorAndIndex[checkIndex] || countText < colorAndIndex[checkIndex].index){
                    ctx.fillStyle = colorAndIndex[checkIndex - 1].color;
                } else if (countText >= colorAndIndex[checkIndex].index){
                    ctx.fillStyle = colorAndIndex[checkIndex].color;
                    checkIndex++;
                }
                // console.log(countText, colorAndIndex[countText].color)

                // ctx.fillStyle = colorAndIndex[countText].color;
                ctx.fillText(lines[i][j], x, y);
                // console.log(lines[i][j], x, y)
                let charWidth = ctx.measureText(lines[i][j]).width;
                x += charWidth;
                countText++;
                // console.log(countText)
            }

            y += fontSize + 5; // Add some space between lines
        }
        console.log('checkIndex ', checkIndex)
        if (!isDrawing) {
            calculateCaretPosition();
            ctx.fillStyle = fontColor;
            ctx.fillRect(caretX, caretY - fontSize, 1, fontSize);
        }
        redraw();
    }

    function calculateCaretPosition() {
        let lines = text.split('\n');
        let currentLine = lines[caretPosition.line] || '';
        let caretMeasurement = ctx.measureText(currentLine.substring(0, caretPosition.character));
        caretX = textX + caretMeasurement.width;
        caretY = textY + (fontSize + 5) * caretPosition.line;
    }

    function redraw() {
        ctx.beginPath();
        coords.forEach(function(coord) {
            if (coord === 'brake') {
                ctx.stroke();
                ctx.beginPath();
            } else if (coord.includes('#')) {
                ctx.strokeStyle = coord;
            } else {
                ctx.lineTo(coord[0], coord[1]);
            }
        });
        ctx.stroke();
    }

    function startDrawing(e) {
        // console.log('start drawing')
        coords.push(lineColor);
        coords.push('brake');
        coordsDisabled.length = 0;
        coords.push([e.offsetX, e.offsetY]);
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.strokeStyle = lineColor;
        // console.log(ctx.strokeStyle)
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        coords.push([e.offsetX, e.offsetY]);
    }

    function endDrawing() {
        if (isDrawing) {
            coords.push('brake');
            ctx.closePath();
            isDrawing = false;
        }
    }

    function onKeyDownSwitch(e) {
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 86:
                    if (lines().length > linesLimit - 1){
                        e.stopPropagation();
                        e.preventDefault();
                        alert('no space on page!\n' +
                            'input blocked')
                    } else {
                        pastText(saveToHistory);
                    }
                    break;
                case 90 :
                    if ((coords.length && coordsDisabled.length < coordsDisabledLimit) && e.getModifierState('CapsLock')){
                        coordsDisabled.push(coords?.pop());
                    } else if (textHistoryIndex > 0) {
                        textHistoryIndex--;
                        text = textHistory[textHistoryIndex].text;
                        caretPosition = textHistory[textHistoryIndex].caretPosition;
                    }
                    break;
                case 89:
                    if (coordsDisabled.length && e.getModifierState('CapsLock')){
                        coords?.push(coordsDisabled?.pop());
                    } else if (textHistoryIndex < textHistory.length - 1) {
                        textHistoryIndex++;
                        text = textHistory[textHistoryIndex].text;
                        caretPosition = textHistory[textHistoryIndex].caretPosition;
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (e.key) {
                case 'Enter':
                    checkLinesLimit(enterKeyAction);
                    break;
                case 'Tab':
                    e.preventDefault();
                    checkLinesLimit(onTabAction);
                    break;
                case 'Backspace':
                    deleteCharacter('backspace');
                    saveToHistory();
                    break;
                case 'Delete':
                    deleteCharacter('delete');
                    saveToHistory();
                    break;
                case 'ArrowLeft':
                    caretMoveLeft();
                    break;
                case 'ArrowRight':
                    caretMoveRight();
                    break;
                case 'ArrowUp':
                    caretMoveUp();
                    break;
                case 'ArrowDown':
                    caretMoveDown();
                    break;
                default:
                    if (!keysDontPrint.includes(e.key)) {
                        if (checkLinesLimit()) {
                            addLetter(e.key);
                            saveToHistory();
                        }
                    }
                    break;
            }
        }
        updateTextOnCanvas(ctx);
    }


    function checkLinesLimit(action) {
        if (lines().length > linesLimit - 1) {
            alert('no space on page!\n' +
                'input blocked');
            return false;
        } else {
            if (action){
                action();
                saveToHistory();
            }
            return true;
        }
    }

    function saveToHistory(){
        textHistory.push({text: text, caretPosition: {line: caretPosition.line, character: caretPosition.character}});
        textHistoryIndex++;
    }

    function caretMoveLeft() {
        if (caretPosition.character > 0) {
            caretPosition.character--;
        } else if (caretPosition.line > 0) {
            caretPosition.line--;
            caretPosition.character = lines(caretPosition.line).length;
        }
    }

    function caretMoveRight() {
        if (caretPosition.character < lines(caretPosition.line).length) {
            caretPosition.character++;
        } else if (caretPosition.line < lines().length - 1) {
            caretPosition.line++;
            caretPosition.character = 0;
        }
    }

    function caretMoveUp() {
        if (caretPosition.line > 0) {
            caretPosition.line--;
            caretPosition.character = Math.min(caretPosition.character, lines(caretPosition.line).length);
        }
    }

    function caretMoveDown() {
        if (caretPosition.line < lines().length - 1) {
            caretPosition.line++;
            caretPosition.character = Math.min(caretPosition.character, lines(caretPosition.line).length);
        }
    }

    function addLetter(letter){
        let newLine;
        let newLines;
        let currentLine = lines(caretPosition.line);
        addLetterOnCaret(letter);
        for (let i = 0; i < newLines.length; i++){
            if(newLines[i].length >= textWrapLimit) {
                newLines[i].split(0, textWrapLimit)
                if (!newLines[i + 1]){
                    newLines[i + 1] = newLines[i].substring(textWrapLimit, newLines[i].length)
                } else {
                    newLines[i + 1] = newLines[i].substring(textWrapLimit, newLines[i].length) + newLines[i + 1]
                }
                if (caretPosition.character > textWrapLimit){
                    caretPosition.line++;
                    caretPosition.character = 1;
                }
                newLines[i] = newLines[i].substring(0, textWrapLimit);
            }
        }
        text = newLines.join('\n');

        function addLetterOnCaret(letter) {
            newLine = currentLine.substring(0, caretPosition.character) + letter + currentLine.substring(caretPosition.character);
            newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
            currentLine = newLine;
            caretPosition.character++;
        }
    }

    function onTabAction(){
        addLetter('    ');
        caretPosition.character += 3;
    }

    function deleteCharacter(direction) {
        let currentLine = lines(caretPosition.line);
        if (direction === 'backspace') {
            if (currentLine.length > 0 && caretPosition.character > 0) {
                // Удаление символа в середине или в конце строки
                let newLine = currentLine.substring(0, caretPosition.character - 1) + currentLine.substring(caretPosition.character);
                let newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
                text = newLines.join('\n');
                caretPosition.character--;
            } else if (caretPosition.line > 0) {
                // Удаление переноса строки
                let previousLine = lines(caretPosition.line - 1);
                let newPreviousLine = previousLine + (currentLine.length > 0 ? currentLine : '');
                let newLines = lines().map((line, index) => index === caretPosition.line - 1 ? newPreviousLine : (index === caretPosition.line ? '' : line));
                newLines.splice(caretPosition.line, 1)
                text = newLines.join('\n');
                caretPosition.line--;
                caretPosition.character = previousLine.length
            }
        } else if (direction === 'delete') {
            if (currentLine.length > 0 && caretPosition.character < currentLine.length) {
                let newLine = currentLine.substring(0, caretPosition.character) + currentLine.substring(caretPosition.character + 1);
                let newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
                text = newLines.join('\n');
            } else if (caretPosition.line < lines().length - 1) {
                let nextLine = lines(caretPosition.line + 1);
                let newCurrentLine = currentLine + (nextLine.length > 0 ? nextLine : '');
                let newLines = lines().map((line, index) => index === caretPosition.line ? newCurrentLine : (index === caretPosition.line + 1 ? '' : line));
                newLines.splice(caretPosition.line + 1, 1);
                text = newLines.join('\n');
            }
        }
    }

    function pastText(callback){
        getPasteText().then(str => {
            addLetter(str);
            caretPosition.character--;
            calculateCaretPosition();
            updateTextOnCanvas(ctx);
            callback();
        })
    }

    function enterKeyAction() {
        let currentLine = lines(caretPosition.line);
        let newLine = currentLine.substring(0, caretPosition.character);
        let newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
        newLines.splice(caretPosition.line + 1, 0, currentLine.substring(caretPosition.character));
        text = newLines.join('\n');
        caretPosition.line++;
        caretPosition.character = 0;
    }

    function lines(lineNumber = null) {
        let linesArray = text.split('\n');
        if (lineNumber !== null) {
            return linesArray[lineNumber] || '';
        }
        return linesArray;
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

    return (
        <>
            <canvas tabIndex={0} onKeyDown={(e) => onKeyDownSwitch(e)} onMouseDown={(e) => startDrawing(e.nativeEvent)} onMouseMove={(e) => draw(e.nativeEvent)} onMouseUp={endDrawing} onMouseOut={endDrawing} id='canvas' ref={canvasRef} className={cls.Canvas}></canvas>
            <SaveButton isLight={isLight} onClick={savePng}/>
        </>
    );
};

export default Canvas;
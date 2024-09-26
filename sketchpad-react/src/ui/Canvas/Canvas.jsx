import React, {useEffect, useRef, useState} from 'react';
import cls from './Canvas.module.scss'
import SaveButton from "../SaveButton/SaveButton.jsx";

const Canvas = ({caretColor, fontColor, lineColor, fontFamily, fontSize, isLight}) => {
    const canvasRef = useRef(null);
    const [coordsState, setCoordsState] = useState([]);
    const [textState, setTextState] = useState('');
    const [coordsDisabledState, setCoordsDisabledState] = useState([]);
    const [textHistoryState, setTextHistoryState] = useState([{'text': '', 'caretPosition': {line: 0, character: 0}}]);
    const [textHistoryIndexState, setTextHistoryIndexState] = useState(1);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth / 1.56;
        canvas.height = window.innerHeight / 1.05;
        let canvasBackgroundColor = isLight ? '#F2F0E7FF' : '#2A2A2B';

        let isDrawing = false;
        let text = textState || '';
        const textWrapLimit = 10;
        const coordsDisabledLimit = 10000;

        let textX = 10;
        let textY = 20;

        const linesLimit = canvas.height / (fontSize * 1.5);

        const coords = coordsState || [];
        const coordsDisabled = coordsDisabledState || [];
        const textHistory = textHistoryState || [{'text': '', 'caretPosition': {line: 0, character: 0}}];
        let textHistoryIndex = textHistoryIndexState || 1;
        const keysDontPrint = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F12', 'F5', 'CapsLock', 'Meta'];

        let caretPosition = { line: 0, character: 0 };
        let caretX = textX;
        let caretY = textY;
        function updateTextOnCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = canvasBackgroundColor;
            // ctx.fillStyle = canvas.style.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = fontSize + 'px ' + fontFamily;
            ctx.fillStyle = fontColor;
            let lines = text.split('\n');
            let y = textY;
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], textX, y);
                y += fontSize + 5; // Добавляем немного пространства между строками
            }

            if (!isDrawing) {
                calculateCaretPosition();
                ctx.fillStyle = caretColor;
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
            ctx.strokeStyle = lineColor;
            coords.forEach(function(coord) {
                if (coord === 'brake') {
                    ctx.stroke();
                    ctx.beginPath();
                } else {
                    ctx.lineTo(coord[0], coord[1]);
                }
            });
            ctx.stroke();
        }

        function startDrawing(e) {
            coords.push('brake');
            coordsDisabled.length = 0;
            setCoordsDisabledState(coordsDisabled);
            coords.push([e.offsetX, e.offsetY]);
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
            setCoordsState(coords);
        }

        function draw(e) {
            if (!isDrawing) return;
            ctx.strokeStyle = lineColor;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            coords.push([e.offsetX, e.offsetY]);
            setCoordsState(coords);
        }

        function endDrawing() {
            if (isDrawing) {
                coords.push('brake');
                ctx.closePath();
                isDrawing = false;
                setCoordsState(coords);
            }
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mouseout', endDrawing);

        document.addEventListener('keydown', function(e) {
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
                            setCoordsDisabledState(coordsDisabled)
                        } else if (textHistoryIndex > 0) {
                            textHistoryIndex--;
                            textHistoryIndex--;
                            setTextHistoryIndexState(textHistoryIndex);
                            text = textHistory[textHistoryIndex].text;
                            setTextState(text);
                            caretPosition = textHistory[textHistoryIndex].caretPosition;
                        }
                        break;
                    case 89:
                        if (coordsDisabled.length && e.getModifierState('CapsLock')){
                            coords?.push(coordsDisabled?.pop());
                            setCoordsState(coords);
                        } else if (textHistoryIndex < textHistory.length - 1) {
                            textHistoryIndex++;
                            textHistoryIndex++;
                            setTextHistoryIndexState(textHistoryIndex);
                            text = textHistory[textHistoryIndex].text;
                            setTextState(text);
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
            updateTextOnCanvas();
        });

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
            setTextHistoryIndexState(textHistoryIndex);
            setTextHistoryState(textHistory);
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
            setTextState(text);
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
                    setTextState(text);
                    caretPosition.character--;
                } else if (caretPosition.line > 0) {
                    // Удаление переноса строки
                    let previousLine = lines(caretPosition.line - 1);
                    let newPreviousLine = previousLine + (currentLine.length > 0 ? currentLine : '');
                    let newLines = lines().map((line, index) => index === caretPosition.line - 1 ? newPreviousLine : (index === caretPosition.line ? '' : line));
                    newLines.splice(caretPosition.line, 1)
                    text = newLines.join('\n');
                    setTextState(text);
                    caretPosition.line--;
                    caretPosition.character = previousLine.length
                }
            } else if (direction === 'delete') {
                if (currentLine.length > 0 && caretPosition.character < currentLine.length) {
                    let newLine = currentLine.substring(0, caretPosition.character) + currentLine.substring(caretPosition.character + 1);
                    let newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
                    text = newLines.join('\n');
                    setTextState(text);
                } else if (caretPosition.line < lines().length - 1) {
                    let nextLine = lines(caretPosition.line + 1);
                    let newCurrentLine = currentLine + (nextLine.length > 0 ? nextLine : '');
                    let newLines = lines().map((line, index) => index === caretPosition.line ? newCurrentLine : (index === caretPosition.line + 1 ? '' : line));
                    newLines.splice(caretPosition.line + 1, 1);
                    text = newLines.join('\n');
                    setTextState(text);
                }
            }
        }

        function pastText(callback){
            getPasteText().then(str => {
                addLetter(str);
                caretPosition.character--;
                calculateCaretPosition();
                updateTextOnCanvas();
                callback();
            })
        }

        function enterKeyAction() {
            let currentLine = lines(caretPosition.line);
            let newLine = currentLine.substring(0, caretPosition.character);
            let newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
            newLines.splice(caretPosition.line + 1, 0, currentLine.substring(caretPosition.character));
            text = newLines.join('\n');
            setTextState(text);
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
        updateTextOnCanvas();
    }, [isLight]);


    const savePng = () => {
        const canvasData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = canvasData;
        link.download = 'canvas_note_image.png';
        link.click();
    }
    return (
        <>
            <canvas id='canvas' ref={canvasRef} className={cls.Canvas}></canvas>
            <SaveButton isLight={isLight} onClick={savePng}/>
        </>
    );
};

export default Canvas;
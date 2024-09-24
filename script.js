document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var saveBtn = document.getElementById('saveBtn');
    var isDrawing = false;
    let text = '';
    const textWrapLimit = 10;
    const coordsDisabledLimit = 2000;

    let caretColor = 'red';
    const fontColor = 'white';
    const lineColor = 'white';

    var textX = 10;
    var textY = 20;
    var fontSize = 14;
    var fontFamily = 'Arial';

    const coords = [];
    const coordsDisabled = [];
    const textHistory = [{'text': '', 'caretPosition': {line: 0, character: 0}}];
    let textHistoryIndex = 0;
    const keysDontPrint = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F12', 'F5', 'CapsLock', 'Meta'];

    let caretPosition = { line: 0, character: 0 };
    let caretX = textX;
    let caretY = textY;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function updateTextOnCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        // console.log(caretMeasurement)
        caretX = textX + caretMeasurement.width;
        caretY = textY + (fontSize + 5) * caretPosition.line;
        // console.log(caretX)
    }

    function redraw() {
        ctx.beginPath();
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
        coords.push([e.offsetX, e.offsetY]);
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.strokeStyle = lineColor;
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

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseout', endDrawing);

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 86:
                    pastText();
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
                    enterKeyAction();
                    saveToHistory();
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
                        addLetter(e.key);
                        saveToHistory();
                    }
                    break;
            }
        }
        updateTextOnCanvas();
    });

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
            // let textWidth = ctx.measureText(currentLine + letter).width;
            // let nCounter = 0;

// обычный ввод
                addLetterOnCaret(letter);
                // if (caretPosition.line === newLines.length - 1) newLines.push('!')
                for (let i = 0; i < newLines.length; i++){

                    // работа с 1 символом
                    if(newLines[i].length >= textWrapLimit) {
                        newLines[i].split(0, textWrapLimit)
                        // console.log(newLines[i].substring(0, textWrapLimit))
                        if (!newLines[i + 1]){
                            newLines[i + 1] = newLines[i].substring(textWrapLimit, newLines[i].length)
                            // console.log(newLines[i + 1])
                        } else {
                            newLines[i + 1] = newLines[i].substring(textWrapLimit, newLines[i].length) + newLines[i + 1]
                        }
                        if (caretPosition.character > textWrapLimit){
                            caretPosition.line++;
                            caretPosition.character = 1;
                        }
                        // console.log(newLines[i + 1])
                        newLines[i] = newLines[i].substring(0, textWrapLimit);


                        // console.log(newLines[i + 1][0], newLines[i][newLines[i].length - 1])
                        // newLines[i + 1][0].replace(newLines[i + 1][0] , newLines[i][newLines[i].length - 1]);
                        // newLines[i][newLines[i].length - 1]
                        // console.log(newLines[i][newLines[i].length - 1])
                    }
                }
                // console.log(newLines)
                text = newLines.join('\n');

        // console.log(text)


                // if (currentLine.length >= textWrapLimit){
                //
                //
                //
                //
                // }






        function addLetterOnCaret(letter) {
            newLine = currentLine.substring(0, caretPosition.character) + letter + currentLine.substring(caretPosition.character);
            // newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
            newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
            // console.log(newLines)
            currentLine = newLine;
            // text = newLines.join('\n');
            caretPosition.character++;
        }
    }

    // function addLetter(letter) {
    //     let newLine;
    //     let newLines;
    //     let currentLine = lines(caretPosition.line);
    //     let nextLine = lines(caretPosition.line + 1);
    //
    //     let textWidth = ctx.measureText(currentLine + letter).width;
    //
    //     function addLetterOnCaret(letter) {
    //         newLine = currentLine.substring(0, caretPosition.character) + letter + currentLine.substring(caretPosition.character);
    //         newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
    //         currentLine = newLine;
    //         text = newLines.join('\n');
    //         caretPosition.character++;
    //     }
    //
    //     if (textWidth >= textWrapLimit) {
    //         if (caretX >= textWrapLimit) {
    //             if (!lines(caretPosition.line + 1)) {
    //                 enterKeyAction();
    //                 addLetter(letter);
    //             } else {
    //                 console.log('caret wrap')
    //                 nextLine = letter + nextLine;
    //                 newLines = lines().map((line, index) => {
    //                     if (index === caretPosition.line) {
    //                         console.log('2) currentLine', currentLine)
    //                         console.log(lines())
    //                         return currentLine;
    //                     } else if (index === caretPosition.line + 1) {
    //                         console.log(index, caretPosition.line)
    //                         console.log(`2) на строку ${caretPosition.line + 1} добавим`, nextLine)
    //                         return nextLine;
    //                     } else {
    //                         console.log('2) line', line)
    //                         return line;
    //                     }
    //                 });
    //                 text = newLines.join('\n');
    //                 caretPosition.line++;
    //                 caretPosition.character = 1;
    //             }
    //         } else {
    //             console.log('1) врап в середине start')
    //             let lastChar = currentLine[currentLine.length - 1];
    //             // let nextLine = lines(caretPosition.line + 1);
    //             addLetterOnCaret(letter);
    //             console.log(letter)
    //             currentLine = currentLine.slice(0, currentLine.length - 1);
    //             nextLine = lastChar + nextLine;
    //             if (lines().length <= 1) {
    //                 console.log(`1.5) если ${lines().length} <= 1 буква в новую строку`)
    //                 newLines.push(lastChar)
    //             }
    //             newLines = newLines.map((line, index) => {
    //                 if (index === caretPosition.line) {
    //                     console.log('2) currentLine', currentLine)
    //                     console.log(lines())
    //                     return currentLine;
    //                 } else if (index === caretPosition.line + 1) {
    //                     console.log(index, caretPosition.line)
    //                     console.log(`2) на строку ${caretPosition.line + 1} добавим`, nextLine)
    //                     return nextLine;
    //                 } else {
    //                     console.log('2) line', line)
    //                     return line;
    //                 }
    //             });
    //             text = newLines.join('\n');
    //             console.log('end')
    //         }
    //     } else {
    //         console.log('simple')
    //         addLetterOnCaret(letter);
    //     }
    // }

//TODO добавить 4 пробела на таб

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

    function pastText(){
        getPasteText().then(str => {
            text += str;
            //TODO сделать возможность вставки в середине текста
            calculateCaretPosition();
            updateTextOnCanvas();
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

    saveBtn.addEventListener('click', function() {
        const canvasData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = canvasData;
        link.download = 'canvas_note_image.png';
        link.click();
    });

    updateTextOnCanvas();
});
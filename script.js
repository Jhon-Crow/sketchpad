document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var saveBtn = document.getElementById('saveBtn');
    var isDrawing = false;
    let text = '';
    const textWrapLimit = 100;
    let textLineCounter = 1;
    const coordsDisabledLimit = 2000;

    const caretColor = 'red';
    const fontColor = 'white';
    const lineColor = 'white';

    var textX = 10;
    var textY = 20;
    var fontSize = 14;
    var fontFamily = 'Arial';

    const coords = [];
    const coordsDisabled = [];
    const textHistory = [''];
    let textHistoryIndex = 0;
    const keysDontPrint = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F12', 'CapsLock', 'Meta'];

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
        caretX = textX + caretMeasurement.width;
        caretY = textY + (fontSize + 5) * caretPosition.line;
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
                case 90 :
                    if ((coords.length && coordsDisabled.length < coordsDisabledLimit) && e.getModifierState('CapsLock')){
                        coordsDisabled.push(coords?.pop());
                    } else if (textHistoryIndex > 0) {
                        textHistoryIndex--;
                        text = textHistory[textHistoryIndex];
                    }
                    break;
                case 89:
                    if (coordsDisabled.length && e.getModifierState('CapsLock')){
                        coords?.push(coordsDisabled?.pop());
                    } else if (textHistoryIndex < textHistory.length - 1) {
                        textHistoryIndex++;
                        text = textHistory[textHistoryIndex];
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (e.key) {
                case 'Enter':
                    enterKeyAction();
                    break;
                case 'Backspace':
                    delOnBackspace();
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
                        textHistory.push(text);
                        textHistoryIndex++;
                    }
                    break;
            }
        }
        updateTextOnCanvas();
    });

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

    function addLetter(letter) {
        let currentLine = lines(caretPosition.line);
        let newLine = currentLine.substring(0, caretPosition.character) + letter + currentLine.substring(caretPosition.character);
        let newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
        text = newLines.join('\n');
        caretPosition.character++;
    }

    function delOnBackspace() {
        let currentLine = lines(caretPosition.line);
        if (currentLine.length > 0 && caretPosition.character > 0) {
            let newLine = currentLine.substring(0, caretPosition.character - 1) + currentLine.substring(caretPosition.character);
            let newLines = lines().map((line, index) => index === caretPosition.line ? newLine : line);
            text = newLines.join('\n');
            caretPosition.character--;
        } else if (caretPosition.line > 0) {
            let previousLine = lines(caretPosition.line - 1);
            let newPreviousLine = previousLine + currentLine.substring(caretPosition.character);
            let newLines = lines().map((line, index) => index === caretPosition.line - 1 ? newPreviousLine : (index === caretPosition.line ? '' : line));
            text = newLines.join('\n');
            caretPosition.line--;
            caretPosition.character = newPreviousLine.length;
        }
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

    saveBtn.addEventListener('click', function() {
        const canvasData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = canvasData;
        link.download = 'canvas_note_image.png';
        link.click();
    });

    // Инициальный рендеринг текста
    updateTextOnCanvas();
});
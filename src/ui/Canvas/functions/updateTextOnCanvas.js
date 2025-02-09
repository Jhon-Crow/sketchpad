import {textArrToLines} from "./textArrToLines.js";

   export function checkLinesLimit(action, textArr, saveToHistory, linesLimit) {
        if (textArrToLines(textArr).length > linesLimit - 1) {
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


export function updateTextOnCanvas(
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
) {
    const drawBg = (ctx) => {
        ctx.fillStyle = isLight ? '#F2F0E7FF' : '#2A2A2B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBg(ctx);

    ctx.font = fontSize + 'px ' + fontFamily;

    // Получаем массив строк и массив цветов
    let lines = textArrToLines(textArr);
    let colors = textArr.flatMap(item => item.text.split('').map(() => item.color)); // Получаем массив цветов для каждого символа


    let y = textY;
    let countText = 0;
    let checkIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        let x = textX;

        for (let j = 0; j < lines[i].length; j++) {
            // Устанавливаем цвет для текущего символа
            ctx.fillStyle = colors[checkIndex];

            // Рисуем символ
            ctx.fillText(lines[i][j], x, y);
            let charWidth = ctx.measureText(lines[i][j]).width;
            x += charWidth; // Смещаем x для следующего символа
            checkIndex++; // Увеличиваем индекс цвета
            countText++;
        }

        y += fontSize + 5; // Переход на следующую строку
    }

    if (!isDrawing) {
        // console.log(caretX, caretY)
        calculateCaretPosition();
        ctx.fillStyle = fontColor;
        ctx.fillRect(caretX, caretY - fontSize, 1, fontSize); // Рисуем каретку
    }
    redraw();
}

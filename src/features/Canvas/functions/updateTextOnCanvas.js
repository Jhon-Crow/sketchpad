export function checkLinesLimit(action, textArr, saveToHistory, linesLimit) {
        if (textArr.length > linesLimit - 1) {
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

    let y = textY;

    for (let i = 0; i < textArr.length; i++) {
        let x = textX;

        for (let j = 0; j < textArr[i].length; j++) {
            ctx.fillStyle = textArr[i][j].color;

            ctx.font = textArr[i][j].fontSize + 'px ' + textArr[i][j].fontFamily;

            ctx.fillText(textArr[i][j].text, x, y);
            let charWidth = ctx.measureText(textArr[i][j].text).width;
            x += charWidth; // Смещаем x для следующего символа
        }

        y += fontSize + 5; // Переход на следующую строку
    }

    calculateCaretPosition();

    if (!isDrawing) {
        ctx.fillStyle = fontColor;
        ctx.fillRect(caretX, caretY - fontSize, 1, fontSize); // Рисуем каретку
    }
    redraw();
}

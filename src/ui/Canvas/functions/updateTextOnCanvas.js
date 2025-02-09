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
    // todo

    let lines = textArrToLines(textArr);
    let colors = textArr.map(i => i.color);
    // console.log(colors, lines)
    // let textObjs = textArr
    // console.log(textObjs)

    // let lines = textArr
    //     .map(item => item.text)
    //     .join(' ')
    //     .split('\n')
    //     .map(item => item.trim())
    // console.log(lines)
    // let lines = text.split('\n');

    let y = textY;
    let countText = 0;
    let checkIndex = 0;

    for (let i = 0; i < lines.length; i++) {
        let x = textX;
        for (let j = 0; j < lines[i].length; j++) {

            // todo переписать логику цвета
            // if (!colorAndIndex[checkIndex] || countText < colorAndIndex[checkIndex].index){
            //     ctx.fillStyle = colorAndIndex[checkIndex - 1].color;
            // } else if (countText >= colorAndIndex[checkIndex].index){
            //     ctx.fillStyle = colorAndIndex[checkIndex].color;
            //     checkIndex++;
            // }
            // ctx.fillStyle = fontColor;
            ctx.fillStyle = colors[checkIndex];
            // console.log(colors.length, checkIndex)
            ctx.fillText(lines[i][j], x, y);
            let charWidth = ctx.measureText(lines[i][j]).width;
            x += charWidth;
            checkIndex++;
            countText++;
        }
        // console.log(checkIndex, colors.length)

        y += fontSize + 5;
    }
    if (!isDrawing) {
        calculateCaretPosition();
        ctx.fillStyle = fontColor;
        ctx.fillRect(caretX, caretY - fontSize, 1, fontSize);
    }
    redraw();
}
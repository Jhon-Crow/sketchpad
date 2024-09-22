document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var saveBtn = document.getElementById('saveBtn');
    var isDrawing = false;
    let text = '';
    const textWrapLimit = 78;
    let textLineCounter = 1;
    // let textWrapCounter = textWrapLimit;
    const coordsDisabledLimit = 1000;
    const caretColor = 'red';
    const fontColor = 'white';
    const lineColor = 'white';
    var textX = 10;
    var textY = 20;
    var fontSize = 14;
    var fontFamily = 'Arial';
    const coords = [];
    const coordsDisabled = [];


    const keysDontPrint = ['Tab', 'Shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F12']

    // Настройка размеров canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Функция для обновления текста на холсте
    function updateTextOnCanvas() {
        // Очищаем весь холст перед перерисовкой
        ctx.clearRect(0, 0,
            canvas.width,
            canvas.height
        );


        if (text.length >= (textWrapLimit * textLineCounter)){
            textLineCounter++
            text += '\n';
        }
        if (text.length < (textWrapLimit * (textLineCounter - 1))){
            textLineCounter--;
        }


        // Рисуем текст, учитывая переносы строк
        ctx.font = fontSize + 'px ' + fontFamily;
        ctx.fillStyle = fontColor;
        let lines = text.split('\n');
        let y = textY;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], textX, y);
            y += fontSize + 5; // Добавляем немного пространства между строками
        }

        // Рисуем каретку, если мы не находимся в процессе рисования
        if (!isDrawing) {
            calculateCaretPosition();
            ctx.fillStyle = caretColor;
            ctx.fillRect(caretX, caretY - fontSize, 1, fontSize);
        }

        // Перерисовываем рисунок
        redraw();
    }



    function calculateCaretPosition() {
        let lines = text.split('\n');
        let currentLine = lines[lines.length - 1];
        const caretMeasurement = ctx.measureText(currentLine);
        caretX = textX + caretMeasurement.width;
        caretY = textY + (fontSize + 5) * (lines.length - 1); // Вычисляем Y для последней строки
    }

    // Функция для перерисовки рисунка
    function redraw() {
        ctx.beginPath();
        coords.forEach(function(coord) {
            if (coord === 'brake') {
                ctx.stroke();  // Завершаем текущий путь
                ctx.beginPath();  // Начинаем новый путь
            } else {
                ctx.lineTo(coord[0], coord[1]);
            }
        });
        ctx.stroke();  // Вызовем stroke после завершения всех линий
    }

    // Функции для рисования (startDrawing, draw, endDrawing) остаются без изменений
// Функция для начала рисования
    function startDrawing(e) {
        coords.push('brake');
        coordsDisabled.length = 0;
        coords.push([e.offsetX, e.offsetY])
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    // Функция для процесса рисования
    function draw(e) {
        if (!isDrawing) return;
        ctx.strokeStyle = lineColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        coords.push([e.offsetX, e.offsetY])
    }

    // Функция для окончания рисования
    function endDrawing() {
        if (isDrawing) {
            coords.push('brake')

            ctx.closePath();
            isDrawing = false;
        }
        // coords.push('brake')
    }
    // Обработчики событий для рисования на canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mouseout', endDrawing);

    // Обработчики событий для ввода текста
    document.addEventListener('keydown', function(e) {

        if(e.ctrlKey) {
            switch (e.keyCode) {
                case 90 :
                    if (coords.length && coordsDisabled.length < coordsDisabledLimit){
                        coordsDisabled.push(coords?.pop());
                    }
                    break;
                case 89:
                    if (coordsDisabled.length){
                        coords?.push(coordsDisabled?.pop());
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (e.key) {
                case 'Enter':
                    text += '\n';
                    break;
                case 'Backspace':
                    text = text.slice(0, -1);
                    break;
                    //TODO перемещение каретки с помощью стрелочек
                default:
                    if (!keysDontPrint.includes(e.key)) text += e.key;
                    break;
            }
        }
        updateTextOnCanvas(); // Обновляем текст и рисунок на холсте
    });

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



export function textArrToLines(textArr, lineNumber = null) {
    let linesArray = textArr
        .map(item => item.text)
        .join('')
        .split('\n')
        // .map(item => item.trim())
    if (lineNumber !== null) {
        return linesArray[lineNumber] || '';
    }
    return linesArray;
}

// function lines(lineNumber = null) {
//     let linesArray = text.split('\n');
//     if (lineNumber !== null) {
//         return linesArray[lineNumber] || '';
//     }
//     return linesArray;
// }
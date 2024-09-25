import React, {useEffect, useRef} from 'react';
import cls from './Canvas.module.scss'

const Canvas = ({caretColor, fontColor, lineColor, fontFamily, fontSize}) => {
    const canvasRef = useRef(null);
    let isDrawing = false;
    let text = '';
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth / 1.56;
        canvas.height = window.innerHeight / 1.05;

    }, []);
    return (
        <canvas id='canvas' ref={canvasRef} className={cls.Canvas}>

        </canvas>
    );
};

export default Canvas;
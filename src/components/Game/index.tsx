import React, {useRef, useEffect} from 'react';
import './style.scss';

interface GamePropsTypes {
  img: string;
}

function Game({img}: GamePropsTypes) {
  const canvas = useRef(null);
  const drawPart = (ctx: any, x: number, y: number, image: any) => {
    let height = 70;
    let width = 70;
    // ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+width);
    ctx.lineTo(x+width*0.3, y+height);
    // ctx.quadraticCurveTo(x+width*0.5, y+width, x+width*0.4, y+width*1.2);
    ctx.bezierCurveTo(x+width*0.65,y+height,x+width*0.2,y+height*1.3,x+width*0.5,y+height*1.3);
    ctx.bezierCurveTo(x+width*0.8,y+height*1.3,x+width*0.35,y+height,x+width*0.7,y+height);
    ctx.lineTo(x+width, y+height);
    ctx.lineTo(x+width, y+height*0.7);
    ctx.bezierCurveTo(x+width,y+height*0.35,x+width*1.3,y+height*0.8,x+width*1.3,y+height*0.5);
    ctx.bezierCurveTo(x+width*1.3,y+height*0.2,x+width,y+height*0.65,x+width,y+height*0.3);
    ctx.lineTo(x+height, y);
    ctx.closePath();
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(image, -200, 0, 1700, 700);
    ctx.restore();
  };
  const drawGame = (image: any) => {
    if (!canvas || !canvas.current) return;
    // @ts-ignore
    let ctx= canvas.current.getContext("2d");
    ctx.canvas.width = 900;
    ctx.canvas.height = 700;
    ctx.lineWidth=2;
    ctx.strokeStyle = "brawn";

    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j<=10; j++) {
        ctx.save();
        drawPart(ctx, 10 + i*100, 10 + j*100, image);
      }
    }

  }
  useEffect(()=> {
    let image = new Image();
    image.onload = function() {
      drawGame(image);
    };
    image.src= img;
  });


  return <canvas ref={canvas} className="game"/>
}

export default Game;
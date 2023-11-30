// const canvas = document.getElementById("jsCanvas");
// const ctx = canvas.getContext("2d");
// const colors = document.getElementsByClassName("jsColor");
// const range = document.getElementById("jsRange");
// const toolMode = document.querySelectorAll(".toolMode");
// const saveBtn = document.getElementById("jsSave");


// const INITIAL_COLOR = "#000000";
// const CANVAS_SIZE = 750;

// ctx.strokeStyle = "#2c2c2c";

// canvas.width = CANVAS_SIZE;
// canvas.height = CANVAS_SIZE;

// ctx.fillStyle = "white";
// ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

// ctx.strokeStyle = INITIAL_COLOR;
// ctx.fillStyle = INITIAL_COLOR;
// ctx.lineWidth = 10; /* 라인 굵기 */

// let painting = false;
// let filling = false;

// function stopPainting() {
//     painting = false;
// }

// function startPainting() {
//     painting = true;
// }

// function onMouseMove(event) {
//     const x = event.offsetX;
//     const y = event.offsetY;
//     if (!painting) {
//         ctx.beginPath();
//         ctx.moveTo(x, y);
//     } else{
//         ctx.lineTo(x, y);
//         ctx.stroke();
//     }
// }

// function handleColorClick(event) {
//   const color = event.target.style.backgroundColor;
//   ctx.strokeStyle = color;
//   ctx.fillStyle = color;
// }

// function handleRangeChange(event) {
//     const size = event.target.value;
//     ctx.lineWidth = size;
//   }

// function toolModeClick(menu) {
// 	if(1 == menu){
// 	 	filling=false;
// 	} else if(2 == menu) {
// 		filling=true;
// 	}
// }

// function handleCanvasClick() {
//     if (filling) {
//       ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
//     }
//   }

// // 우클릭 방지
// function handleCM(event) {
//    event.preventDefault();
//  }

// function handleSaveClick() {
//   const image = canvas.toDataURL("image/png");
//   const link = document.createElement("a");
//   link.href = image;
//   link.download = "PaintJS[EXPORT]";
//   link.click();
// }

// if (canvas) {
//     canvas.addEventListener("mousemove", onMouseMove);
//     canvas.addEventListener("mousedown", startPainting);
//     canvas.addEventListener("mouseup", stopPainting);
//     canvas.addEventListener("mouseleave", stopPainting);
//     canvas.addEventListener("click", handleCanvasClick);
//     canvas.addEventListener("contextmenu", handleCM);
// }

// Array.from(colors).forEach(color => 
//     color.addEventListener("click", handleColorClick));

    
// if (range) {
//     range.addEventListener("input", handleRangeChange);
// }
  
// toolMode[0].addEventListener("click", () => toolModeClick(1));

// toolMode[1].addEventListener("click", () => toolModeClick(2));

// if (saveBtn){
//   saveBtn.addEventListener("click", handleSaveClick);
// }


// 캔버스 공유 test
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const toolMode = document.querySelectorAll(".toolMode");
const saveBtn = document.getElementById("jsSave");

// paint.js 내에서 스크립트를 로드하는 방법
const script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.0.0/socket.io.min.js';
script.onload = () => {
  const socket = io();
  init(socket);
};
document.head.appendChild(script);

function init(socket) {
  const INITIAL_COLOR = "#000000";
  const CANVAS_SIZE = 750;

  ctx.strokeStyle = "#2c2c2c";

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.strokeStyle = INITIAL_COLOR;
  ctx.fillStyle = INITIAL_COLOR;
  ctx.lineWidth = 10; /* 라인 굵기 */

  let painting = false;
  let filling = false;

  function stopPainting() {
    painting = false;
  }

  function startPainting() {
    painting = true;
  }

  function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      // 클라이언트가 그림 그리기 이벤트를 서버로 전송
      emitDrawEvent({ x, y, mode: 'start' });
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      // 클라이언트가 그림 그리기 이벤트를 서버로 전송
      emitDrawEvent({ x, y, mode: 'draw', color: ctx.strokeStyle, size: ctx.lineWidth });
    }
  }

  function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    // 클라이언트가 색상 변경 이벤트를 서버로 전송
    emitDrawEvent({ color, mode: 'color' });
  }

  function handleRangeChange(event) {
    const size = event.target.value;
    ctx.lineWidth = size;
    // 클라이언트가 브러쉬 굵기 변경 이벤트를 서버로 전송
    emitDrawEvent({ size, mode: 'size' });
  }

  function toolModeClick(menu) {
    if (1 == menu) {
      filling = false;
    } else if (2 == menu) {
      filling = true;
    }
  }

  function handleCanvasClick() {
    if (filling) {
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      // 클라이언트가 그림 채우기 이벤트를 서버로 전송
      emitDrawEvent({ mode: 'fill' });
    }
  }

  // 우클릭 방지
  function handleCM(event) {
    event.preventDefault();
  }

  function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS[EXPORT]";
    link.click();
  }

  function emitDrawEvent(data) {
    // 클라이언트가 서버로 이벤트를 전송하는 함수
    socket.emit('draw', data);
  }

  // 서버로부터 받은 그림 그리기 이벤트 처리
  socket.on('draw', (data) => {
    switch (data.mode) {
      case 'start':
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
        break;
      case 'draw':
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
        break;
      case 'fill':
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        break;
      case 'color':
        ctx.strokeStyle = data.color;
        ctx.fillStyle = data.color;
        break;
      case 'size':
        ctx.lineWidth = data.size;
        break;
      // 추가적인 모드들에 대한 처리 추가 가능
    }
  });

  if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
  }

  Array.from(colors).forEach(color =>
    color.addEventListener("click", handleColorClick));

  if (range) {
    range.addEventListener("input", handleRangeChange);
  }

  toolMode[0].addEventListener("click", () => {
    toolModeClick(1);
    emitDrawEvent({ mode: 'brush' });
  });

  toolMode[1].addEventListener("click", () => {
    toolModeClick(2);
    emitDrawEvent({ mode: 'paint' });
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
  }
}

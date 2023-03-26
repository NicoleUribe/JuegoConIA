var kBoardWidth = 4;
var kBoardHeight= 4;
var kPieceWidth = 110;
var kPieceHeight= 110;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var gDrawingContext;

var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

var gCanvasElement;

var gMoveCountElem;

var kNegras = "#000000";
var kBlancas = "#ffffff";

function iniciarJuego(canvasElement, moveCountElement) {
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
   	//gCanvasElement.addEventListener("click", gestorClick, false);
    gMoveCountElem = moveCountElement;
    gDrawingContext = gCanvasElement.getContext("2d");
    newGame();
}

function newGame() {

    // Reiniciamos variables. 
    gNumMoves = 0;    
    gNumPieces = 8;    
    sonTablas = false; 
    acuerdoTablas = false; 
    turnoBlancas = true; 
    turnoNegras = false; 
    
    piezas = []; // Vaciamos la lista de piezas, por si estamos pulsando el resetButton. 

    // Añadimos las fichas negras en diagonal descendente de izquierda a derecha
    /*for (var i = 0; i < kBoardHeight; i++) {
        for (var j = 0; j < kBoardWidth; j++) {
            if (i === j) {
                piezas.push(new Casilla(i, j, kNegras));
            }
        }
    }*/

    
    piezas.push(new Casilla(0, 0, kNegras));
    piezas.push(new Casilla(1, 1, kNegras));
    piezas.push(new Casilla(2, 2, kNegras));
    piezas.push(new Casilla(3, 3, kNegras));
    
    piezas.push(new Casilla(3, 0, kBlancas));
    piezas.push(new Casilla(2, 1, kBlancas));
    piezas.push(new Casilla(1, 2, kBlancas));
    piezas.push(new Casilla(0, 3, kBlancas));



    // Añadimos las fichas blancas en diagonal ascendente de izquierda a derecha
    /*for (var i = 3 - 1; i >= 0; i--) {
        for (var j = 0; j < kBoardWidth; j++) {
            if ((i + j) % 2 === 0) {
                piezas.push(new Casilla(i, j, kBlancas));
            }
        }
    }*/

    gNumPieces = piezas.length;
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    gMoveCount = 0;
    gGameInProgress = false; 
    
    turnoBlancas = true; 
    turnoNegras = false;  
    
    drawBoard();
    gGameInProgress = true;  
}


function inicioNegras(){
	document.getElementById("moveBlancas").innerHTML = "<h3>Blancas</h3>"; 
	document.getElementById("moveNegras").innerHTML = "<h3>Negras</h3>"; 
	
	document.getElementById("esTurno").innerHTML = "Inicio Negras toca Blancas:"; 
}

function Casilla(row, column, color) {
    this.row = row;
    this.column = column;
    this.color = color;
}

function drawBoard() {

    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    gDrawingContext.beginPath();
   
    /* vertical lines */
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
		gDrawingContext.moveTo(0.5 + x, 0);
		gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    
    /* horizontal lines */
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
		gDrawingContext.moveTo(0, 0.5 + y);
		gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    /* draw it! */
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
    
    for (var i = 0; i < piezas.length; i++) {
			drawPiece(piezas[i], piezas[i].color, i == gSelectedPieceIndex);
    }

    gMoveCountElem.innerHTML = gMoveCount;
	
	if (gGameInProgress && isTheGameOver()) {
		endGame();
    } 
}


function drawPiece(p, color, selected) {
    var column = p.column;
    var row = p.row;
    var x = (column * kPieceWidth) + (kPieceWidth/2);
    var y = (row * kPieceHeight) + (kPieceHeight/2);
    var radius = (kPieceWidth/2) - (kPieceWidth/10);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    gDrawingContext.closePath();
    gDrawingContext.fillStyle = color;
    gDrawingContext.fill();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
    if (selected) {
		gDrawingContext.fillStyle = "#ff0000";
		gDrawingContext.fill();
    }
}
var matrixX = 4;
var matrixY= 4;
var tokenX = 110;
var tokenY= 110;
var pixelX = 1 + (matrixX * tokenX);
var DrawingContext;
var piezas = [];
var pixelY= 1 + (matrixY * tokenY);

var gCanvasElement;

var selectedPiece = null;

var gSelectedPieceIndex;
var gSelectedPieceHasMoved;
var gDragging;
var gDraggingOffsetX;
var gDraggingOffsetY;

var black= "#000000";
var white= "#ffffff";
var empty = "#ccc";
var gMoveCountElem;
var color;
//0=vacio
//1=negro
//2=blanco
var matrix = [[["A1",1],["B1",0],["C1",0],["D1",2]],
              [["A2",0],["B2",1],["C2",2],["D2",0]],
              [["A3",0],["B3",2],["C3",1],["D3",0]],
              [["A4",2],["B4",0],["C4",0],["D4",1]]];


var gSelectedPieceIndex = -1;
var gCursorRow;
var gCursorColumn;
var gGameInProgress = true;
var gMoveCount = 0;

function iniciarJuego(canvasElement, moveCountElement) {
    gCanvasElement = canvasElement;
    gCanvasElement.width = pixelX;
    gCanvasElement.height = pixelY;
    gMoveCountElem = moveCountElement;
    DrawingContext = gCanvasElement.getContext("2d");
    drawMatrix(matrix);

    gCanvasElement.addEventListener("mousedown", handleMouseDown, false);
    gCanvasElement.addEventListener("mousemove", handleMouseMove, false);
    gCanvasElement.addEventListener("mouseup", handleMouseUp, false);
}

function drawMatrix(matrix){
    for (var i=0; i< 4; i++){
		for (var j=0;j< 4; j++) {
            if(matrix[i][j][1]!=0)
			piezas.push(new Casilla(i,j, defColor(matrix[i][j][1])));
		}
	}
    gSelectedPieceIndex = -1;
	drawBoard();
}
function defColor(color){
    if(color=='1')
    return black;
    if(color=='2')
    return white;
    
}
function Casilla(row, column, color) {
    this.row = row;
    this.column = column;
    this.color = color;
}

function drawBoard() {

    DrawingContext.clearRect(0, 0, pixelX, pixelY);

    DrawingContext.beginPath();
   
    /* vertical lines */
    for (var x = 0; x <= pixelX; x += tokenX) {
		DrawingContext.moveTo(0.5 + x, 0);
		DrawingContext.lineTo(0.5 + x, pixelY);
    }
    
    /* horizontal lines */
    for (var y = 0; y <= pixelY; y += tokenY) {
		DrawingContext.moveTo(0, 0.5 + y);
		DrawingContext.lineTo(pixelX, 0.5 +  y);
    }
    
    /* draw it! */
    DrawingContext.strokeStyle = "#ccc";
    DrawingContext.stroke();
    
    for (var i = 0; i < piezas.length; i++) {
			drawPiece(piezas[i], piezas[i].color, i == gSelectedPieceIndex);
    }

    gMoveCountElem.innerHTML = gMoveCount;
	
	/*if (gGameInProgress && isTheGameOver()) {
		endGame();
    } */
}
function drawPiece(p, color, selected) {
    var column = p.column;
    var row = p.row;
    var x = (column * tokenX) + (tokenX/2);
    var y = (row * tokenY) + (tokenY/2);
    var radius = (tokenX/2) - (tokenX/10);
    DrawingContext.beginPath();
    DrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    DrawingContext.closePath();
    DrawingContext.fillStyle = color;
    DrawingContext.fill();
    DrawingContext.strokeStyle = "#000";
    DrawingContext.stroke();
    if (selected) {
		DrawingContext.fillStyle = "#ff0000";
		DrawingContext.fill();
    }
}
//MOVIMIENTO DE LA FICHA

function handleMouseDown(e) {
    var rect = gCanvasElement.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var columnIndex = Math.floor(x / tokenX);
    var rowIndex = Math.floor(y / tokenY);
    var pieceIndex = getPieceIndex(rowIndex, columnIndex);

    if (pieceIndex != -1) {
        selectedPiece = piezas[pieceIndex];
        gSelectedPieceIndex = pieceIndex;
        drawBoard();
    }
}

function handleMouseMove(e) {
    if (gDragging) {
        var x = e.pageX - gCanvasElement.offsetLeft - gDraggingOffsetX;
        var y = e.pageY - gCanvasElement.offsetTop - gDraggingOffsetY;
        piezas[gSelectedPieceIndex].column = Math.floor(x / tokenX);
        piezas[gSelectedPieceIndex].row = Math.floor(y / tokenY);
        gSelectedPieceHasMoved = true;
        drawBoard();
    }
}

function handleMouseUp(e) {
    if (selectedPiece !== null) {
        var rect = gCanvasElement.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var newColumnIndex = Math.floor(x / tokenX);
        var newRowIndex = Math.floor(y / tokenY);
        var newPieceIndex = getPieceIndex(newRowIndex, newColumnIndex);

        if (isValidMove(selectedPiece, newRowIndex, newColumnIndex)) {
            movePiece(selectedPiece, newRowIndex, newColumnIndex);
            console.log("Moved piece from (" + selectedPiece.row + ", " + selectedPiece.column + ") to (" + newRowIndex + ", " + newColumnIndex + ")");
            selectedPiece = null;
            gSelectedPieceIndex = -1;
            drawBoard();
        }
    }
}
function getPieceIndex(row, column) {
    for (var i = 0; i < piezas.length; i++) {
        if (piezas[i].row === row && piezas[i].column === column) {
            return i;
        }
    }
    return -1;
}


function isValidMove(piece, newRow, newColumn) {
    if (matrix[newRow][newColumn][1] != 0) {
        return false;
    }
    var rowDiff = Math.abs(piece.row - newRow);
    var colDiff = Math.abs(piece.column - newColumn);
    if (rowDiff > 1 || colDiff > 1 || rowDiff == colDiff) {
        return false;
    }
    return true;
}
function movePiece(piece, newRow, newColumn) {
    matrix[piece.row][piece.column][1] = 0;
    matrix[newRow][newColumn][1] = piece.color == black ? 1 : 2;
    piece.row = newRow;
    piece.column = newColumn;
}


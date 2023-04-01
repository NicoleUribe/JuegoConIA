var matrixX = 4;
var matrixY= 4;
var tokenX = 110;
var tokenY= 110;
var pixelX = 1 + (matrixX * tokenX);
var DrawingContext;
var piezas = [];
var pixelY= 1 + (matrixY * tokenY);
var turnWhite = false;
var turnBlack = true;
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
var matrix = [[["A,1",1],["B,1",0],["C,1",0],["D,1",2]],
              [["A,2",0],["B,2",1],["C,2",2],["D,2",0]],
              [["A,3",0],["B,3",2],["C,3",1],["D,3",0]],
              [["A,4",2],["B,4",0],["C,4",0],["D,4",1]]];


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
function turn(){
	if (turnBlack){
		turnBlack=false; 
		turnWhite=true; 
        document.getElementById("esTurno").innerHTML = "Blancas mueven:"; 
	}
	else {
		turnBlack=true; 
		turnWhite=false; 
        document.getElementById("esTurno").innerHTML = "Negras mueven:"; 
	}
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
    var index = Index(x, y);
    var pieceIndex = getPieceIndex(index[0], index[1]);
  
    if (pieceIndex != -1) {
      selectedPiece = piezas[pieceIndex];
      gSelectedPieceIndex = pieceIndex;
      drawBoard();
      /*var rightPosition = getRightPosition(gSelectedPieceIndex);
      console.log("Derecha position: ", rightPosition)
      var leftPosition = getLeftPosition(gSelectedPieceIndex);
      console.log("Izquierda position: ", leftPosition);
      var topPosition = getTopPosition(gSelectedPieceIndex);
      console.log("Arriba position: ", topPosition);
      var bottomPosition = getBottomPosition(gSelectedPieceIndex);
      console.log("Abajo position: ", bottomPosition);
      var upperRightPosition = getDiagonalBottomRightPosition(gSelectedPieceIndex);
      console.log("Arriba a la izquierda position: ", upperRightPosition);*/
    }
  }
  
function Index(x,y){
    var columnIndex = Math.floor(x / tokenX);
    var rowIndex = Math.floor(y / tokenY);
    return [rowIndex,columnIndex];
}
function handleMouseMove(e) {
    console.log("handleMouseMove se utilizo")
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
        move(newRowIndex,newColumnIndex);
        winner();

    }
}
function move(newRowIndex,newColumnIndex){
    if (isValidMove(selectedPiece, newRowIndex, newColumnIndex)) {
        console.log("Moved piece from ("+matrix[selectedPiece.row][selectedPiece.column][0] +") to (" + matrix[newRowIndex][newColumnIndex][0] + ")");
        movePiece(selectedPiece, newRowIndex, newColumnIndex);
          selectedPiece = null;
         gSelectedPieceIndex = -1;
         drawBoard();
         gMoveCount++;
         gMoveCountElem.innerHTML = gMoveCount;
         localStorage.setItem("numMove", gMoveCount);
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
    if(matrix[piece.row][piece.column][1]==1 && turnWhite ==true){
        alert("No es tu turno"); 
        return false;
    }
    if(matrix[piece.row][piece.column][1]==2 && turnBlack==true){
        alert("No es tu turno"); 
        return false;
    }
    if (matrix[newRow][newColumn][1] != 0 ){
        return false;
    }
    var validMoves = [];
    var top = getTopPosition(getPieceIndex(piece.row, piece.column));
    var bottom = getBottomPosition(getPieceIndex(piece.row, piece.column));
    var right = getRightPosition(getPieceIndex(piece.row, piece.column));
    var left = getLeftPosition(getPieceIndex(piece.row, piece.column));
    var topRight = getDiagonalTopRightPosition(getPieceIndex(piece.row, piece.column));
    var topLeft = getDiagonalTopLeftPosition(getPieceIndex(piece.row, piece.column));
    var bottomLeft = getDiagonalBottomLeftPosition(getPieceIndex(piece.row, piece.column));
    var bottomRight = getDiagonalBottomRightPosition(getPieceIndex(piece.row, piece.column));


    if (right[0] >= 0 && right[1] < matrixX) {
        validMoves.push(right);
    }
    if (left[0] >= 0 && left[1] >= 0) {
        validMoves.push(left);
    }
    if (top[0] >= 0) {
        validMoves.push(top);
    }
    if (bottom[0] < matrixY) {
        validMoves.push(bottom);
    }
    if (topRight[0] >= 0 && topRight[1] < matrixX) {
        validMoves.push(topRight);
    }
    if (topLeft[0] >= 0 && topLeft[1] >= 0) {
        validMoves.push(topLeft);
    }
    if (bottomLeft[0] < matrixY && bottomLeft[1] >= 0) {
        validMoves.push(bottomLeft);
    }
    if (bottomRight[0] < matrixY && bottomRight[1] < matrixX) {
        validMoves.push(bottomRight);
    }

    if (newRow === piece.row && newColumn === piece.column) {
        alert("Movimiento invalido")
        return false;
    }
    if (!validMoves.some(move => move[0] === newRow && move[1] === newColumn)) {
        alert("Movimiento invalido")
        return false;
    }
    console.log("Movimiento valido")
    return true;
}

function winner(){
  var resultado;
   if(checkCorners(1) || checkVertical(1) || checkHorizontal(1)){
    alert("G A N O     N E G R O");
    resultado=window.confirm('quiere ver los resultados?');
    if(resultado===true){
      window.alert('el numero de movimientos fue '+gMoveCount);
      window.location.reload();
    }
    else
      window.location.reload();
   }
   if(checkCorners(2) || checkVertical(2) || checkHorizontal(2)){
    alert("G A N O     B L A N C O ");
    resultado=window.confirm('quiere ver los resultados?');
    if(resultado===true){
      window.alert('el numero de movimientos fue '+gMoveCount);
      window.location.reload();
    }
    else
      window.location.reload();
   }

   if (checkSquare(1) || checkSquare(2)) {
    alert("Ganó un jugador formando un cuadrado de fichas del mismo color.");
    resultado=window.confirm('¿Quiere ver los resultados?');
    if(resultado===true){
      window.alert('El número de movimientos fue '+gMoveCount);
      window.location.reload();
    } else {
      window.location.reload();
    }
  }
  

}
function checkHorizontal(color){
  for(var i=0; i<4;i++){
    if(matrix[i][0][1]==color && matrix[i][1][1]==color && matrix[i][2][1]==color && matrix[i][3][1]==color)
    return true;
  }  
  return false;
}
function checkVertical(color){
  for(var i=0; i<4;i++){
    if(matrix[0][i][1]==color && matrix[1][i][1]==color && matrix[2][i][1]==color && matrix[3][i][1]==color)
    return true;
  }  
  return false;
}
function checkCorners(color){
  if(matrix[0][0][1]==color && matrix[0][3][1]==color && matrix[3][0][1]==color && matrix[3][3][1]==color)
   return true;
  return false;
}

function checkSquare(color) {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (matrix[i][j][1] == color && i + 1 < 4 && j + 1 < 4 && matrix[i+1][j][1] == color && matrix[i][j+1][1] == color && matrix[i+1][j+1][1] == color) {
        return true;
      }
    }
  }
  return false;
}



function movePiece(piece, newRow, newColumn) {
    turn();
    matrix[piece.row][piece.column][1] = 0;
    matrix[newRow][newColumn][1] = piece.color == black ? 1 : 2;

    // determine direction of movement
    //var rowDiff = newRow - piece.row;
    //var colDiff = newColumn - piece.column;
    var direction = getDirection(piece.row,piece.column,newRow,newColumn);


    piece.row = newRow;
    piece.column = newColumn;

   // console.log("La ficha se movió hacia " + direction);
}


function getDirection(currentRow, currentColumn, newRow, newColumn) {
    var rowDiff = newRow - currentRow;
    var colDiff = newColumn - currentColumn;
    
    if (rowDiff == -1 && colDiff == 0) {
        return "arriba";
    } else if (rowDiff == 1 && colDiff == 0) {
        return "abajo";
    } else if (rowDiff == 0 && colDiff == -1) {
        return "izquierda";
    } else if (rowDiff == 0 && colDiff == 1) {
        return "derecha";
    } else if (rowDiff == -1 && colDiff == 1) {
        return "diagonal arriba derecha";
    } else if (rowDiff == 1 && colDiff == 1) {
        return "diagonal abajo derecha";
    } else if (rowDiff == -1 && colDiff == -1) {
        return "diagonal arriba izquierda";
    } else if (rowDiff == 1 && colDiff == -1) {
        return "diagonal abajo izquierda";
    } else {
        return "";
    }
}

//obtener las posiciones disponibles
// arriba abajo izquierda derecha
function getBottomPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var bottomRow = matrixY - 1;
    for (var row = selectedRow + 1; row <= bottomRow; row++) {
      if (matrix[row][selectedColumn][1] == 0) {
        continue;
      } else {
        return [row - 1, selectedColumn];
      }
    }
    return [bottomRow, selectedColumn];
  }

  function getTopPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var topRow = 0;
    for (var row = selectedRow - 1; row >= topRow; row--) {
        if (matrix[row][selectedColumn][1] == 0) {
            continue;
        } else {
            return [row + 1, selectedColumn];
        }
    }
    return [topRow, selectedColumn];
}

function getLeftPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var leftColumn = 0;
    for (var column = selectedColumn - 1; column >= leftColumn; column--) {
      if (matrix[selectedRow][column][1] == 0) {
        continue;
      } else {
        return [selectedRow, column + 1];
      }
    }
    return [selectedRow, leftColumn];
}

function getRightPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var rightColumn = matrixX - 1;
    for (var col = selectedColumn + 1; col <= rightColumn; col++) {
      if (matrix[selectedRow][col][1] == 0) {
        continue;
      } else {
        return [selectedRow, col - 1];
      }
    }
    return [selectedRow, rightColumn];
  }
  //Diagonales
  
  function getDiagonalTopRightPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var topRow = 0;
    var rightColumn = matrixX - 1;
    var lastRow = selectedRow;
    var lastColumn = selectedColumn;
  
    for (var row = selectedRow - 1, column = selectedColumn + 1; row >= topRow && column <= rightColumn; row--, column++) {
      if (matrix[row][column][1] == 0) {
        lastRow = row;
        lastColumn = column;
      } else {
        break;
      }
    }
    
    return [lastRow, lastColumn];
  }
  
  function getDiagonalTopLeftPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var topRow = 0;
    var leftColumn = 0;
    var lastRow = selectedRow;
    var lastColumn = selectedColumn;
  
    for (var row = selectedRow - 1, column = selectedColumn - 1; row >= topRow && column >= leftColumn; row--, column--) {
      if (matrix[row][column][1] == 0) {
        lastRow = row;
        lastColumn = column;
      } else {
        break;
      }
    }
    
    return [lastRow, lastColumn];
  }
  
  function getDiagonalBottomLeftPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var bottomRow = matrixY - 1;
    var leftColumn = 0;
    var lastRow = selectedRow;
    var lastColumn = selectedColumn;
  
    for (var row = selectedRow + 1, column = selectedColumn - 1; row <= bottomRow && column >= leftColumn; row++, column--) {
      if (matrix[row][column][1] == 0) {
        lastRow = row;
        lastColumn = column;
      } else {
        break;
      }
    }
  
    return [lastRow, lastColumn];
  }
  
  function getDiagonalBottomRightPosition(pieceIndex) {
    var selectedRow = piezas[pieceIndex].row;
    var selectedColumn = piezas[pieceIndex].column;
    var bottomRow = matrixY - 1;
    var rightColumn = matrixX - 1;
    var lastRow = selectedRow;
    var lastColumn = selectedColumn;
  
    for (var row = selectedRow + 1, column = selectedColumn + 1; row <= bottomRow && column <= rightColumn; row++, column++) {
      if (matrix[row][column][1] == 0) {
        lastRow = row;
        lastColumn = column;
      } else {
        break;
      }
    }
  
    return [lastRow, lastColumn];
  }
  
  
  

  
  

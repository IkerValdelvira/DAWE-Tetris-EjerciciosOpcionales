// ************************************
// *     EJERCICIO 1                   *
// ************************************


// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;    
}

// ============== Rectangle ====================
function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle.prototype.draw = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que 
	// en este ejemplo la variable ctx es global y que guarda el contexto (context) 
	// para pintar en el canvas.
	ctx.beginPath();
    ctx.rect(this.px, this.py, this.width, this.height);
    ctx.lineWidth = this.lineWidth;
	ctx.strokeStyle = 'black';
	ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
}

// Pintar un bloque de una pieza en el canvas 'next'
Rectangle.prototype.draw_next = function() {
	next_ctx.beginPath();
	next_ctx.rect(this.px, this.py, this.width, this.height);
	next_ctx.lineWidth = this.lineWidth;
	next_ctx.strokeStyle = 'black';
	next_ctx.fillStyle = this.color;
	next_ctx.fill();
	next_ctx.stroke();
}


Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

/** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw();
}

/** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.erase = function(){
	ctx.beginPath();
	ctx.lineWidth = this.lineWidth+2;
	ctx.strokeStyle = Tetris.BOARD_COLOR;
	ctx.rect(this.px, this.py, this.width, this.height);
	ctx.stroke();
	ctx.fillStyle = Tetris.BOARD_COLOR;
	ctx.fill()

}


// ============== Block ===============================

function Block (pos, color) {

	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color. Pos = posición de la casilla, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea, respectivamente.
	this.x = pos.x;
	this.y = pos.y;
	
	var punto1_x = this.x * Block.BLOCK_SIZE;
	var punto1_y = this.y * Block.BLOCK_SIZE;
	var punto1 = new Point(punto1_x, punto1_y);
	
	var punto2_x = (this.x * Block.BLOCK_SIZE) + Block.BLOCK_SIZE;
	var punto2_y = (this.y * Block.BLOCK_SIZE) + Block.BLOCK_SIZE;
    var punto2 = new Point(punto2_x, punto2_y);
	
    this.init(punto1, punto2);
	
	this.setLineWidth(Block.OUTLINE_WIDTH);
	this.setFill(color);
}

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;

// TU CÓDIGO AQUÍ: emplea el patrón de herencia (Block es un Rectangle)
Block.prototype = new Rectangle();
Block.prototype.constructor = Block;

/** Método introducido en el EJERCICIO 4 */

Block.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;

	Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

 /**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Block.prototype.can_move = function(board, dx, dy) {
	// TU CÓDIGO AQUÍ: toma como parámetro un increment (dx,dy)
	// e indica si es posible mover el bloque actual si 
	// incrementáramos su posición en ese valor
	return board.can_move(this.x + dx, this.y + dy);
}

// ************************************
// *      EJERCICIO 2                  *
// ************************************

function Shape() {}


Shape.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array
	this.blocks = []
	coords.forEach(coord => this.blocks.push(new Block(coord, color)));
	
	/*8 Atributo introducido en el EJERCICIO 8*/
	this.rotation_dir = 1;

};

Shape.prototype.draw = function() {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	this.blocks.forEach(block => block.draw());

};

// Pintar la pieza en el canvas 'next'
Shape.prototype.draw_next = function() {
	this.blocks.forEach(block => block.draw_next());
};

 /**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Shape.prototype.can_move = function(board, dx, dy) {
// TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza
	for(var i=0; i<this.blocks.length; i++) {
		if(!this.blocks[i].can_move(board, dx, dy)){
			return false;
		}
	}
	return true;
};

/* Método introducido en el EJERCICIO 8 */

Shape.prototype.can_rotate = function(board) {

	//  TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
	// la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
	// devolver false. En caso contrario, true.
	var can_rotate = true;
	for(var i=0; i<this.blocks.length; i++){
		var block = this.blocks[i];
		var x = this.center_block.x - this.rotation_dir*this.center_block.y + this.rotation_dir*block.y;
		var y = this.center_block.y + this.rotation_dir*this.center_block.x - this.rotation_dir*block.x
		if(!board.can_move(x,y)){
			can_rotate = false;
			break;
		}
	}
	return can_rotate;
};

/* Método introducido en el EJERCICIO 8 */

Shape.prototype.rotate = function() {

	// TU CÓDIGO AQUÍ: básicamente tienes que aplicar la fórmula de rotación
	// (que se muestra en el enunciado de la práctica) a todos los bloques de la pieza 
	
	for(var i=0; i<this.blocks.length; i++){
		this.blocks[i].erase();
	}
	
	for(var i=0; i<this.blocks.length; i++){
		var block = this.blocks[i];
		var x = this.center_block.x - this.rotation_dir*this.center_block.y + this.rotation_dir*block.y;
		var y = this.center_block.y + this.rotation_dir*this.center_block.x - this.rotation_dir*block.x
		block.move(x - block.x, y - block.y);
	}

	/* Deja este código al final. Por defecto las piezas deben oscilar en su
     movimiento, aunque no siempre es así (de ahí que haya que comprobarlo) */
    if (this.shift_rotation_dir)
            this.rotation_dir *= -1
};

/* Método introducido en el EJERCICIO 4 */

Shape.prototype.move = function(dx, dy) {
   
	for (block of this.blocks) {
		block.erase();
	}

	for (block of this.blocks) {
		block.move(dx,dy);
	}
};


// ============= I_Shape ================================
function I_Shape(center) {
	var coords = [new Point(center.x - 2, center.y),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];
    
	Shape.prototype.init.call(this, coords, "blue");   

	/* Atributo introducido en el ejercicio 8*/
	this.shift_rotation_dir = true;
	this.center_block = this.blocks[2];

}

// TU CÓDIGO AQUÍ: La clase I_Shape hereda de la clase Shape
I_Shape.prototype = new Shape();
I_Shape.prototype.constructor = I_Shape;


// =============== J_Shape =============================
function J_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar J_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x + 1, center.y),
               new Point(center.x + 1, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "orange");
	
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
	this.center_block = this.blocks[1];
	
}

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape
J_Shape.prototype = new Shape();
J_Shape.prototype.constructor = J_Shape;

// ============ L Shape ===========================
function L_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y + 1),
               new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x + 1, center.y)];
    
    Shape.prototype.init.call(this, coords, "cyan");
	
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
    this.center_block = this.blocks[2];
 
}

// TU CÓDIGO AQUÍ: La clase L_Shape hereda de la clase Shape
L_Shape.prototype = new Shape();
L_Shape.prototype.constructor = L_Shape;

// ============ O Shape ===========================
function O_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar O_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x - 1, center.y + 1),
               new Point(center.x, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "red");
	
	/* atributo introducido en el EJERCICIO 8 */
    this.center_block = this.blocks[1];

}

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
O_Shape.prototype = new Shape();
O_Shape.prototype.constructor = O_Shape;

/* Código introducido en el EJERCICIO 8*/
// O_Shape la pieza no rota. Sobreescribiremos el método can_rotate que ha heredado de la clase Shape

O_Shape.prototype.can_rotate = function(board){
	return false;
};

// ============ S Shape ===========================
function S_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y + 1),
               new Point(center.x, center.y + 1),
               new Point(center.x, center.y),
               new Point(center.x + 1, center.y)];
    
    Shape.prototype.init.call(this, coords, "green");
	
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = true;
	this.center_block = this.blocks[0];
}

// TU CÓDIGO AQUÍ: La clase S_Shape hereda de la clase Shape
S_Shape.prototype = new Shape();
S_Shape.prototype.constructor = S_Shape;

// ============ T Shape ===========================
function T_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x, center.y + 1),
               new Point(center.x + 1, center.y)];
    
    Shape.prototype.init.call(this, coords, "yellow");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = false;
       this.center_block = this.blocks[1];
}

// TU CÓDIGO AQUÍ: La clase T_Shape hereda de la clase Shape
T_Shape.prototype = new Shape();
T_Shape.prototype.constructor = T_Shape;

// ============ Z Shape ===========================
function Z_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x, center.y + 1),
               new Point(center.x + 1, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "magenta");
	
	/* atributo introducido en el EJERCICIO 8 */
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[1];
}

// TU CÓDIGO AQUÍ: La clase Z_Shape hereda de la clase Shape
Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor = Z_Shape;

// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== BOARD ================

function Board(width, height) {
	this.width = width;
	this.height = height;
	this.grid = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6 */
	this.score = 0; // Guarda la puntuación en la partida
	this.score_aux = 0; // Se reinicia cada vez que score llega a 20 (+1 level)
	this.score_element = document.getElementById("score");
	this.score_element.innerHTML = "SCORE: " + this.score;
	this.level = 1;
	this.level_element = document.getElementById("level");
	this.level_element.innerHTML = "&nbsp &nbsp &nbsp LEVEL: " + this.level;
}


// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false

Board.prototype.draw_shape = function(shape){
	if (shape.can_move(this,0,0)){
		shape.draw();
		return true;
	}
	return false;
}

Board.prototype.draw_next_shape = function(shape){
	// Borra la pieza anterior del canvas
	next_ctx.clearRect(0, 0, next_canvas.width, next_canvas.height);

	// Pinta la nueva pieza en el canvas
	shape.draw_next();
}

 /*****************************
 *	 EJERCICIO 6          *
 *****************************/

Board.prototype.add_shape = function(shape){

	// TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid
	for(var i=0; i<shape.blocks.length; i++) {
		var block = shape.blocks[i];
		var key = "(" + block.x + "," + block.y + ")";
		this.grid[key] = block;
	}
}

// ****************************
// *     EJERCICIO 5          *
// ****************************

Board.prototype.can_move = function(x,y){

 	// TU CÓDIGO AQUÍ: 
 	// hasta ahora, este método siempre devolvía el valor true. Ahora,
 	// comprueba si la posición que se le pasa como párametro está dentro de los  
	// límites del tablero y en función de ello, devuelve true o false.
	if(x<0 || x>=this.width || y<0 || y>=this.height){
		return false;
	}
	
	/* EJERCICIO 7 */
	// TU CÓDIGO AQUÍ: código para detectar colisiones. Si la posición x,y está en el diccionario grid, devolver false y true en cualquier otro caso.
	else if(("(" + x + "," + y + ")") in this.grid){
		return false;
	}
	else{
		return true;
	}
};

Board.prototype.is_row_complete = function(y){
	// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
	// es completa o no (se busca en el grid).
	var is_row_complete = true;
	for(var x=0; x<this.width; x++){
		var casilla = "(" + x + "," + y + ")";
		if(!(casilla in this.grid)){
			is_row_complete = false;
			break;
		}
	}
	return is_row_complete;
};

Board.prototype.delete_row = function(y){
	// TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los bloques de la fila y 
	for(var x=0; x<this.width; x++){
		var casilla = "(" + x + "," + y + ")";
		if(casilla in this.grid){
			var block = this.grid[casilla];
			delete(this.grid[casilla]);
			block.erase();

		}		
	}
};

Board.prototype.move_down_rows = function(y_start){
	// TU CÓDIGO AQUÍ: 
	//  empezando en la fila y_start y hasta la fila 0
	//    para todas las casillas de esa fila
	//       si la casilla está en el grid  (hay bloque en esa casilla)
	//          borrar el bloque del grid
	//          
	//          mientras se pueda mover el bloque hacia abajo
	//              mover el bloque hacia abajo
	//          
	//          meter el bloque en la nueva posición del grid

	for(var y=y_start; y>=0; y--){
		for(var x=0; x<this.width; x++){
			var casilla = "(" + x + "," + y + ")";
			if(casilla in this.grid){
				var block = this.grid[casilla];
				delete(this.grid[casilla]);
				
				while(block.can_move(this,0,1)){
					block.erase();
					block.move(0,1);
				}
				
				var casilla_nueva = "(" + block.x + "," + block.y + ")";
				this.grid[casilla_nueva] = block;
			}
			
		}
	}
};

Board.prototype.remove_complete_rows = function(){
	// TU CÓDIGO AQUÍ:
	// Para toda fila y del tablero
	//   si la fila y está completa
	//      borrar fila y
	//      mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )

	var level_up = false;	// Variable que se devuelve indicando si se ha aumentado de nivel

	var removed_cont = 0;
	for(var y=0; y<this.height; y++){
		if(this.is_row_complete(y)){
			this.delete_row(y);
			this.move_down_rows(y-1);
			removed_cont += 1;
		}
	}

	// Se va incrementando el score dependiendo de las filas que se borran a la vez
	if(removed_cont == 1){
		this.score += 1;
		this.score_aux += 1;
	}
	else if(removed_cont == 2){
		this.score += 5;
		this.score_aux += 5;
	}
	else if(removed_cont == 3){
		this.score += 10;
		this.score_aux += 10;
	}
	else if(removed_cont >= 4){
		this.score += 15;
		this.score_aux += 15;
	}

	// Se va incrementando el nivel por cada 20 puntos del score
	if(this.score_aux >= 20) {
		this.level += 1;
		level_up = true;
		this.score_aux -= 20;
	}

	this.score_element.innerHTML = "SCORE: " + this.score;
	this.level_element.innerHTML = "&nbsp &nbsp &nbsp LEVEL: " + this.level;

	// Audio
	if(removed_cont > 0) {
		playAudio("audio/fila.mp3");
	}

	return level_up;

};




// ==================== Tetris ==========================

function Tetris() {
	this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR ='white';
Tetris.PAUSE = false;	// Variable pause
Tetris.AUDIO_PLAYER = null;	  // Variable musica de fondo

Tetris.prototype.create_new_shape = function(shape_type){

	// TU CÓDIGO AQUÍ: 
	// Elegir un nombre de pieza al azar del array Tetris.SHAPES
	// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
	// Devolver la referencia de esa pieza nueva

	var shape = null;
	var center = new Point(Tetris.BOARD_WIDTH/2, 0);
	// Si no se especifica un tipo de Shape se crea aleatoriamente
	if(shape_type == null) {
		var randomShapeType = Tetris.SHAPES[Math.floor(Math.random() * Tetris.SHAPES.length)];
		shape = new randomShapeType(center);
	}
	// Se especifica un tipo de Shape (la pieza dibujada en el canvas "next")
	else{
		shape = new shape_type(center);
	}
	
	return shape;
}


// Crea la siguiente pieza de forma aleatoria
Tetris.prototype.create_new_shape_next = function(){
	var randomShapeType = Tetris.SHAPES[Math.floor(Math.random() * Tetris.SHAPES.length)];
	var center = new Point(2, 0);
	var randomShape = new randomShapeType(center);

	return randomShape;
}

Tetris.prototype.init = function(){

	/**************
	  EJERCICIO 4
	***************/

	// gestor de teclado
	document.addEventListener('keydown', this.key_pressed.bind(this), false);

	// Obtener una nueva pieza al azar y asignarla como pieza actual
	this.current_shape = this.create_new_shape();

	// Siguiente pieza
	this.next_shape = this.create_new_shape_next();

	// TU CÓDIGO AQUÍ: 
	// Pintar la pieza actual en el tablero
	// Aclaración: (Board tiene un método para pintar)
	this.board.draw_shape(this.current_shape);

	// Pintar la siguiente pieza en el canvas 'next'
	//this.next_shape.draw_next();
	this.board.draw_next_shape(this.next_shape);
	
	// Se ejecuta animate_shape() cada segundo
	this.freq = 1000;
	this.reloj = setInterval(this.animate_shape.bind(this), this.freq);

	// Ejecutar audio de fondo
	playAudioTetris();

}

Tetris.prototype.key_pressed = function(e) { 

	var key = e.keyCode ? e.keyCode : e.which;

    // TU CÓDIGO AQUÍ:
	// en la variable key se guardará el código ASCII de la tecla que
	// ha pulsado el usuario. ¿Cuál es el código key que corresponde 
	// a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?
	/*
	if(key == 37) console.log("Se ha pulsado 'Izquierda'");
	else if(key == 38) console.log("Se ha pulsado 'Rotar'");
	else if(key == 39) console.log("Se ha pulsado 'Derecha'");
	else if(key == 40) console.log("Se ha pulsado 'Abajo'");
	*/
	if(!Tetris.PAUSE) {
		if (key == 37){
			e.preventDefault();
			this.do_move("Left");
		}
		else if(key == 39){
			e.preventDefault();
			this.do_move("Right");
		}
		else if (key == 40){
			e.preventDefault();
			this.do_move("Down");
		}
		else if (key == 32) {
			e.preventDefault();
			var can_move = true
			while (can_move) {
				var dx = Tetris.DIRECTION["Down"][0];
				var dy = Tetris.DIRECTION["Down"][1];
				if (!this.current_shape.can_move(this.board, dx, dy)) {
					can_move = false;
				}
				this.do_move("Down");
			}
			playAudio("audio/espacio.mp3");
		}

		/* Introduce el código para realizar la rotación en el EJERCICIO 8. Es decir, al pulsar la flecha arriba, rotar la pieza actual */
		else if (key == 38){
			e.preventDefault();
			this.do_rotate();
		}
	}

	// Cuando se pulsa pause
	if(key == 80) {
		if(!Tetris.PAUSE) {
			Tetris.PAUSE = true;
			clearInterval(this.reloj);
			document.getElementById("header").innerHTML = "TETRIS (Paused)"
			Tetris.AUDIO_PLAYER.pause()
		}
		else {
			Tetris.PAUSE = false;
			this.reloj = setInterval(this.animate_shape.bind(this), this.freq);
			document.getElementById("header").innerHTML = "TETRIS"
			Tetris.AUDIO_PLAYER.play();
		}
	}
}

Tetris.prototype.do_move = function(direction) {

	// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
	// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
	// a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos 
	// en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction], 
	// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual 
	// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza. 
	var dx = Tetris.DIRECTION[direction][0];
	var dy = Tetris.DIRECTION[direction][1];
	if(this.current_shape.can_move(this.board, dx, dy)){
		this.current_shape.move(dx, dy);
	}

	/* Código que se pide en el EJERCICIO 6 */
	// else if(direction=='Down')
	// TU CÓDIGO AQUÍ: añade la pieza actual al grid. Crea una nueva pieza y dibújala en el tablero.
	else if(direction == 'Down') {
		this.board.add_shape(this.current_shape);
		this.current_shape = this.create_new_shape(this.next_shape.constructor);
		this.next_shape = this.create_new_shape_next();
		this.board.draw_next_shape(this.next_shape);
		this.board.draw_shape(this.current_shape);
		var level_up = this.board.remove_complete_rows();
		if(level_up) {
			clearInterval(this.reloj);
			this.freq -= 200;
			console.log(this.freq);
			this.reloj = setInterval(this.animate_shape.bind(this), this.freq);
		}
		if (!this.current_shape.can_move(this.board, dx, dy)){
			this.game_over();
		}
	}
}

/***** EJERCICIO 8 ******/
Tetris.prototype.do_rotate = function(){

	// TU CÓDIGO AQUÍ: si la pieza actual se puede rotar, rótala. Recueda que Shape.can_rotate y Shape.rotate ya están programadas.
	if(this.current_shape.can_rotate(this.board)){
		this.current_shape.rotate();
		playAudio("audio/rotar.mp3");
	}
}

Tetris.prototype.animate_shape = function(){
	this.do_move("Down");
}

Tetris.prototype.game_over = function(){
	clearInterval(this.reloj);
	Tetris.AUDIO_PLAYER.pause();
	Tetris.PAUSE = true;
	var record = this.check_record();
	if(!record) {
		playAudio("audio/gameover.mp3");
		setTimeout(function () {
			if(!alert("GAME OVER!!!")){window.location.reload();}	// Al aceptar la alerta se reinicia el juego
		}, 500);
	}

}

Tetris.prototype.check_record = function() {

	// Se guardan todos los records hasta el momento en dict
	var dict = {};
	for (var i=0; i<localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.startsWith("tetris_")) {
			var pos = key.split("_")[1];
			var player_score = localStorage.getItem(key);	// "iker_50"
			dict[pos] = player_score;
		}
	}

	// Se ordenan los jugadores por score en un Array
	var records = new Array(Object.keys(dict).length);
	for (var i=0; i<records.length; i++) {
		records[i] = dict[(i+1)];
	}

	// Si el ranking esta vacio --> Se añade en primera posicion
	if(records.length === 0) {
		playAudio("audio/record.mp3");
		setTimeout(addFirstRecord, 500, this.board);
		return true;
	}
	else {
		// Se busca el indice en el ranking para añadir el record
		var index = records.length;
		for (var i=0; i<records.length; i++) {
			if(this.board.score >= parseInt(records[i].split("_")[1])) {
				index = i;
				break;
			}
		}
		// Si el indice esta entre los 10 primeros se añade el record en la posicion correspondiente
		var new_records = records;
		if(index < 10) {
			playAudio("audio/record.mp3");
			setTimeout(appendRecord, 500, this.board, index, records, new_records);
			return true;
		}
	}
	return false;
}

function addFirstRecord(board) {
	var player = prompt("NEW RECORD: " + board.score + "!!! Please enter your name", "John Smith");
	if (player != null) {
		localStorage.setItem("tetris_1", player + "_" + board.score);
		window.location.href = "ranking.html";
	}
}

function appendRecord(board, index, records, new_records) {
	player = prompt("NEW RECORD: " + board.score + "!!! Please enter your name", "John Smith");
	if(player != null) {
		if (new_records.length === 10){
			var previous = new_records[index];
			new_records[index] = player + "_" + board.score;
			for (var i=index+1; i<10; i++) {
				var aux = previous;
				previous = new_records[i];
				new_records[i] = aux;
			}
		}
		else{
			new_records = new Array(records.length+1);
			for (var i=0; i<index; i++) {
				new_records[i] = records[i];
			}
			new_records[index] = player + "_" + board.score;
			for (var i=index+1; i<new_records.length; i++) {
				new_records[i] = records[i-1];
			}
		}
		for (var i=0; i<new_records.length; i++) {
			localStorage.setItem("tetris_" + (i+1), new_records[i]);
		}
	}
	window.location.href = "ranking.html";
}

function playAudioTetris(){
	loadAudio("audio/tetris.mp3").then( audio => {
		audio.loop = true;
		Tetris.AUDIO_PLAYER = audio;
		audio.play();
	});
}

function playAudio(url) {
	loadAudio(url).then(audio => audio.play());
}

function loadAudio(url){
	return new Promise(resolve => {
		const audio = new Audio(url);
		audio.addEventListener('canplay', () => {
			resolve(audio);
		});
	});
}

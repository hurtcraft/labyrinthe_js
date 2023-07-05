
const nb_row = 80;
const nb_col = 80;
const freq_wall = 4;
let labyrinthe = init_lab(nb_row, nb_col, freq_wall);
const vitesse_generation=50 //en ms
function init_lab(nb_row, nb_col, freq_wall) {
	let labyrinthe = [];
	let tmp;
	let tile;

	for (let i = 0; i < nb_row; i++) {
		tmp = [];
		for (let j = 0; j < nb_col; j++) {
			tile = document.createElement("div");
			tile.classList.add("tile");
			tile.setAttribute("x", i);
			tile.setAttribute("y", j);

			if (get_random_int(freq_wall) == 0) {
				tile.classList.add("wall");
			}
			tmp.push(tile);
		}
		labyrinthe.push(tmp);
	}
	labyrinthe[0][0] = case_depart();
	labyrinthe[labyrinthe.length - 1][labyrinthe[0].length - 1] = case_arrive();
	return labyrinthe;
}
function display_lab(labyrinthe){
	let lab_container = document.getElementById("labyrinthe");
	lab_container.innerHTML = "";
	
	for (let i = 0; i < labyrinthe.length; i++) {
		for (let j = 0; j < labyrinthe[0].length; j++) {

			lab_container.appendChild(labyrinthe[i][j])
		}
	}
}

function get_random_int(max) {
	return Math.floor(Math.random() * max);
}

function case_depart() {
	tile = document.createElement("div");
	tile.classList.add("tile");
	tile.classList.add("depart");
	tile.setAttribute("x", 0);
	tile.setAttribute("y", 0);
	tile.setAttribute("linked",true);
	return tile;
}
function case_arrive() {
	tile = document.createElement("div");
	tile.classList.add("tile");
	tile.classList.add("arrive");
	tile.setAttribute("x", nb_row - 1);
	tile.setAttribute("y", nb_col - 1);
	return tile;
}


  function find_solution(labyrinthe){
	let current_tile=labyrinthe[0][0];// le depart
	let lst_checkpoints=[current_tile];
	
	let map_tile_neighboors=new Map();
	let count=0;

	while(lst_checkpoints.length>0){
		if(!map_tile_neighboors.has(current_tile)){
			map_tile_neighboors.set(current_tile,find_neighboors(current_tile,labyrinthe));
		}
	
		neighboors=map_tile_neighboors.get(current_tile);
		if(neighboors.length===0){
			lst_checkpoints.pop().style.backgroundColor="red";
			current_tile=lst_checkpoints[lst_checkpoints.length-1];
			continue;
		}
		current_tile=neighboors.shift();
		lst_checkpoints.push(current_tile);

		
		try{
			if(current_tile.classList.contains("arrive")){
				for(let i=1;i<lst_checkpoints.length-1;i++){
					current_tile=lst_checkpoints[i];
					neighboors=map_tile_neighboors.get(current_tile);
					if(neighboors.length>=1){
						if(linked_tile(current_tile,labyrinthe)){
						
							setTimeout(()=>{lst_checkpoints[i].style.backgroundColor="green"},(count+1)*vitesse_generation);
							count++;
							
	
						}
					}

				}
				return 1;	
			}
		}
		catch(e){
			console.log(e);

		}
		

	}
	return 0;
}
function linked_tile(tile,labyrinthe){
	let neighboors=find_neighboors(tile,labyrinthe);
	for(let i=0;i<neighboors.length;i++){

		if(neighboors[i].getAttribute("linked")==="true"){
			tile.setAttribute("linked",true);
			console.log(tile);
			return true;
		}
	}
	return false;
}

function find_neighboors(tile, labyrinthe) {
	try{
		let neighboors = [];
		let x = parseInt(tile.getAttribute("x"));
		let y = parseInt(tile.getAttribute("y"));
		
		let right_neightboor = has_right_neightboor(x, y, labyrinthe);
		let left_neightboor = has_left_nightboor(x, y, labyrinthe);
		let top_neightboor = has_top_neightboor(x, y, labyrinthe);
		let bot_neightboor = has_bot_neightboor(x, y, labyrinthe);
	
		right_neightboor!==null?neighboors.push(right_neightboor):null;
		bot_neightboor !== null ? neighboors.push(bot_neightboor) : null;
		top_neightboor !== null ? neighboors.push(top_neightboor) : null;
		left_neightboor !== null ? neighboors.push(left_neightboor) : null;
		return neighboors;
	
	}
	catch(e){
		console.log(e);
		
	}
	
}






function has_right_neightboor(x, y, labyrinthe) {
	// Retourne null si la case qui se situe à droite de la case x, y est un mur ou si la case est en dehors du labyrinthe, sinon retourne la case
	if (y+1>labyrinthe.length-1){
		return null;
	}
	return labyrinthe[x][y + 1].classList.contains("wall") ? null : labyrinthe[x][y + 1];
}


function has_left_nightboor(x, y, labyrinthe) {
	// Retourne null si la case qui se situe à gauche de la case x, y est un mur ou si la case est en dehors du labyrinthe, sinon retourne la case
	if (y-1<0){
		return null;
	}
	return labyrinthe[x][y - 1].classList.contains("wall") ? null : labyrinthe[x][y - 1];
}

function has_top_neightboor(x, y, labyrinthe) {
	// Retourne null si la case qui se situe en haut de la case x, y est un mur ou si la case est en dehors du labyrinthe, sinon retourne la case
	if (x-1<0){
		return null;
	}
	return labyrinthe[x - 1][y].classList.contains("wall") ? null : labyrinthe[x - 1][y];
}

function has_bot_neightboor(x, y, labyrinthe) {
	// Retourne null si la case qui se situe en bas de la case x, y est un mur ou si la case est en dehors du labyrinthe, sinon retourne la case
	if (x+1>labyrinthe.length-1){
		return null;
	}
	return labyrinthe[x + 1][y].classList.contains("wall") ? null : labyrinthe[x + 1][y];
}


display_lab(labyrinthe);

let btn_lancer=document.getElementById("launch");
let btn_reload=document.getElementById("reload");
btn_lancer.addEventListener("click",(e)=>find_solution(labyrinthe));
btn_reload.addEventListener("click",(e)=>{
	labyrinthe=init_lab(nb_row,nb_col,freq_wall);
	
	display_lab(labyrinthe);});


import React, {Component} from 'react';
import './style.css';
// За основу взяла статья https://habr.com/post/262345/

class Maze extends Component {
	static defaultProps = {};

	static propTypes = {};

	state = {
		width: 7,
		height: 7,
		maze: []
	};

	wallGenerator() {
		const {width, height} = this.state;
		let maze = [];
		for (let i = 0; i < height; i++) {
			maze[i] = [];
			for (let j = 0; j < width; j++) {
				if ((i % 2 !== 0 && j % 2 !== 0) && (i < height - 1 && j < width - 1)) {
					maze[i][j] = 0; //Cell;
				} else {
					maze[i][j] = 1; //Wall;
				}
			}
		}
		this.generation(maze);
		//this.randomRemoveWall(maze);
		this.setState({maze});
	}

	generation(maze) {
		let startPoint = {x: 1, y: 1};
		let currentCell = startPoint;
		let mazeCellVisited = [];
		let neighbourCell;
		do {
			let neighbours = this.getNeighbours(maze, mazeCellVisited, startPoint, 2);
			console.log('neighbours: ', neighbours);
			if (neighbours.length !== 0) { //если у клетки есть непосещенные соседи
				neighbourCell = neighbours[Math.floor(Math.random() * neighbours.length)]; //выбираем случайного соседа
				console.log('neighbourCell: ', neighbourCell);
				mazeCellVisited.push(startPoint); //заносим текущую точку в стек
				maze = this.removeWall(currentCell, neighbourCell, maze); //убираем стену между текущей и соседней точками
				currentCell = neighbourCell; //делаем соседнюю точку текущей и отмечаем ее посещенной
			}
			/*else if (stackSize > 0) { //если нет соседей, возвращаемся на предыдущую точку
				startPoint = pop();
			}*/
			else { //если нет соседей и точек в стеке, но не все точки посещены, выбираем случайную из непосещенных
				/*cellString
				cellStringUnvisited = getUnvisitedCells(width, height, maze);
				randNum = randomRange(0, cellStringUnvisited.size - 1);
				currentCell = cellStringUnvisited.cells[randNum];
				free(cellStringUnvisited.cells);*/
			}
		} while (0 > 0) ; //unvisitedCount()
	}

	removeWall(currentCell, neighbourCell, maze) {
		console.log('currentCell, neighbourCell, maze: ', currentCell, neighbourCell, maze);
		let xDiff = neighbourCell.x - currentCell.x;
		let yDiff = neighbourCell.y - currentCell.y;
		let addX, addY;
		let target = {};

		addX = (xDiff !== 0) ? (xDiff / Math.abs(xDiff)) : 0;
		addY = (yDiff !== 0) ? (yDiff / Math.abs(yDiff)) : 0;

		target.x = currentCell.x + addX; //координаты стенки
		target.y = currentCell.y + addY;

		maze[target.y][target.x] = 0;//VISITED;
		return maze;
	}

	getNeighbours(maze, mazeCellVisited, current, distance) {
		let {width, height} = this.state;
		let x = current.x;
		let y = current.y;
		let up = {x, y: current.y - distance};
		let rt = {x: x + distance, y};
		let dw = {x, y: y + distance};
		let lt = {x: x - distance, y};
		console.log('dw, rt, up, lt: ', dw, rt, up, lt);
		let d = [];
		d.push(dw, rt, up, lt);
		let cellCurrentNeighbours = [];

		for (let i = 0; i < 4; i++) { //для каждого направдения
			if (d[i].x > 0 && d[i].x < width && d[i].y > 0 && d[i].y < height) { //если не выходит за границы лабиринта
				if (maze[d[i].y][d[i].x] !== 1 && !~mazeCellVisited.indexOf(d[i])) { //и не посещена\является стеной  && mazeCellCurrent !== VISITED
					cellCurrentNeighbours.push(d[i]);
				}
			}
		}

		return cellCurrentNeighbours;
	}

	randomRemoveWall(maze) {
		const {width, height} = this.state;
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				if (maze[i][j] === 1) {
					if (!(Math.random() * 10 ^ 0) % 5) {
						maze[i][j] = 0;
					}
				}
			}
		}
		return maze;
	}

	generateCells() {
		const {width, height, maze} = this.state;
		let cells = [];
		if (maze.length) {
			for (let i = 0; i < height; i++) {
				cells[i] = [];
				for (let j = 0; j < width; j++) {
					cells[i].push(<div key={i + j} className={maze[i][j] === 0 ? 'cell' : 'wall'}>&nbsp;</div>);
				}
			}
		}
		return cells;
	}

	componentDidMount() {
		this.wallGenerator();
	}

	render() {
		let cells = this.generateCells();
		return (
			<div className='maze'>
				{cells}
			</div>
		);
	}
}

export default Maze;
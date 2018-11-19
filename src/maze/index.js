import React, {Component} from 'react';
import './style.css';

// За основу взята статья https://habr.com/post/262345/

class Maze extends Component {
	static defaultProps = {};

	static propTypes = {};

	state = {
		width: 45,
		height: 45,
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
		this.randomRemoveWall(maze);
		this.setState({maze});
	}

	generation(maze) {
		let currentCell = {x: 1, y: 1};
		let mazeCellVisited = [];
		mazeCellVisited.push(currentCell.x + '-' + currentCell.y);
		let neighbourCell;
		do {
			let neighbours = this.getNeighbours(maze, mazeCellVisited, currentCell, 2);
			if (neighbours.length !== 0) { //если у клетки есть непосещенные соседи
				neighbourCell = neighbours[Math.floor(Math.random() * neighbours.length)]; //выбираем случайного соседа
				maze = this.removeWall(currentCell, neighbourCell, maze); //убираем стену между текущей и соседней точками
				currentCell = neighbourCell; //делаем соседнюю точку текущей и отмечаем ее посещенной
				mazeCellVisited.push(currentCell.x + '-' + currentCell.y); //заносим текущую точку в стек
			}
			else if (neighbours.length === 0) { //если нет соседей, возвращаемся на предыдущую точку
				let indexcurrentCell = mazeCellVisited.indexOf(currentCell.x + '-' + currentCell.y);
				if (~indexcurrentCell) { // Если у последнего currentCell нет соседей, то он еще не успеет попасть в mazeCellVisited.
					currentCell = {x: +mazeCellVisited[indexcurrentCell - 1].split('-')[0], y: +mazeCellVisited[indexcurrentCell - 1].split('-')[1]};
				} else {
					currentCell = {x: +mazeCellVisited[mazeCellVisited.length - 1].split('-')[0], y: +mazeCellVisited[mazeCellVisited.length - 1].split('-')[1]};
				}
			}
			else { //если нет соседей и точек в стеке, но не все точки посещены, выбираем случайную из непосещенных
				/*cellString
				cellStringUnvisited = getUnvisitedCells(width, height, maze);
				randNum = randomRange(0, cellStringUnvisited.size - 1);
				currentCell = cellStringUnvisited.cells[randNum];
				free(cellStringUnvisited.cells);*/
			}
		} while (this.unvisitedCount(maze, mazeCellVisited) > 0);
	}

	unvisitedCount(maze, mazeCellVisited) {
		let {width, height} = this.state;
		let count = 0;
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				if (i % 2 && j % 2 && maze[i][j] !== 1 && !~mazeCellVisited.indexOf(i + '-' + j)) { //i % 2 && j % 2 изначально непосещенные
					count++;
				}
			}
		}
		return count;
	}

	removeWall(currentCell, neighbourCell, maze) {
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
		let d = [];
		d.push(dw, rt, up, lt);
		let cellCurrentNeighbours = [];

		for (let i = 0; i < 4; i++) { //для каждого направдения
			if (d[i].x > 0 && d[i].x < width && d[i].y > 0 && d[i].y < height) { //если не выходит за границы лабиринта
				if (maze[d[i].y][d[i].x] !== 1 && !~mazeCellVisited.indexOf(d[i].x + '-' + d[i].y)) { //и не посещена\является стеной  && mazeCellCurrent !== VISITED
					cellCurrentNeighbours.push(d[i]);
				}
			}
		}

		return cellCurrentNeighbours;
	}

	randomRemoveWall(maze) {
		const {width, height} = this.state;
		for (let i = 1; i < height - 1; i++) {
			for (let j = 1; j < width - 1; j++) {
				if (maze[i][j] === 1) {
					if (!(Math.random() * 100 ^ 0) % 17) {
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
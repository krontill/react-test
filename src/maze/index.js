import React, {Component} from 'react';
import './style.css';

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
		//this.randomRemoveWall(maze);
		this.setState({maze})
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
import React, {Component} from 'react';
import './App.css';
import Maze from './maze/index';

class App extends Component {
	render() {
		return (
			<div className="app">
				<Maze/>
			</div>
		);
	}
}

export default App;

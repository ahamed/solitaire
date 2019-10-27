import React, { Component } from 'react';
import Piles from '../Piles';


class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="solitaire-board">
                <Piles />
            </div>
        ) ;
    }
}

export default Board;
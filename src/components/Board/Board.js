import React, { Component } from 'react';
import Piles from '../Piles';
import Deck from '../Deck';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="solitaire-board">
                <div className="wrapper">
                    <div className="left-side">
                        <Piles />
                    </div>
                    <div className="right-side">
                        <div className="deck-container">
                            <Deck />
                        </div>
                        
                    </div>
                </div>
            </div>
        ) ;
    }
}

export default Board;
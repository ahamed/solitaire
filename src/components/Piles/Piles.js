import React, { Component } from 'react';
import Pile from '../Pile';
import * as cardJson from "../../cards.json";

class Piles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            piles: [
                {
                    cards: [
                        {
                            name: 'diamonds-2',
                            id: 'd2',
                            front: cardJson['d2'],
                            back: cardJson['back'],
                            frontView: false,
                        },
                        {
                            name: 'clubs-2',
                            id: 'c2',
                            front: cardJson['c2'],
                            back: cardJson['back'],
                            frontView: false,
                        },
                        {
                            name: 'hearts-2',
                            id: 'h2',
                            front: cardJson['h2'],
                            back: cardJson['back'],
                            frontView: false,
                        },
                        {
                            name: 'spades-2',
                            id: 's2',
                            front: cardJson['s2'],
                            back: cardJson['back'],
                            frontView: true,
                        },
                    ]
                },
                {
                    cards: []
                },
                {
                    cards: []
                },
                {
                    cards: []
                },
                {
                    cards: []
                },
                {
                    cards: []
                },
                {
                    cards: []
                }
            ]
        };
    }
    render() {
        return (
            <div className="solt-piles">
                {this.state.piles.map((pile, index) => {
                    return(
                        <Pile key={index + 1} pile={pile} />
                    )
                })}
            </div>
        )
    }
}

export default Piles;
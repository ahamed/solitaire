import React, { Component } from 'react';
import Pile from '../Pile';
import cardImages from "../../cards";

class Piles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardKeys: ["c2", "d2", "h2", "s2", "c3", "d3", "h3", "s3", "c4", "d4", "h4", "s4", "c5", "d5", "h5", "s5", "c6", "d6", "h6", "s6", "c7", "d7", "h7", "s7", "c8", "d8", "h8", "s8", "c9", "d9", "h9", "s9", "c10", "d10", "h10", "s10", "cj", "dj", "hj", "sj", "cq", "dq", "hq", "sq", "ck", "dk", "hk", "sk", "ca", "da", "ha", "sa"],
            piles: []
        };

        
    }

    componentDidMount() {
        this.setState({piles: this.generateInitialPiles()});
    }

    getRandom = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generateInitialPiles = () => {
        const keys = this.state.cardKeys;
        
        const cardIndexes = [];

        for (let i = 0; i < 28; i ++) {
            let cardIndex = keys[this.getRandom(0, 51)];
            while (cardIndexes.indexOf(cardIndex) > -1) {
                cardIndex = keys[this.getRandom(0,51)];
            }
            cardIndexes.push(cardIndex);
        }

        let index = 0;
        const piles = [];

        for (let i = 0; i < 7; i ++) {
            let cards = [];
            for (let j = 0; j < 7 - i; j ++) {
                let obj = {};

                obj.name    = 'card';
                obj.id      = cardIndexes[index];
                obj.front   = cardImages[cardIndexes[index]];
                obj.back    = cardImages['back'];

                if (j === 7 - i - 1) {
                    obj.frontView = true;
                } else {
                    obj.frontView = false;
                }
                index++;

                cards.push(obj);
            }

            let cardObj = {};
            cardObj.cards = cards;
            piles.push(cardObj);

        }
        return piles;
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
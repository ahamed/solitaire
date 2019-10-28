import React, { Component } from 'react'

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    rotateCard = (event) => {
        event.preventDefault();
        const {currentTarget: el} = event;
        if (!el.classList.contains('is-frontview')) {
            el.classList.add('is-frontview');
        }
    }

    rotateDeckCard = (event, deck, index, deckTotal) => {
        event.preventDefault();
        event.stopPropagation();

        const {currentTarget: el} = event;
        console.log(deck);
        if (deck) {
            if (!el.classList.contains('.is-deck-show')) {
                el.classList.add('is-deck-show');
                el.setAttribute('style', `z-index: ${deckTotal - index}; margin-left: ${deckTotal - index * 2}px;`);
            }
        }
    }

    render() {
        const {card, style = {}, hoverable = true, deck = false, index, deckTotal = 0} = this.props;
        
        return (
            <div className={`solitaire-card ${hoverable ? 'hoverable' : ''}`} style={style} onClick={(event) => this.rotateDeckCard(event, deck, index, deckTotal)}>
                <div className={`solt-card ${card.frontView ? 'is-frontview': ''}`}>
                    <div className="solt-card__face solt-card__face--back" style={{backgroundImage: `url(${card.back})`}}></div>
                    <div className="solt-card__face solt-card__face--front" style={{backgroundImage: `url(${card.front})`}}></div>
                </div>
            </div>
        )
    }
}

export default Card;
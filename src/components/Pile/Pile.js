import React, { Component } from 'react'
import Card from '../Card';

class Pile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardDistance: 30
        };
    }

    renderPile = (pile) => {
        if (pile.cards.length <= 0) {
            return (<div className="solitaire-pile is-empty-pile"></div>);
        } else {
            return(<div className="solitaire-pile has-card">
                {pile.cards.map((card, index) => {
                    return (
                        <Card key={card.id} card={card} style={{marginTop: `${index * this.state.cardDistance}px`}} />
                    )
                })}
            </div>);
        }
    }

    render() {
        const {pile} = this.props;
        return this.renderPile(pile);
    }
}

export default Pile;
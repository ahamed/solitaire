import React, { Component } from 'react';
import Card from '../Card';
import { connect } from 'react-redux';

class Deck extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }



    render() {
        const { deck: cards } = this.props;
        const { length: deckTotal } = cards;
        return (
            <div className="solt-deck">
                <div className="solt-reset-deck"></div>
                { cards.map((card, index) => {
                    return (
                        <Card 
                            card={card} 
                            key={card.id} 
                            hoverable={false}
                            deck={true}
                            index={index}
                            deckTotal={deckTotal}
                            style={{marginTop: `-${index}px`, marginLeft: `${index}px`}} 
                        />
                    )
                })}
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        deck: state.deck
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Deck);
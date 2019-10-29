import React, { Component } from 'react';
import Card from '../Card';
import { connect } from 'react-redux';
import FA from 'react-fontawesome';

class Deck extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }



    render() {
        const { deck: cards } = this.props;
        return (
            <div className="solitaire-deck">
                <div className="solitaire-reset-deck" onClick={this.props.dispatchResetDeck}>
                    <FA name="refresh" size="2x" />
                </div>
                { cards.map((card, index) => {
                    return (
                        <Card 
                            card={card} 
                            key={card.id} 
                            hoverable={false}
                            deck={true}
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
        dispatchResetDeck: () => {
            const action = {
                type: 'RESET_DECK'
            };
            dispatch(action);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Deck);
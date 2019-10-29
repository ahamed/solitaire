import { createStore } from 'redux';
import update from 'immutability-helper';
import deepcopy from 'deepcopy';
import { cardKeys, generateInitialPiles } from '../helper/helper';


const {piles, deck} = generateInitialPiles();

const initialState = {
    cardKeys,
    piles,
    deck,
    deckHead: deck.length - 3, // deck head card should be the third card from last of the deck
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'RESET_STATE':
            const {piles: newPiles, deck: newDeck} = generateInitialPiles();
            return update(state, {
                piles: {
                    $set: newPiles
                },
                deck: {
                    $set: newDeck
                }
            });
        case 'PULL_FROM_DECK':
            const { payload: topCardId } = action;
            const topCardIndex = state.deck.findIndex(card => card.id === topCardId);
            const { length: deckTotal } = state.deck;
            let updatedDeck;
            
            // Get the clicked card from the deck top
            if (typeof state.deck[topCardIndex] !== 'undefined') {
                updatedDeck = update(state.deck, {
                    [topCardIndex]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - topCardIndex + 1, transform: `translate3d(-60px, 170px, 10px)`}}
                    }
                });
            }

            // Check if exists and take the top second card from the deck set
            if (typeof state.deck[topCardIndex - 1] !== 'undefined') {
                updatedDeck = update(updatedDeck, {
                    [topCardIndex - 1]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - topCardIndex, transform: `translate3d(-80px, 170px, 10px)`}}
                    }
                });
            }

            // Check if exists and take the top third card from the deck set
            if (typeof state.deck[topCardIndex - 2] !== 'undefined') {
                updatedDeck = update(updatedDeck, {
                    [topCardIndex - 2]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - 1 - topCardIndex, transform: `translate3d(-100px, 170px, 10px)`}}
                    }
                });
            }
            
            return update(state, {
                deck: {$set: updatedDeck},
                deckHead: {$set: topCardIndex - 2}
            });
        
        case 'RESET_DECK':
            let deckCopy = deepcopy(state.deck);
            deckCopy = deckCopy.map((card, index) => {
                card.frontView = false;
                card.style = {marginTop: `${index}px`, marginLeft: `${index}px`};
                return card;
            });
            return update(state, {
                deck: {$set: deckCopy}
            });
        default: 
            return state;
    }
};

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
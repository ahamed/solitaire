import { createStore } from 'redux';
import update from 'immutability-helper';
import deepcopy from 'deepcopy';
import { cardKeys, generateInitialPiles } from '../helper/helper';


const {piles, deck} = generateInitialPiles();

const initialState = {
    cardKeys,
    piles,
    deck,
    deckHead: cardKeys[deck.length - 3], // deck head card should be the third card from last of the deck
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
                        style: {$set: {zIndex: deckTotal - topCardIndex + 1, transform: `translate3d(0px, 130px, 10px)`}}
                    }
                });
            }

            // Check if exists and take the top second card from the deck set
            if (typeof state.deck[topCardIndex - 1] !== 'undefined') {
                updatedDeck = update(updatedDeck, {
                    [topCardIndex - 1]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - topCardIndex, transform: `translate3d(-20px, 130px, 10px)`}}
                    }
                });
            }

            // Check if exists and take the top third card from the deck set
            if (typeof state.deck[topCardIndex - 2] !== 'undefined') {
                updatedDeck = update(updatedDeck, {
                    [topCardIndex - 2]: {
                        frontView: {$set: true},
                        style: {$set: {zIndex: deckTotal - 1 - topCardIndex, transform: `translate3d(-40px, 130px, 10px)`}}
                    }
                });
            }
            
            return update(state, {
                deck: {$set: updatedDeck},
                deckHead: {$set: state.cardKeys[topCardIndex - 2]}
            });
        
        case 'CARD_SWAP':
            const {dragItemId, dragItemPile, dropItemId, dropItemPile} = action.payload;
            const copyPiles = deepcopy(state.piles);
            const dragPile = copyPiles[dragItemPile - 1];
            const dropPile = copyPiles[dropItemPile - 1];

            // if drag pile or drop pile don't exists or some other error,
            // then return the original state
            if (typeof dragPile === 'undefined' || typeof dropPile === 'undefined') return state;

            // get the dragging card index
            const dragCardIndex = dragPile.cards.findIndex(card => card.id === dragItemId);

            // remove the dragging card from the pile
            const dragItem = dragPile.cards.splice(dragCardIndex, 1);

            // get the card where the dragging card is dropped
            const dropItem = dropPile.cards.filter(card => card.id === dropItemId);

            // if drop item found
            if (typeof dropItem !== 'undefined' && dropItem.length > 0) {
                // get the last item's margin top value
                const itemMarginTop = parseInt(dropItem[0].style.marginTop, 10) || 0;
                dragItem[0].style.marginTop = `${itemMarginTop + 20}px`;
            }

            // push the drag Item into the drop pile
            if (typeof dragItem !== 'undefined' && dragItem.length > 0) {
                dropPile.cards.push(dragItem[0]);
            }

            // update the drag pile's pileHead value
            if (typeof dragPile.cards[dragPile.cards.length - 1] !== 'undefined') {
                dragPile.pileHead = dragPile.cards[dragPile.cards.length - 1].id;
                
                // show the frontview of the drag pile's last card
                dragPile.cards[dragPile.cards.length - 1].frontView = true;
            } else {
                dragPile.pileHead = '-1';
            }
            

            return update(state, {
                piles: {$set: copyPiles}
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
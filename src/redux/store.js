import { createStore } from 'redux';
import update from 'immutability-helper';
import { cardKeys, generateInitialPiles } from '../helper/helper';

const {piles, deck} = generateInitialPiles();

const initialState = {
    cardKeys,
    piles,
    deck
};

const reducer = (state = initialState, action) => {
    console.log(state);
    switch(action.type) {
        case 'DEMO':
            return state;
        default: 
            return state;
    }
};

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
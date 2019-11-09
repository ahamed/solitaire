import React, { Component } from 'react';
import Piles from '../Piles';
import Deck from '../Deck';
import { connect } from 'react-redux';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { resetState } = this.props;
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
                {/* <div className="reset">
                    <button className="button is-danger" onClick={resetState}>Reset</button>
                </div> */}
            </div>
        ) ;
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetState: () => {
            const action = {
                type: 'RESET_STATE'
            };

            dispatch(action);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);
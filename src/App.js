import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Board from './components/Board';

import './scss/index.scss';

function App() {
  return (
    <div className="app">
      <div className="container is-fluid">
        <Provider store={store}>
          <Board />
        </Provider>
      </div>
    </div>
  );
}

export default App;

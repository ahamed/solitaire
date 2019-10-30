import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Board from './components/Board';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import './scss/index.scss';

function App() {
  return (
    <div className="app">
      <div className="container is-fluid">
        <Provider store={store}>
          <DndProvider backend={HTML5Backend}>
            <Board />
          </DndProvider>
        </Provider>
      </div>
    </div>
  );
}

export default App;

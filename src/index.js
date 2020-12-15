import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './MainView';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

function App() {
    return (
        <MainView />
    );
}

ReactDOM.render(<App />, document.getElementById("synonym-root"));

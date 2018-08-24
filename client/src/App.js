import React, { Component } from 'react';
import ConnectedSearch from './components/Search'

import './index.css';

class App extends Component {

    render() {

        return (
           <div className='App'>
                <div>
                    <ConnectedSearch/>
                </div>
            </div>
        );
    }
}

export default App;

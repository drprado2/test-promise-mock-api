import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {FetchMock, ApiBase} from 'promise-mock-api';

const myApi = new ApiBase('clients');
FetchMock.loadApis(myApi);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

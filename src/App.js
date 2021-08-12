
import React from 'react';
import 'devextreme/dist/css/dx.light.css';

import Search from './components/Search';
import Random from './components/Random';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Random} />
      <Route path="/search" component={Search} />
    </Router>
  );
}

export default App;
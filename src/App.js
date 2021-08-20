import React from 'react';
import Zaposleni from './pages/Zaposleni/Zaposleni';
import NotFoundPage from './pages/NotFoundPage';
import './Main.css';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Zaposleni}></Route>
        <Route exact path='/404' component={NotFoundPage}></Route>
        <Redirect to='/404'></Redirect>
      </Switch>
    </Router>
  );
};

export default App;

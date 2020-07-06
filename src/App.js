import React, {Fragment, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import NavBar from './components/layout/NavBar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert'
import axios from 'axios';
import PropTypes from 'prop-types';
import {About} from './components/pages/About';
import User from './components/users/User';
import Repos from './components/repos/Repos';
import GithubState from './context/github/GithubState'

import './App.css';

const App = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({message, type})
  }


  const getUserRepos = async (userId) => {
    setLoading(true);
    const response = await axios
      .get(`https://api.github.com/users/${userId}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setRepos(response.data)
    setLoading(false)
  }

  return (
    <GithubState>
      <Router>
        <div className='App'>
          <NavBar title='Github Finder' icon='fa fa-github'/>
          <div className='container'>
            <Alert alert={alert}/>
            <Switch>
              <Route exact
                     path='/'
                     render={props => (
                       <Fragment>
                         <Search setAlert={showAlert}/>
                         <Users/>
                       </Fragment>
                     )}/>
              <Route exact path='/about' component={About}/>
              <Route exact path='/user/:login' render={props => (
                <User {...props}
                      getUserRepos={getUserRepos}
                      repos={repos}
                      loading={loading}
                />
              )}/>
              <Route exact path='/user/:login/repos' render={props => (
                <Repos {...props} loading={loading}/>
              )}/>
            </Switch>
          </div>
        </div>
      </Router>
    </GithubState>
  )
}

App.propTypes = {
  setAlert: PropTypes.func,
  getUserRepos: PropTypes.func
};

export default App;

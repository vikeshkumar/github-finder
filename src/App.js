import React, {Fragment, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import './App.css';
import NavBar from './components/layout/NavBar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert'
import axios from 'axios';
import PropTypes from 'prop-types';
import {About} from './components/pages/About';
import User from './components/users/User';
import Repos from './components/repos/Repos';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);


  const searchUsers = async text => {
    setLoading(true);
    const response = await axios
      .get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setUsers(response.data.items);
    setLoading(false);
  };

  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  }

  const showAlert = (message, type) => {
    setAlert({message, type})
  }

  //Get Single User
  const getUser = async (userId) => {
    setLoading(true)
    const response = await axios
      .get(`https://api.github.com/users/${userId}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setUser(response.data)
    setLoading(false)
  }

  const getUserRepos = async (userId) => {
    setLoading(true);
    const response = await axios
      .get(`https://api.github.com/users/${userId}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    setRepos(response.data)
    setLoading(false)
  }

  return (
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
                       <Search searchUsers={searchUsers}
                               clearUsers={clearUsers}
                               showClear={users.length > 0}
                               setAlert={showAlert}
                       />
                       <Users loading={loading} users={users}/>
                     </Fragment>
                   )}/>
            <Route exact path='/about' component={About}/>
            <Route exact path='/user/:login' render={props => (
              <User {...props}
                    getUser={getUser}
                    user={user}
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
  )
}

App.propTypes = {
  searchUsers: PropTypes.func,
  clearUsers: PropTypes.func,
  showClear: PropTypes.bool,
  setAlert: PropTypes.func,
  getUserRepos: PropTypes.func
};

export default App;

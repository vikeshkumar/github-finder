import React, {Component, Fragment} from 'react';
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

class App extends Component {

  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  }

  searchUsers = async text => {
    this.setState({loading: true});
    const response = await axios
      .get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({loading: false, users: response.data.items});
  };

  clearUsers = () => this.setState({users: [], loading: false});

  setAlert = (message, type) => {
    this.setState({alert: {message: message, type: type}});

    setTimeout(() => this.setState({alert: null}), 5000);
  }

  //Get Single User
  getUser = async (userId) => {
    this.setState({loading: true});
    const response = await axios
      .get(`https://api.github.com/users/${userId}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({user: response.data, loading: false})
  }

  getUserRepos = async (userId) => {
    this.setState({loading: true});
    const response = await axios
      .get(`https://api.github.com/users/${userId}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({repos: response.data, loading: false})
  }

  render() {
    const {users, loading, user, repos} = this.state;
    return (
      <Router>
        <div className='App'>
          <NavBar title='Github Finder' icon='fa fa-github'/>
          <div className='container'>
            <Alert alert={this.state.alert}/>
            <Switch>
              <Route exact
                     path='/'
                     render={props => (
                       <Fragment>
                         <Search searchUsers={this.searchUsers}
                                 clearUsers={this.clearUsers}
                                 showClear={this.state.users.length > 0}
                                 setAlert={this.setAlert}
                         />
                         <Users loading={loading} users={users}/>
                       </Fragment>
                     )}/>
              <Route exact path='/about' component={About}/>
              <Route exact path='/user/:login' render={props => (
                <User {...props}
                      getUser={this.getUser}
                      user={user}
                      getUserRepos={this.getUserRepos}
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
}

App.propTypes = {
  searchUsers: PropTypes.func,
  clearUsers: PropTypes.func,
  showClear: PropTypes.bool,
  setAlert: PropTypes.func,
  getUserRepos: PropTypes.func
};

export default App;

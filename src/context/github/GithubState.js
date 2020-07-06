import React, {useReducer} from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';

import {CLEAR_USERS, GET_USER, SEARCH_USERS, SET_LOADING,} from '../types'


const GithubState = props => {
  const initialState = {
    users: [],
    user: {
      login: "",
      id: 0,
      node_id: "",
      avatar_url: "",
      gravatar_id: "",
      url: "",
      html_url: "",
      followers_url: "",
      following_url: "",
      gists_url: "",
      starred_url: "",
      subscriptions_url: "",
      organizations_url: "",
      repos_url: "",
      events_url: "",
      received_events_url: "",
      type: "",
      site_admin: false,
      name: "",
      company: "",
      blog: "",
      location: "",
      email: null,
      hireable: null,
      bio: null,
      twitter_username: null,
      public_repos: 0,
      public_gists: 0,
      followers: 0,
      following: 0,
      created_at: "",
      updated_at: ""
    },
    repos: [],
    loading: false
  }

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users

  const searchUsers = async text => {
    setLoading(true);
    const response = await axios
      .get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    dispatch({
      type: SEARCH_USERS,
      payload: response.data.items
    })
  };

  //Get Single User
  const getUser = async text => {
    setLoading(true);
    const response = await axios
      .get(`https://api.github.com/users/${text}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    console.log(response.data)
    dispatch({
      type: GET_USER,
      payload: response.data
    });
  };

  // Get Repos


  // Clear Users
  const clearUsers = () => dispatch({type: CLEAR_USERS});

  // Set Loading
  const setLoading = () => dispatch({type: SET_LOADING})

  return <GithubContext.Provider
    value={{
      users: state.users,
      repos: state.repos,
      loading: state.loading,
      searchUsers,
      clearUsers,
      getUser,
    }}
  >
    {props.children}
  </GithubContext.Provider>
}

export default GithubState;

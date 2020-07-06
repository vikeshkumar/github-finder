import React, {Component} from 'react'
import PropTypes from "prop-types";

export class Search extends Component {
    static propTypes = {
        searchUsers: PropTypes.func.isRequired,
        clearUsers: PropTypes.func.isRequired,
    };

    state = {
        text: '',
        showClear: false
    }

    constructor(props) {
        super(props);
        this.onChange = (e) => this.setState({[e.target.name]: e.target.value});
        this.onSubmit = (e) => {
            e.preventDefault();
            if (this.state.text === '') {
                this.props.setAlert('Nothing to search for.', 'light');
            } else {
                this.props.searchUsers(this.state.text)
                this.setState({text: ''})
            }
        }
    }

    render() {
        return (
          <div>
              <form action='' className='form' onSubmit={this.onSubmit}>
                  <input
                    type='text'
                    name='text'
                    placeholder='Search Users...'
                    value={this.state.text} onChange={this.onChange}/>
                  <input
                    type='submit'
                    value='Search'
                    className='btn btn-dark btn-block'/>
              </form>
              {this.props.showClear && (
                <button className='btn btn-light btn-block' onClick={this.props.clearUsers}>Clear Users</button>)}
          </div>
        )
    }
}

export default Search

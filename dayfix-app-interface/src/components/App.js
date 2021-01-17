import 'bootstrap/dist/css/bootstrap.css'
import '../css/App.css';
import { Component, Fragment } from 'react';
import AppHeader from './AppHeader';
import DayFixes from './DayFixes';
import {BASE_API_URL, JWT_KEY} from '../constants';

class App extends Component { 

  constructor() {
    super();
    var token = localStorage.getItem(JWT_KEY);
    this.state = {
      dayFixes: [],
      onPost:false, // determines whether "The tweet has been successfully posted" message will be displayed
      postedSuccessfully:false, // whether the twit was posted successfully
      isAuthenticated:token != null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.postToTwitter = this.postToTwitter.bind(this);
  }

  postToTwitter(fixId) {
    var jtw = localStorage.getItem(JWT_KEY);

    fetch(`${BASE_API_URL}/DayFix/TwitterPost/${fixId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jtw}`
        }
    })
    .then(response => {
      if (response.status === 200) {
          console.log('Authorized');
          this.setState({
            postedSuccessfully:true
          });
      }
      else if (response.status === 401) {
          console.log('Unauthorized');
          this.setState({
            postedSuccessfully:false
          });
      }
    })
    .then(() => {
      this.setState({
        onPost:true
      });
    })
    .catch(error => console.error('Unable to post this tweet.', error));
  }

  deleteItem(id) {
    fetch(`${BASE_API_URL}/DayFix/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        let tempArray = this.state.dayFixes;
        var removeIndex = tempArray.map(item => item.id).indexOf(id);
        if (removeIndex !== -1) tempArray.splice(removeIndex, 1);
        this.setState({
          dayFixes: tempArray,
          onPost:false
        });
      })
      .catch(error => console.error('Unable to delete item.', error));    
  }  

  handleSubmit = (e) => {
    e.preventDefault();

    fetch(BASE_API_URL + '/DayFix', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'          
        }
      })
      .then(response => response.json())
      .then((data) => {        
        let dayfixes = this.state.dayFixes;
        dayfixes.push(data);
        this.setState({
          dayFixes: dayfixes,
          onPost:false
        });
      })
    .catch(error => console.error('Unable to add item.', error));   
  }

  componentDidMount() {    
    fetch(BASE_API_URL + '/DayFix')
      .then(response => response.json())
      .then(result => {        
        this.setState({
          dayFixes: result,
          onPost:false
        });
      });
  }

  render () {
    let dayfixes = this.state.dayFixes;
    return (      
      <Fragment>
        <AppHeader isLoggedIn={this.state.isAuthenticated} />
        <main>
          <h1>Day Fix</h1>
          <h4>To make your day better, click on the button below and get another random cat picture along with a really corny joke.</h4>
          <form onSubmit={this.handleSubmit}>
            <input type="submit" value="Brighten Your Day" className="btn btn-primary btn-lg" />
          </form>
          {this.state.onPost && this.state.postedSuccessfully ? 
            <p>The tweet has been successfully posted. To see it, click <a target='_blank' rel='noreferrer' href='https://twitter.com/CatAndJoke'>here</a>.</p> 
            : this.state.onPost && !this.state.postedSuccessfully ?
            <p style={{color: "red"}}>Only logged-in users are allowed to post to Twitter.</p>
            : null }
          
          <hr /> 
          <DayFixes 
            dayfixes={dayfixes}
            deleteItem={this.deleteItem}
            postToTwitter={this.postToTwitter}
          ></DayFixes>
        </main>
      </Fragment>
    );
  }  
}

export default App;

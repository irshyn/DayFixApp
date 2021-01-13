import 'bootstrap/dist/css/bootstrap.css'
import '../css/App.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Component } from 'react';
import DayFixes from './DayFixes';

const uri = 'https://localhost:44338/api/v1/DayFix';

class App extends Component { 

  constructor() {
    super();
    this.state = {
      dayFixes: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.postToTwitter = this.postToTwitter.bind(this);
  }

  postToTwitter(fixId) {
    fetch(`${uri}/TwitterPost/${fixId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(() => {
            //displaySuccessMessage();
        })
        .catch(error => console.error('Unable to post this tweet.', error));
}

  deleteItem(id) {
    fetch(`${uri}/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        let tempArray = this.state.dayFixes;
        var removeIndex = tempArray.map(item => item.id).indexOf(id);
        if (removeIndex !== -1) tempArray.splice(removeIndex, 1);
        this.setState({
          dayFixes: tempArray
        });
      })
      .catch(error => console.error('Unable to delete item.', error));    
  }
  

  handleSubmit = (e) => {
    e.preventDefault();

    fetch(uri, {
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
          dayFixes: dayfixes
        });
      })
    .catch(error => console.error('Unable to add item.', error));   
  }

  componentDidMount() {
    fetch(uri)
      .then(response => response.json())
      .then(result => {        
        this.setState({
          dayFixes: result
        });
      });
  }

  render () {
    let dayfixes = this.state.dayFixes;
    return (      
      <main>
        <h1>Day Fix</h1>
        <h4>To make your day better, click on the button below and get another random cat picture along with a really corny joke.</h4>
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Brighten Your Day" className="btn btn-primary btn-lg" />
        </form>
        <p id="successMessage">The tweet has been successfully posted. To see it, click <Router><Link to = 'https://twitter.com/CatAndJoke' target="_blank">here</Link></Router>.</p>
        <hr /> 
        <DayFixes 
          dayfixes={dayfixes}
          deleteItem={this.deleteItem}
          postToTwitter={this.postToTwitter}
        ></DayFixes>
      </main>
    );
  }  
}

export default App;

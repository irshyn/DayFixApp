//RegistrationModal.js
import React from 'react';
import { 
    Button,
    Label,
    Input,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter 
} from 'reactstrap';
import {BASE_API_URL, JWT_KEY} from '../constants';

export default class RegistrationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        isOpen: false,
        username: '',
        password :'' ,
        emailaddress: '',
        errormessage: ''
    };

    this.toggle = this.toggle.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeEmailAddress = this.handleChangeEmailAddress.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggle() {
    this.setState({
        isOpen: !this.state.isOpen,
        errormessage: ''
    });
  }
  handleChangeUserName(event) {
    this.setState({username: event.target.value});
  }
  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }
  handleChangeEmailAddress(event) {
    this.setState({emailaddress: event.target.value});
  }
  handleSubmit(event) {
      event.preventDefault();

      if (!this.state.username || !this.state.password || !this.state.emailaddress) {
        this.setState({
            errormessage: 'All fields are required.'
        });
        return;
      }

      fetch(BASE_API_URL + '/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            emailaddress: this.state.emailaddress
        })
    })
    .then(response => {        
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        this.setState({
            isOpen: !this.state.isOpen
        });
        this.props.onAuthentication(true);
        return response.json();
    })
    .then(function (data) {
        localStorage.setItem(JWT_KEY, data.token);        
    })
    .catch((error) => {
        this.setState({
            username: '',
            password :'' ,
            errormessage: 'Unable to register the user.'
        });
        console.error('Unable to register.', error)
    });
  }


  render() {
    return (
        <div>          
            <Button className="navbar-button" onClick={this.toggle}>Register</Button>
            <Modal isOpen={this.state.isOpen}>
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader>Registration Form</ModalHeader>
                    <ModalBody>                    
                        <div className=" row form-group">
                            <Label className="col-md-4 control-label">User Name:</Label>                            
                            <div className="col-md-6">                                
                                <Input type="text" value={this.state.username} onChange={this.handleChangeUserName} className="form-control" />
                            </div>                       
                        </div> 
                        <div className="row form-group">
                            <Label className="col-md-4 control-label">Password:</Label>
                            <div className="col-md-6">
                                <Input type="password" value={this.state.password} onChange={this.handleChangePassword} className="form-control" />
                            </div>
                        </div>
                        <div className="row form-group">
                            <Label className="col-md-4 control-label">Email Address:</Label>
                            <div className="col-md-6">
                                <Input type="text" value={this.state.emailaddress} onChange={this.handleChangeEmailAddress} className="form-control" />
                            </div>
                        </div>
                        {this.state.errormessage ? 
                            <span style={{color: "red"}}>{this.state.errormessage}</span>
                            : null
                        }
                    </ModalBody>
                    <ModalFooter>
                        <input type="submit" value="Submit" color="primary" className="btn btn-primary" />
                        <Button color="danger" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>      
    );
  }
}
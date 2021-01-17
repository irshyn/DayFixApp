//LoginModal.js
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

export default class LoginModal extends React.Component {
  constructor() {
    super();

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
  handleSubmit(event) {
      event.preventDefault();

      if (!this.state.username || !this.state.password) {
        this.setState({
            errormessage: 'Both user name and password are required.'
        });
        return;
      }

      fetch(BASE_API_URL + '/login', {
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
            // TODO: display error!!!
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
            errormessage: 'Invalid user name and/or password provided.'
        });
        console.error('Unable to login.', error)
    });
  }

  render() {
    return (
        <div>          
            <Button className="navbar-button" onClick={this.toggle}>Log In</Button>
            <Modal isOpen={this.state.isOpen}>
                <form onSubmit={this.handleSubmit}>
                    <ModalHeader>Log In</ModalHeader>
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
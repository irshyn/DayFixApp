import React, { Component } from 'react';
import '../css/App.css';
import {
    Button,
    Navbar,
    NavbarBrand,
    Nav
} from 'reactstrap';
import RegistrationModal from './RegistrationModal';
import LoginModal from './LoginModal';
import {JWT_KEY} from '../constants';

class AppHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isAuthenticated:this.props.isLoggedIn
        };

        this.onAuthentication = this.onAuthentication.bind(this);
        this.logout = this.logout.bind(this);
    }

    onAuthentication(isAuth) {
        this.props.handleAuth(isAuth);
        this.setState({
            isAuthenticated: isAuth
        });
    }

    logout() {
        this.props.handleAuth(false);
        localStorage.removeItem(JWT_KEY);
        this.setState({
            isAuthenticated: false
        });
    }

    render() {
        return (
            <Navbar className="navbar-style" expand="md">
                <NavbarBrand href="/">
                    <img src="/avatar.png" width="38" className="d-inline-block" alt="Cat Pic" />
                    Home
                </NavbarBrand>

                {this.state.isAuthenticated ?
                    <Nav className="ml-auto" navbar>
                        <Button className="navbar-button" onClick={this.logout}>Log Out</Button>
                    </Nav> 
                    
                    :

                    <Nav className="ml-auto" navbar>
                        <RegistrationModal onAuthentication={this.onAuthentication} />
                        <LoginModal onAuthentication={this.onAuthentication} />
                    </Nav>
                }               
            </Navbar>
        );
    }
}
export default AppHeader;
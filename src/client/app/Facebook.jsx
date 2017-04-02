import React from 'react';
import {BrowserRouter, history, Link} from 'react-router-dom';
import { ajaxSetup } from 'jquery';

class Facebook extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : window.location.host === 'localhost:8080' ? '1897409527137678' : window.location.host === 'koolkoalas-youin.herokuapp.com' ? '133603993839631' :'414888392204388',
        cookie     : true,  // enable cookies to allow the server to access the session
        xfbml      : true,
        version    : 'v2.1'
      });
      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);
  }
  testAPI() {
    var check = this;
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      check.props.setName(response.name);
      console.log('Successful login for: ' + response.name);
    });
  }

// This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    /* The response object is returned with a status field that lets the
     app know the current login status of the person. */
    if (response.status === 'connected') {
    // Logged into your app and Facebook.
      this.testAPI();

      ajaxSetup({
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + response.authResponse.accessToken);
        }
      })
      this.props.setToken(response.authResponse.accessToken);
      this.props.getEvents(this.props.history, function(result) {
        console.log('results of fetching events', result);
        this.setState({
          ownerEvents: result.ownerEvents,
          friendEvents: result.friendEvents
        });
      });
      this.props.history.push('/homepage');

    } else if (response.status === 'not_authorized') {
      this.props.history.push('/');
    } else {
      this.props.history.push('/');
    }
  }

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
  checkLoginState() {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  }

  handleClick() {
    FB.login(this.statusChangeCallback.bind(this), {scope: 'public_profile, email'});
  }
  render() {
    return (
       <div className='container'>
         <div className='page-header'>
         </div>
         <div className='col-md-12 login'>
           <h1> Start the Party </h1>
           <h4> With The Click Of A Button </h4>
           <div className='row center'>
           <button className="loginBtn loginBtn--facebook" data-max-rows="1" data-size="xlarge"
           data-show-faces="false" data-auto-logout-link="false" onClick={this.handleClick.bind(this)}>
           Login with Facebook</button>
           </div>
         </div>

       </div>
      )
  }
}

export default Facebook;
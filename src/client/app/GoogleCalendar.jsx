import React from 'react';
import $ from 'jquery';

class GoogleCalendar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      oAuthFinished: false
    }
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);
    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.makeApiCall = this.makeApiCall.bind(this);
  }

  // componentDidMount () {
  //   this.handleClientLoad();
  // }

  handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', this.initClient);
  }

  initClient() {
    gapi.client.init({
      apiKey: process.env.GOOGLE_API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      clientId: '107027858208-ord98kfhrp4f02embrfh1c50229ef00q.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar'
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      gapi.auth2.getAuthInstance().signIn();
      // this.setState({oAuthFinished: true});
    });
  }

  updateSigninStatus(isSignedIn) {
    var authorizeButton = document.getElementById('authorize-button');
    var signoutButton = document.getElementById('signout-button');
    if (isSignedIn) {
      // authorizeButton.style.display = 'none';
      // signoutButton.style.display = 'block';
      this.makeApiCall();
    }
    // else {
    //   authorizeButton.style.display = 'block';
    //   signoutButton.style.display = 'none';
    // }
  }

  handleAuthClick(event) {
    this.handleClientLoad();
    // if (this.state.oAuthFinished) {
    //   gapi.auth2.getAuthInstance().signIn();
    // }
  }

  handleSignoutClick(event) {
    // this.handleClientLoad();
    gapi.auth2.getAuthInstance().signOut();
  }

  // Load the API and make an API call.  Display the results on the screen.
  makeApiCall() {
    var eventName = 'Google I/O 2015';
    var event = {
      'summary': eventName,
      'location': '800 Howard St., San Francisco, CA 94103',
      'description': 'A chance to hear more about Google\'s developer products.',
      'start': {
        'dateTime': '2017-04-02T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': '2017-04-02T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'attendees': [
        {'email': 'johnny.chen54@gmail.com'},
        {'email': 'mc840809@gmail.com'}
      ]
    };

    gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    }).then(() => {
      console.log(`Event: '${eventName}' is now set on your Google Calendar`);
    });

    console.log('making api call');
  }

  render () {
    return (
      <div>
        <button onClick={this.handleAuthClick} id="authorize-button">Set Event on Google Calendar</button>
        <button onClick={this.handleSignoutClick} id="signout-button" style={{display: "none"}}>Sign Out</button>
      </div>
    )
  }
}

export default GoogleCalendar;

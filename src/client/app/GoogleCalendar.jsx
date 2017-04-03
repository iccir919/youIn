import React from 'react';
import $ from 'jquery';

class GoogleCalendar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      adminEmail: '',
      attendeesEmails: []
    };
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.setCalendarEvent = this.setCalendarEvent.bind(this);
    this.getAttendeesEmails = this.getAttendeesEmails.bind(this);
  }

  componentDidMount() {
    this.getAttendeesEmails();
  }

  handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', this.initClient);
  }

  initClient() {
    gapi.client.init({
      apiKey: process.env.GOOGLE_API_KEY,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      clientId: '107027858208-ord98kfhrp4f02embrfh1c50229ef00q.apps.googleusercontent.com',
      fetch_basic_profile: true,
      scope: 'https://www.googleapis.com/auth/calendar'
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn;

      // if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      //   var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
      //   var adminEmail = profile.getEmail();
      //   this.setState({adminEmail: adminEmail});
      //   console.log(this.state.adminEmail);
      // }

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      gapi.auth2.getAuthInstance().signIn();
    });
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.setCalendarEvent();
    }
  }

  handleAuthClick(event) {
    event.preventDefault();
    this.handleClientLoad();
  }

  getAttendeesEmails() {
    var userIdList = [];
    for (var i = 0; i < this.props.event.attendees.length; i++) {
      userIdList.push(+this.props.event.attendees[i].user_id);
    }
    $.ajax({
      url: 'events/users/emails',
      method: 'GET',
      data: {
        user_ids: JSON.stringify(userIdList)
      },
      success: (data) => {
        this.setState({attendeesEmails: data});
      },
      error: (err) => {
        console.log(err, 'AJAX did not succeed');
      }
    })
  }

  // Load the API and make an API call.  Display the results on the screen.
  setCalendarEvent() {
    var emails = [];

    for (var i = 0; i < this.state.attendeesEmails.length; i++) {
      emails.push(this.state.attendeesEmails[i].email);
    }

    var apiEmailArray = [];
    for (var i = 0; i < emails.length; i++) {
      apiEmailArray.push({'email': emails[i]});
    }

    var event = {
      'summary': this.props.event.title,
      'location': this.props.event.location,
      'description': this.props.event.description,
      'start': {
        // 'dateTime': this.props.event.time,
        'dateTime': '2017-04-02T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': '2017-04-02T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'attendees': apiEmailArray
    };

    gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    }).then(() => {
      alert(`Event: '${this.props.event.title}' is now set on you and your guests' Google Calendars`);
    });
  }

  render () {
    return (
      <div>
        <button onClick={this.handleAuthClick} id="authorize-button" className="google-calendar-button">Send Calendar Invite</button>
      </div>
    )
  }
}

export default GoogleCalendar;

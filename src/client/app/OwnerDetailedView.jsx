import React from 'react';
import $ from 'jquery';
import ChatRoom from './ChatRoom.jsx'
import { withGoogleMap } from "react-google-maps";

class OwnerDetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm: false
    }
    this.deleteEvent = this.deleteEvent.bind(this);
    this.updateEventStatus = this.updateEventStatus.bind(this);
    this.initMap = this.initMap.bind(this);
  }

  componentDidMount() {
    this.initMap();
  }

  updateEventStatus(url) {
    $.ajax({
      url: url,
      method: 'POST',
      'Content-type': 'application/json',
      beforeSend: (xhr) => {
        xhr.setRequestHeader ('Authorization', 'Bearer ' + this.props.accessToken);
      },
      data: {
        eventId: JSON.stringify(this.props.event.event_id)
      },
      success: function() {
        console.log('Success');
      },
      error: function(err) {
        console.log('Error in updateEventStatus in OwnerDetailedView.jsx', err);
      }
    });
  }



  deleteEvent () {
    console.log('event DELETED!');
    this.updateEventStatus('/delete/owner');
  }

  initMap() {
    console.log(this.props.event);
    var map = new google.maps.Map(document.getElementById(`${this.props.event.event_id}-map`), {
      zoom: 15,
      center: {
        lat: this.props.event.latitude,
        lng: this.props.event.longitude
      },
    });
    console.log('latitude', this.props.event.latitude);
    console.log('longitude', this.props.event.longitude);
    var marker = new google.maps.Marker({
      position: {
        lat: this.props.event.latitude,
        lng: this.props.event.longitude
      },
      map: map
    });
  }

  render() {
    const attendees = this.props.event.attendees;

    return (
      <div id="event-details" className="event-details row list-item">
        <div className="col-md-8 col-md-offset-1">
          <p>{this.props.event.description}</p>
          <p>{this.props.event.location}</p>
          <div className="attendees">
            <h4> Attendees: </h4>
            <ul>
              {attendees.map((attendee, i) => <li key={i}>{attendee.firstname}</li>)}
            </ul>
          </div>        
          <div className="google-map" id={`${this.props.event.event_id}-map`}></div>
        </div>
        <div className="col-md-12 ">
          <ChatRoom eventId = {this.props.eventId} />
        </div>
        <button id="owner-edit-button">Edit</button>
        <button onClick={this.deleteEvent} id="owner-delete-button" className="col-md-offset-1">Delete</button>
      </div>
    );
  }
}

export default OwnerDetailedView;

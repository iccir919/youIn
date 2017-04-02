import React from 'react';
import FriendDetailedView from './FriendDetailedView.jsx';
import moment from 'moment';
import $ from 'jquery';

class FriendEventListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      accepted: false,
      rejected: false,
      attendees: this.props.event.attendees.length
    }
    //bind methods here
    this.handleClickListItem = this.handleClickListItem.bind(this);
    this.checkEventStatus = this.checkEventStatus.bind(this);
  }
  componentDidMount() {
    this.checkEventStatus();
  }
  //Insert Methods Here
  handleClickListItem() {
    this.setState({clicked: !this.state.clicked});
    console.log(this.state.clicked);
    if (this.state.clicked) {
      this.props.getEvents(this.props.history, function(result) {
        this.setState({
          ownerEvents: result.ownerEvents,
          friendEvents: result.friendEvents
        });
      });
    }
  }

  onAcceptClick () {
    console.log('this is the number or attendees');
    this.setState({ accepted: true, rejected: false, attendees: this.props.event.attendees.length + 1 });
  }

  checkEventStatus () {
    $.ajax({
      url: '/checkStatus',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        eventId: this.props.event.event_id
      }),
      success: (status) => {
        if (status.current_status === 'accepted') {
          this.setState({accepted: true, rejected: false});
        } else if (status.current_status === 'rejected') {
          this.setState({rejected: true, accepted: false});
        }
      },
      error: (err) => {
        console.log('STATUS CHECK FAILED: ', err);
      }
    })
  }


  onRejectClick() {
    console.log(this.state.attendees);
    this.setState({ accepted: false, rejected: true, attendees: this.props.event.attendees.length });
  }

  render() {
    let date = moment(this.props.event.date);
    let accepted = this.state.accepted === true ? "accepted" : null;
    let rejected = this.state.rejected === true ? "rejected" : null;

    

    return (
      <div>
      <div className="panel list-item row" onClick={this.handleClickListItem}>
        <div className="glyphicon glyphicon-globe col-sm-1"></div>
        <div className={`${accepted} ${rejected} col-sm-4`}>{this.props.event.title}</div>
        <div className="col-sm-4">
          {this.props.event.date.split(',').map((date, i) => (
            <div key={i}><input type="radio"/> {date}</div>
          ))}
        </div>
        <div className={`${accepted} ${rejected} col-sm-3`}>{this.state.attendees}<span> people IN</span></div>
        <br/>
      </div>
        {this.state.clicked ? <FriendDetailedView
          updateFriendEvents={this.props.updateFriendEvents}
          accessToken={this.props.accessToken}
          onIn={this.onAcceptClick.bind(this)}
          onOut={this.onRejectClick.bind(this)}
          event={this.props.event}/> : '' }
      </div>
    );
  }
}

export default FriendEventListItem;



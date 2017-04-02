import React from 'react';
import OwnerEventList from './OwnerEventList.jsx';
import FriendEventList from './FriendEventList.jsx';
import CreateEventButton from './CreateEventButton.jsx';
import InviteFriendButton from './InviteFriendButton.jsx';
import LogoutButton from './LogoutButton.jsx';
import Invite from './Invite.jsx';



class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null
    };
  }

  pollEvents() {
    this.props.getEvents(this.props.history, function(result) {

      if (result.ownerEvents.length !== this.state.ownerEvents.length) {
        this.setState({
          ownerEvents: result.ownerEvents
        });
      }
      if (result.friendEvents.length !== this.state.friendEvents.length) {
        this.setState({
          friendEvents: result.friendEvents
        });
      }
    });
  }

  componentDidMount() {
    this.setState({
      intervalId: setInterval(this.pollEvents.bind(this), 1000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.setState({
      intervalId: null
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="page-header">
            <h2 id='userName'>Welcome <span id="headerName">{this.props.userName}</span></h2>
            <LogoutButton />
          </div>
          <Invite />
          <CreateEventButton
            history={this.props.history}
            friends={this.props.friends}
            getEvents={this.props.getEvents}/>
          <br /><br />
          <div className='container events'>
            <br></br><br></br>
            <h2 id="my-events-title" className='header-inner'> My Events</h2>
            <OwnerEventList
              ownerEventsArr={this.props.ownerEvents}
              accessToken={this.props.accessToken}
              getEvents={this.props.getEvents}
              history={this.props.history}
              friends={this.props.friends}/>
          </div>
          <br /><br />
          <div className='container events'>
            <h2 id="friend-events-title"className='header-inner'> Friend Events</h2>
            <FriendEventList accessToken={this.props.accessToken}
              friendEventsArr={this.props.friendEvents}
              getEvents={this.props.getEvents}/>
          </div>
        </div>
      </div>
    )
  }
}


export default Homepage;

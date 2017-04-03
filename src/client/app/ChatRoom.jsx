import React from 'react';
import $ from 'jquery';
import io from 'socket.io-client';
import ChatMessageList from './ChatMessageList.jsx';

const socket = io();

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {input: '', user: null, messages: null};
    this.handleChange = this.handleChange.bind(this);
    this.handleChatMessageSubmit = this.handleChatMessageSubmit.bind(this);
    this.retrieveMessages = this.retrieveMessages.bind(this);
  }

  handleChange(event) {
    this.setState({input: event.target.value});
  }

  retrieveMessages(){
    $.ajax({
      url: '/chatRoom',
      method: 'GET',
      data: {eventId: this.props.eventId},
      success: function(data) {
        this.setState({messages: data});
      }.bind(this),
      error: function(err) {
        console.log('error in ajax request in ChatRoom', err);
      }
    })
  }

  handleChatMessageSubmit(event) {
    event.preventDefault();
    let messageData = {
      message: this.state.input,
      user: this.state.user,
      eventId: this.props.eventId
    };
    $.ajax({
      url: '/chatRoom',
      method: 'POST',
      data: JSON.stringify(messageData),
      contentType: 'application/json',
      success: function() {
        socket.emit('sentMessage');
        this.retrieveMessages();
      }.bind(this),
      error: function(err) {
        console.log('error in ajax request in ChatRoom', err);
      }
    });
  }

  componentDidMount(){
    socket.on('newMessage', function(){
      this.retrieveMessages();
    }.bind(this));
  }

  componentWillMount(){
    $.ajax({
      url: '/user',
      method: 'GET',
      success: function(data) {
        this.setState({user: data[0]});
      }.bind(this),
      error: function(err) {
        console.log('error in ajax request in ChatRoom', err);
        this.props.history.push('/');
      }
    })
    this.retrieveMessages();
  }

  render() {
    return (
      <div>
        <ChatMessageList messages={this.state.messages}/>
        <form onSubmit={this.handleChatMessageSubmit}>
          <input id="m" type="text" value={this.state.input} onChange={this.handleChange}/>
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default ChatRoom;

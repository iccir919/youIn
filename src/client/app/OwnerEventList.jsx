import React from 'react';
import OwnerEventListItem from './OwnerEventListItem.jsx'

const OwnerEventList = (props) => (
  <div className='eventlist container-fluid'>
    {props.ownerEventsArr.map((event, i) => <OwnerEventListItem accessToken={props.accessToken} history={props.history} key={i} event={event} getEvents={props.getEvents}/>)}  
  </div>
)
export default OwnerEventList;



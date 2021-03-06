import React from 'react';
import { fade, parseAgain } from './utils';

// console.log("THIS IS THE PARSE FUNCTION", parseAgain);

const CollectionModel = ({item}) => {
  const url = item.yelpData.url;
  const yelpRating = item.yelpData.rating;
  const address = item.yelpData.address;
  // console.log("Parsed name!!!", parseAgain(item.name));
  return (
  <div id='restaurant' className='restaurant card' >
    <img className='card-img-top' src={item.yelpData.image || 'http://bit.ly/2e99Pwd'} />
    <div className='card-block'>
      <h4 className='card-title'><a href={url} target="_blank">{parseAgain(item.name)}</a></h4>
    </div>
    <ul className='list-group list-group-flush'>
      <li className='list-group-item'>Address: <p style={{fontSize: '12px'}}>{address || 'No Address Given'}</p></li>
      <li className='list-group-item'>Your Rating: {item.rating || 'No Rating Given'}</li>
      <li className='list-group-item'>Yelp Rating: {yelpRating || 'No Rating Given'}</li>
      <li className='list-group-item'>Type: {item.yelpData.cuisine || 'No Type Given'}</li>
    </ul>
  </div>
 );
};


export default CollectionModel;

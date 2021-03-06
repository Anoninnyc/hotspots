import React from 'react';
import {
  connect
}
from 'react-redux';
import {
  bindActionCreators
}
from 'redux';
import CollectionModel from '../components/CollectionModel';
import ResultModel from '../components/ResultModel';
import FilterItem from '../components/FilterItem';
import FriendModel from '../components/FriendModel';
import * as Actions from '../actions';
//import { fade } from './utils';
import request from 'superagent';
import _ from 'lodash';

function fade(el) {
  $(el).fadeIn(1000);
  $(el).fadeOut(1000);
}

const Menu = require('react-burger-menu').slide;

class Panel extends React.Component {

  componentDidMount() {
    this.props.actions.fetchCollection();
    this.props.actions.fetchFriendRequests();
    this.props.actions.fetchCurrentFriends();
    console.log('panel has mounted!!!');
  }

  submitFriendReq(e) {
    e.preventDefault();

    let friendRequest = {
      requestee: document.getElementsByClassName('friendToAdd')[0].value
    };

    if (!friendRequest.requestee.length) {
      return;
    }

    console.log(friendRequest);
    const data = new Promise((resolve, reject) => {
      request.post('/api/friendRequest')
        .send(friendRequest)
        .end((err, res) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          document.getElementsByClassName('friendToAdd')[0].value = '';
          console.log('response test', res.text);
          if (res.text.indexOf('exist') !== -1) {
            fade(".doesntExist");
          } else if (res.text.indexOf('request sent') !== -1) {
            fade(".requestSent");
          } else if (res.text.indexOf('already send') !== -1) {
            fade(".alreadySent");
          } else if (res.text.indexOf('yourself!') !== -1) {
            fade(".dontSelf");
          } else {
            fade(".alreadyAFriend");
           // document.getElementsByClassName("alreadyAFriend")[0].style.display = 'inline';
          }
          return resolve(res);
        });
    });
  }

  render() {
    let panelItems;
    this.props.actions.createFilters(this.props.collection, this.props.filters);
    if (this.props.panelMode === 'friendRequests') {
   
      panelItems = <div>
        <div>
          <input className='friendToAdd ' type='text' placeholder='Add a Friend' />
          <br />
          <br />
          <button className='button' onClick={this.submitFriendReq.bind(this)}>Send Request</button>
          <br />
          {!this.props.friendRequests.length ?
          <p className="noPending">No pending friend requests</p> : null}
          <br />
          <div className='mess alreadyAFriend'> Already a friend </div>
          <div className='mess doesntExist'> This Person hasn't signed up </div>
          <div className='mess requestSent'> Request Sent! </div>
          <div className='mess alreadySent'> Already sent a friend request </div>
          <div className='mess dontSelf'> You can't friend yourself! </div>
        </div>
        <div>

          {this.props.friendRequests.map(person => (
              <FriendModel 
                item = {person} 
              />
          ))}

          </div>
          <br />
          <div>{!!this.props.currFriends.length ? <h4>Your current friends </h4> : '' } </div>
          <div id="currFriendsList">
          {this.props.currFriends.map(person =>{
            return (<div className = "currFriend">
              {person.friendname}
              </div>);
          })}
          </div>
      </div>;

    } else if (this.props.panelMode === 'results') {
      if (!this.props.searchResults.length) {
        panelItems = <div><p className="panelHeader">Search Something!</p></div>;
      } else {
       // console.log("These should show panel results", this.props.searchResults);
        panelItems = this.props.searchResults.map(restaurant => (
      <ResultModel 
        item={restaurant}
        viewCollectionItem={this.props.actions.viewCollectionItem}
        key={restaurant.name}
      />
    ));
      }
    } else if (this.props.panelMode === 'help') {

      panelItems = <div id="instructions">
       <h2>Instructions</h2><br/>
       <div>Step 1: Zoom in on your desired location</div>
       <div>Step 2: Search for something, and view results on the map as fists</div>
       <div>Step 3: To add to your collection, hover over a fist (hotspot) and rate it</div>
       <br/>
       <div>You can:</div>
       <div>- Send and accept friend requests.</div>
       <div>- Filter map results.</div>
       <div>- View your collection.</div>
       <div>- Broadcast to all your friends that you'd like to go to visit a particular spot by clicking the icon to the right of the spot's image ("Make a wish"). 
       <div>You'll see the spot you wish to visit as a pink heart. If any of your friends also wish to visit the spot, the heart will turn red.</div>
       <div>- Accept the hotspots your friends "wish" to visit by clicking on any of their wishes (which you'll see as stars).</div>
       </div>
       </div>;

    } else if (this.props.panelMode === 'filter') {
      panelItems = 
      this.props.filters.map(filter => 
        <FilterItem 
          filter={filter}
          appliedFilters={this.props.filterSelected}
          toggleFilter={this.props.actions.toggleFilter}
          collection={this.props.collection}
          key={filter}
        />
      );
    } else if (this.props.filteredCollection.length !== 0) {

      panelItems = this.props.filteredCollection.map(restaurant => (
        <CollectionModel 
          item={restaurant} 
          key={restaurant.name}
        />
      ));
    } else if (this.props.panelMode === 'collection') {

     // console.log("This should be the collection", this.props.totalCollection,"other collection",this.props.collection);

      if (!this.props.collection.length) {
        panelItems = <div><p className="panelHeader">Add some places to your collection!</p></div>;
      } else {
        panelItems = _.uniqBy(this.props.collection, 'yelpData.businessId').map(restaurant => (
                <CollectionModel 
                  item={restaurant}
                  viewCollectionItem={this.props.actions.viewCollectionItem}
                  key={restaurant.name}
                />
            ));
      }
    }
    return (
      <Menu style={{color: 'blue'}}
      id={ 'panel' }
            right
            noOverlay
            customBurgerIcon={ false }
            customCrossIcon={ false }
            isOpen={ this.props.isOpen }>
        {panelItems}
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    totalCollection: state.CollectionRestaurantsFilters.collection,
    filters: state.FilterSelectedRestaurants.filters,
    filterSelected: state.FilterSelectedRestaurants.filterSelected,
    filteredCollection: state.FilterSelectedRestaurants.filteredRestaurants,
    panelMode: state.PanelMode.panelMode,
    isOpen: state.PanelMode.isOpen,
    searchResults: state.SearchBar.searchResults,
    friendRequests: state.FriendReqs.friendReqs,
    currFriends: state.CurrFriends.currFriends
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel);

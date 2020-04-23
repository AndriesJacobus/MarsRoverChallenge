import React from 'react';
import PropTypes from "prop-types"
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';

class CustomMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      path: [
        { lat: 47.6307081, lng: -122.1434325 },
        { lat: 47.2052192687988, lng: -121.988426208496 }
      ],
      stores: [
        { lat: 47.49855629475769, lng: -122.14184416996333 },
        { latitude: 47.359423, longitude: -122.021071 },
        { latitude: 47.2052192687988, longitude: -121.988426208496 },
        { latitude: 47.6307081, longitude: -122.1434325 },
        { latitude: 47.3084488, longitude: -122.2140121 },
        { latitude: 47.5524695, longitude: -122.0425407 }
      ]
    }
  }

  displayMarkers = () => {
    return this.state.stores.map((store, index) => {
      return  <Marker 
        key={index} 
        id={index} 
        position={{
          lat: store.latitude,
          lng: store.longitude
        }}
      
        onClick={() => console.log("You clicked me!")}
      />
    })
  }

  render() {
    const mapStyles = {
      width: "60vw",
      height: '50%',
      marginLeft: '10%',
    };

    return (
      <div className="wrapper">
        <Map
          className="map"
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176 }} >

          {this.displayMarkers()}
          <Polyline path={this.state.path} options={{ strokeColor: "#FF0000 " }} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB2or4v6xRW5OpQW9SuqFgEiL_YNprmjTI',
})(CustomMap);

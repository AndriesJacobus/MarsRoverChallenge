import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Map, GoogleApiWrapper, Marker, Polyline, InfoWindow } from 'google-maps-react';
import CustomTreeView from './CustomTreeView';

React.useLayoutEffect = React.useEffect

class GoogleMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      perimeterIndex: null,
      showPerDel: false,

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
      ],

      markers: [
        {
          title: "Device 3AB6DA",
          position: { lat: 47.6307081, lng: -122.1434325 },
        }
      ],

      showInfo: false,
      markerInfo: {
        markerIndex: null,
        title: "",
        position: {
          lat: 47.6307081,
          lng: -122.1434325
        },
      },

      drawPerimeter: false,
      perimeters: [
        {
          path: [
            { lat: 47.6307081, lng: -122.1434325 },
            { lat: 47.2052192687988, lng: -121.988426208496 }
          ],
        },
      ],
      newPerimeterStart: null,
      newPerimeterEnd: null,
    }

    this.domNode = null;
    this.onClick = this.onClick.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.deleteMarker = this.deleteMarker.bind(this);
    this.toggleDrawPerimeter = this.toggleDrawPerimeter.bind(this);
    this.deletePerimeter = this.deletePerimeter.bind(this);
  }

  onComponentDidMount() {
  }

  onClick(t, map, coord) {
    if (this.state.drawPerimeter) {
      const { latLng } = coord;
      const _lat = latLng.lat();
      const _lng = latLng.lng();

      // Is this the start or end of the perimeter?
      if (this.state.newPerimeterStart == null) {
        // Start of perimeter

        this.setState({
          newPerimeterStart: {
            lat: _lat,
            lng: _lng,
          }
        });
      } else {
        // End of perimeter

        this.setState({
          newPerimeterEnd: {
            lat: _lat,
            lng: _lng,
          }
        });

        this.pushNewPerimeterAndClear();
      }
    } else {
      this.placeMarker(coord);
    }
  };

  placeMarker(coord) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    this.setState({
      showInfo: false,
      markers: [
        ...this.state.markers,
        {
          title: "T",
          name: "T",
          position: { lat, lng },
        }
      ],
    });

    this.setState({
      showPerDel: false,
      perimeterIndex: null,
    });
  };

  drawMarker = (marker, index) => {
    return <Marker
      key={index}
      id={index}
      title={marker.title}
      position={marker.position}
      draggable={true}
      onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, index)}
      onClick={() => this.showInfo(marker, index)}
    />
  };

  drawPerimeter = (perimeter, index) => {
    return <Polyline
      key={index}
      id={index}
      path={perimeter.path}
      options={{ strokeColor: "#42a5f5", strokeOpacity: 0.5, strokeWeight: 10, }}
      onClick={() => this.setPerIndex(index)}
    />
  }

  onMarkerDragEnd(coord, index) {
    // Remove old entry
    this.state.markers.splice(index, 1);

    // Add updated entry
    this.onClick("", "", coord);
  }

  showInfo = (marker, index) => {
    // alert(JSON.stringify(marker.position));
    this.setState({
      showInfo: true,
      markerInfo: {
        markerIndex: index,
        title: marker.title,
        name: marker.name,
        position: marker.position,
      },
    });
  };

  hideInfo() {
    this.setState({
      showInfo: false,
      markerInfo: {
        markerIndex: null,
        title: "",
        position: {
          lat: 47.6307081,
          lng: -122.1434325
        },
      },
    });
  };

  deleteMarker(event) {
    event.preventDefault();

    this.state.markers.splice(this.state.markerInfo.markerIndex, 1);
    this.hideInfo();
  };

  deletePerimeter(event) {
    event.preventDefault();

    this.state.perimeters.splice(this.state.perimeterIndex, 1);
    this.setState({
      showPerDel: false,
      perimeterIndex: null,
    });
  };

  toggleDrawPerimeter() {
    this.setState({
      drawPerimeter: !this.state.drawPerimeter,
    });

    if (!this.state.drawPerimeter) {
      this.setState({
        newPerimeterStart: null,
        newPerimeterEnd: null,
      });
    }
  }

  pushNewPerimeterAndClear() {
    this.setState({
      perimeters: [
        ...this.state.perimeters,
        {
          path: [
            this.state.newPerimeterStart,
            this.state.newPerimeterEnd,
          ],
        }
      ],
    });

    this.toggleDrawPerimeter();
  }

  setPerIndex(index) {
    this.setState({
      showPerDel: true,
      perimeterIndex: index,
    });
  }

  render() {

    return (
      <div className="wrapper">

        <div style={actionStyle}>

          <span style={bannerTextStyle}>
            Map Actions:
          </span>

          <div style={{ lex: 1, flexDirection: 'row' }}>
            
            <div style={deleteMarkerStyle}>
              <a
                className="waves-effect waves-light primary btn"
                onClick={this.toggleDrawPerimeter} >

                {
                  (this.state.drawPerimeter) ? (
                    <i className="material-icons right">check</i>
                  ) :
                    <i className="material-icons right">add_circle</i>
                }
                
                Draw Perimeter
              </a>
            </div>

            {
              (this.state.showPerDel) ? (
                <div style={deleteMarkerStyle}>
                  <a
                    className="waves-effect waves-light red btn"
                    onClick={this.deletePerimeter} >

                    <i className="material-icons right">delete</i>
                    Delete Perimeter
                  </a>
                </div>
              ) :
                <div style={deleteMarkerStyle}>
                  <div
                    className="btn disabled" style={disabledActionStyle}>

                    <i className="material-icons right">delete</i>
                    Delete Perimeter
                  </div>
                </div>
            }

            {
              (this.state.showInfo) ? (
                <div style={deleteMarkerStyle}>
                  <a
                    className="waves-effect waves-light red btn"
                    onClick={this.deleteMarker} >

                    <i className="material-icons right">delete</i>
                    Delete Marker
                  </a>
                </div>
              ) :
                <div style={deleteMarkerStyle}>
                  <div
                    className="btn disabled" style={disabledActionStyle}>

                    <i className="material-icons right">delete</i>
                    Delete Marker
                  </div>
                </div>
            }
          </div>

        </div>

        <Map
          ref={node => this.domNode = node}
          className="map"
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176 }}
          mapTypeControl={false}
          streetViewControl={false}
          onClick={this.onClick} >

          {
            this.state.markers.map((marker, index) => {
              return this.drawMarker(marker, index);
            })
          }

          {
            this.state.perimeters.map((perimeter, index) => {
              return this.drawPerimeter(perimeter, index);
            })
          }

          <InfoWindow
            visible={this.state.showInfo}
            onCloseClick={this.hideInfo}
            onClose={this.hideInfo}

            position={{
              lat: this.state.markerInfo.position.lat,
              lng: this.state.markerInfo.position.lng,
            }} >

            <div>
              <p style={infoTitle}>{this.state.markerInfo.title}</p>
            </div>

          </InfoWindow>

        </Map>

        <div style={elementsStyle}>

          <span style={bannerTextStyle}>
            Map Elements:
          </span>

          <div style={{ margin: 15, }} />

          <CustomTreeView />
        </div>

      </div>
    );
  }
}

const mapStyles = {
  width: "60vw",
  height: '50%',
  marginLeft: '10%',
};
const infoTitle = {
  fontSize: 18,
};
const actionStyle = {
  top: 0,
  padding: 20,
  backgroundColor: '#E1F2FE',
  width: '85vw',
  marginBottom: 5,
  borderRadius: 10,
};
const bannerTextStyle = {
  color: 'black',
  fontSize: 14,
  textDecoration: 'underline',
};
const deleteMarkerStyle = {
  marginTop: 15,
  marginRight: 10,
  display: 'inline-block',
};
const disabledActionStyle = {
  borderStyle: 'dotted',
  paddingBottom: 5,
  borderWidth: 1,
};
const elementsStyle = {
  position: 'relative',
  width: '24.6vw',
  left: '60vw',
  height: '50vh',
  backgroundColor: '#E1F2FE',
  padding: 20,
  marginLeft: 5,
  borderRadius: 5,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB2or4v6xRW5OpQW9SuqFgEiL_YNprmjTI',
})(GoogleMap)

import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Map, GoogleApiWrapper, Marker, Polyline, InfoWindow } from 'google-maps-react';
import CustomTreeView from './CustomTreeView';
import SortableTreeView from './SortableTreeView';

React.useLayoutEffect = React.useEffect

class GoogleMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      // Marker Data
      // markers: [
      //   {
      //     title: "Device 3AB6DA",
      //     position: { lat: 47.6307081, lng: -122.1434325 },
      //   }
      // ],
      markers: [],

      // Marker InfoWindow Data
      showInfo: false,
      markerInfo: {
        id: null,
        markerIndex: null,
        title: "",
        position: {
          lat: 47.6307081,
          lng: -122.1434325
        },
      },

      // Perim Data
      drawPerimeter: false,
      // perimeters: [
      //   {
      //     name: "Perimeter 1",
      //     path: [
      //       { lat: 47.6307081, lng: -122.1434325 },
      //       { lat: 47.2052192687988, lng: -121.988426208496 }
      //     ],
      //   },
      // ],
      perimeters: [],

      // Data for adding new Perim 
      newPerimeterStart: null,
      newPerimeterEnd: null,

      // Delete Perim data
      perimeterIndex: null,
      showPerDel: false,

      // Perim InfoWindow Data
      perInfoTitle: "Perimeter",
      perInfoLat: 47.6307081,
      perInfoLng: -122.1434325,

      // Data for adding new marker form treeview
      deviceFromTreeSelected: false,
      deviceFromTree: null,
    }

    this.domNode = null;
    this.tree = null,

    this.onClick = this.onClick.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
    this.deleteMarker = this.deleteMarker.bind(this);
    this.toggleDrawPerimeter = this.toggleDrawPerimeter.bind(this);
    this.deletePerimeter = this.deletePerimeter.bind(this);
    this.handleKey = this.handleKey.bind(this);
    
    this.onDeviceClicked = this.onDeviceClicked.bind(this);
    this.hidePerimInfo = this.hidePerimInfo.bind(this);
    this.triggerPerimAdd = this.triggerPerimAdd.bind(this);

    this.addInitialDevicesAndPerimeters = this.addInitialDevicesAndPerimeters.bind(this);
    this.publishNewPerim = this.publishNewPerim.bind(this);
    this.onDeviceDragged = this.onDeviceDragged.bind(this);
  }

  componentDidMount(){
    // Load devices
    this.addInitialDevicesAndPerimeters();
  }

  handleKey(e) {
    if(e.keyCode == 46) {
      if (this.state.showPerDel) {
        // Delete perimeter
        this.deletePerimeter(e);
      } else if (this.state.showInfo) {
        // Delete marker
        this.deleteMarker(e);
      }
    }
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

  placeMarker(coord, id = 0, name = "") {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (this.state.deviceFromTreeSelected) {
      // First time placing marker
      // Todo: make sure device names are unique

      var index = this.state.markers.findIndex(x => x.title == this.state.deviceFromTree.name);

      if (index == -1) {
        // Marker with device name not yet placed
        this.setState({
          showInfo: false,
          markers: [
            ...this.state.markers,
            {
              id: this.state.deviceFromTree.id,
              title: name == "" ? this.state.deviceFromTree.name : name,
              name: name == "" ? this.state.deviceFromTree.name : name,
              position: { lat, lng },
            }
          ],
        }, () => {
          this.publishMarkerLoc(this.state.markers[this.state.markers.length - 1]);
        });
      }
    }
    else if (name != "") {
      // Marker dragged - Redraw
      this.setState({
        showInfo: false,
        markers: [
          ...this.state.markers,
          {
            id: id,
            title: name,
            name: name,
            position: { lat, lng },
          }
        ],
      }, () => {
        this.publishMarkerLoc(this.state.markers[this.state.markers.length - 1]);
      });
    } else {
      //  Click on map - Hide infowindow
      this.setState({
        showInfo: false,
      });
    }

    this.setState({
      showPerDel: false,
      perimeterIndex: null,

      perInfoLat: 47.6307081,
      perInfoLng: -122.1434325,

      deviceFromTreeSelected: false,
      deviceFromTree: null,
    });
  };

  drawMarker = (marker, index) => {
    return <Marker
      key={index}
      id={index}
      title={marker.title}
      position={marker.position}
      draggable={true}
      icon={{
        url: this.props.markerIconUrl,
        scaledSize: new window.google.maps.Size(40,40),
      }}
      onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, marker.id, marker.title, index)}
      onClick={() => this.showInfo(marker, index)}
    />
  }

  onMarkerDragEnd(coord, id, name, index) {
    // Remove old entry
    this.state.markers.splice(index, 1);

    // Add updated entry
    this.placeMarker(coord, id, name);
  }

  drawPerimeter = (perimeter, index) => {
    return <Polyline
      key={index}
      id={index}
      path={perimeter.path}
      editable={false}
      draggable={false}
      options={{ strokeColor: "#42a5f5", strokeOpacity: 0.5, strokeWeight: 10, }}
      onClick={() => this.setPerIndex(index)}
    />
  }

  showInfo = (marker, index) => {
    // alert(JSON.stringify(marker.position));
    this.setState({
      showInfo: true,
      markerInfo: {
        id: marker.id,
        markerIndex: index,
        title: marker.title,
        name: marker.name,
        position: marker.position,
      },
    });

    this.setState({
      showPerDel: false,

      perInfoLat: 47.6307081,
      perInfoLng: -122.1434325,

      perimeterIndex: null,
    });
  };

  hideInfo() {
    this.setState({
      showInfo: false,
      markerInfo: {
        id: null,
        markerIndex: null,
        title: "",
        position: {
          lat: 47.6307081,
          lng: -122.1434325
        },
      },

      deviceFromTreeSelected: false,
      deviceFromTree: null,
    });
  };

  deleteMarker(event) {
    if (event) {
      event.preventDefault();
    }

    // Erase marker coordinates in db
    this.publishMarkerLoc({
      id: this.state.markerInfo.id,
      position: {
        lat: null,
        lng: null,
      }
    });

    // Remove marker from map
    this.state.markers.splice(this.state.markerInfo.markerIndex, 1);
    this.hideInfo();
  };

  publishMarkerLoc(marker) {
    let body = JSON.stringify({
      DeviceId: marker.id,
      DeviceLat: marker.position.lat,
      DeviceLng: marker.position.lng,
    });

    fetch('/client_groups/' + this.props.curr_client_group + '/update_marker_loc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.props.auth_token,
      },
      body: body,
    }).then(response => response.json())
    .then(response => {
        console.log(response);
    });
  }

  deletePerimeter(event) {
    event.preventDefault();

    // Delete perimeter from db
    this.publishDeletePerimeter(this.state.perInfoTitle);

    // Delete perimeter from tree
    this.triggerPerimRemove(this.state.perInfoTitle);

    // Delete perimeter from map view 
    this.state.perimeters.splice(this.state.perimeterIndex, 1);
    this.setState({
      showPerDel: false,
      perimeterIndex: null,
    });
  };

  publishDeletePerimeter(perimeterTitle) {
    let body = JSON.stringify({
      MapGroupName: perimeterTitle,
    });

    fetch('/client_groups/' + this.props.curr_client_group + '/delete_map_group', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.props.auth_token,
      },
      body: body,
    }).then(response => response.json())
    .then(response => {
        console.log(response);
    });
  }

  toggleDrawPerimeter() {
    // Hide infowindow
    this.hidePerimInfo();

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
    // Get per name
    var perName = this.generatePerName();

    this.setState({
      perimeters: [
        ...this.state.perimeters,
        {
          name: perName,
          path: [
            this.state.newPerimeterStart,
            this.state.newPerimeterEnd,
          ],
        }
      ],
    });

    this.triggerPerimAdd(perName);
    this.toggleDrawPerimeter();

    this.publishNewPerim(this.state.perimeters[this.state.perimeters.length - 1]);
  }

  generatePerName(){
    let perI = 1;
    let visited = [];

    this.state.perimeters.forEach(perimeter => {
      let curr = parseInt(perimeter.name.split(" ")[1]);
      visited.push(curr);
    });

    visited.sort(function(a, b){return a-b});

    if (perI >= visited[0]) {
      for (let i = 0; i < visited.length; i++) {

        if (visited[i + 1]) {
          if (visited[i + 1] != visited[i] + 1) {
            perI = visited[i] + 1;
            break;
          }
        } else {
          perI = visited[i] + 1;
        }
      }
    }
    
    return "Perimeter " + perI;
  }

  publishNewPerim(perimeter) {
    let body = JSON.stringify({
      MapGroupName: perimeter.name,
      MapGroupStartLat: perimeter.path[0].lat,
      MapGroupStartLon: perimeter.path[0].lng,
      MapGroupEndLat: perimeter.path[1].lat,
      MapGroupEndLon: perimeter.path[1].lng,
    });

    fetch('/client_groups/' + this.props.curr_client_group + '/add_map_group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.props.auth_token,
      },
      body: body,
    }).then(response => response.json())
    .then(response => {
        console.log(response);
    });
  }

  setPerIndex(index) {
    this.setState({
      perimeterIndex: index,
      perInfoTitle: this.state.perimeters[index].name,
      showPerDel: true,

      perInfoLat: this.getMidpoint(
        this.state.perimeters[index].path[0].lat,
        this.state.perimeters[index].path[1].lat),
      perInfoLng: this.getMidpoint(
        this.state.perimeters[index].path[0].lng,
        this.state.perimeters[index].path[1].lng),
    });

    this.hideInfo();
  }

  hidePerimInfo() {
    this.setState({
      showPerDel: false,
      perimeterIndex: null,
      perInfoTitle: "Perimeter",

      perInfoLat: 47.6307081,
      perInfoLng: -122.1434325,

      deviceFromTreeSelected: false,
      deviceFromTree: null,
    });
  }

  getMidpoint(p1, p2) {
    return (p1 + p2) / 2;
  }

  onDeviceClicked(e, isDevice, item) {
    e.preventDefault();
    
    // console.log(e);
    // console.log(item);

    if (isDevice) {
      this.setState({
        deviceFromTreeSelected: true,
        deviceFromTree: {
          id: item.id,
          name: item.title,
        },
      });

      // Find marker and show
      
    } else {
      // Todo: Show perimeter info
    }
  }

  triggerPerimAdd(title = "Perimeter") {
    this.tree.addNewNode({
      treeIndex: 0,
      title: title,
      isDevice: false,
    });
  }

  triggerPerimRemove(title = "Perimeter") {
    this.tree.removeNode({
      title: title,
    });
  }

  addInitialDevicesAndPerimeters() {
    // Build devicesAndPerimeters
    let devicesAndPerimeters = [];

    // console.log(this.props.devices);
    // console.log(this.props.map_groups);

    this.props.devices.forEach(device => {
      if (!device.map_group_id) {
        // Add to tree because the device is not
        // yet associated with a perimeter

        devicesAndPerimeters.push({
          // Todo: Add device state, alarm, etc
          id: device.id,
          title: device.Name,
          isDevice: true,
          treeIndex: 0,
        });
      }
    });

    // Place on relevant loc on map (trigger onClick)
    this.placeDevicesFromProps();

    this.props.map_groups.forEach(map_group => {

      if (map_group.devices.length >= 1) {

        devicesAndPerimeters.push({
          title: map_group.Name,
          isDevice: false,
          treeIndex: 0,
          children: [],
        });

        // Add perimeter children
        let perimChildrenRef = devicesAndPerimeters[devicesAndPerimeters.length - 1].children;

        map_group.devices.forEach((device) => {
          perimChildrenRef.push({
            id: device.id,
            title: device.Name,
            isDevice: true,
          });
        });

      } else {

        devicesAndPerimeters.push({

          title: map_group.Name,
          isDevice: false,
          treeIndex: 0,
          children: [],
        });

      }

    });

    // Place each map_group on relevant loc on map (trigger perimeter add)
    this.placePerimsFromProps();

    // Push devices and perims
    this.tree.addNewNodes(devicesAndPerimeters);
  }

  placePerimsFromProps(i = 0) {
    if (this.props.map_groups && this.props.map_groups[i]) {
      let currPerim = this.props.map_groups[i];

      // Add perim to map
      this.setState({
        perimeters: [
          ...this.state.perimeters,
          {
            name: currPerim.Name,
            path: [
              {
                lat: currPerim.startLat,
                lng: currPerim.startLon,
              },
              {
                lat: currPerim.endLat,
                lng: currPerim.endLon,
              }
            ],
          }
        ],
      }, () => {
        // console.log(currPerim.Name);
        this.placePerimsFromProps(i + 1);
      });
    }
  }

  placeDevicesFromProps(i = 0) {
    if (this.props.devices && this.props.devices[i]) {
      let currDevice = this.props.devices[i];

      if (currDevice.Latitude && currDevice.Longitude) {
        // Add perim to map
        this.setState({
          markers: [
            ...this.state.markers,
            {
              id: currDevice.id,
              title: currDevice.Name,
              name: currDevice.Name,
              position: {
                lat: currDevice.Latitude,
                lng: currDevice.Longitude,
              },
            }
          ],
        }, () => {
          // console.log("Added to map: " + currDevice.Name);
          this.placeDevicesFromProps(i + 1);
        });
      } else {
        // console.log("Only added to tree: " + currDevice.Name);
        this.placeDevicesFromProps(i + 1);
      }
    }
  }

  onDeviceDragged(device, perimeter) {
    if (perimeter.id == 'root') {
      // Todo: Publish to delete device from perimeter

    } else {
      // Device added to perimeter

      let body = JSON.stringify({
        MapGroupName: perimeter.title,
        DeviceId: device.id,
      });
  
      fetch('/client_groups/' + this.props.curr_client_group + '/add_device_to_map_group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.props.auth_token,
        },
        body: body,
      }).then(response => response.json())
      .then(response => {
          console.log(response);
      });
    }
  }

  render() {
    return (
      <div className="wrapper" onKeyUp={this.handleKey}>

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
                    <i className="material-icons right">cancel</i>
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

          {
            this.state.drawPerimeter && this.state.newPerimeterStart &&
            <Marker
              title={"Perimeter Start"}
              position={this.state.newPerimeterStart}
              icon={{
                url: this.props.perimIconUrl,
                scaledSize: new window.google.maps.Size(30,30),
              }}
            />
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

          <InfoWindow
            visible={this.state.showPerDel}
            onCloseClick={this.hidePerimInfo}
            onClose={this.hidePerimInfo}

            position={{
              lat: this.state.perInfoLat,
              lng: this.state.perInfoLng,
            }} >

            <div>
              <p style={infoTitle}>{this.state.perInfoTitle}</p>
            </div>

          </InfoWindow>

        </Map>

        <div style={elementsStyle}>

          <span style={bannerTextStyle}>
            Map Elements:
          </span>

          <div style={{ margin: 15, }} />

          {/* <CustomTreeView onDeviceClicked={this.onDeviceClicked} /> */}
          <SortableTreeView
            ref={tree => this.tree = tree}
            onDeviceClicked={this.onDeviceClicked}
            onDeviceDragged={this.onDeviceDragged}
          />

        </div>

      </div>
    );
  }
}

const mapStyles = {
  width: "60vw",
  height: '60%',
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
  height: '60vh',
  backgroundColor: '#E1F2FE',
  padding: 20,
  marginLeft: 5,
  borderRadius: 5,
};

GoogleMap.propTypes = {
  markerIconUrl: PropTypes.string,
  perimIconUrl: PropTypes.string,
  curr_client_group: PropTypes.number,
  devices: PropTypes.array,
  map_groups: PropTypes.array,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB2or4v6xRW5OpQW9SuqFgEiL_YNprmjTI',
})(GoogleMap)

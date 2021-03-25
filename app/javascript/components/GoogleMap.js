import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Map, GoogleApiWrapper, Marker, Polyline, InfoWindow } from 'google-maps-react';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ActionCable from 'actioncable';
import CustomTreeView from './CustomTreeView';
import SortableTreeView from './SortableTreeView';
import SoundPlayer from './SoundPlayer';
import Sound from 'react-sound';

React.useLayoutEffect = React.useEffect

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class GoogleMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      // Marker Data
      // markersFormat: [
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
        state: "online",
        offline_acknowledged: null,
      },

      // Perim Data
      drawPerimeter: false,
      // perimetersFormat: [
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
      perInfoState: "",

      // Data for adding new marker form treeview
      deviceFromTreeSelected: false,
      deviceFromTree: null,

      // Ack window show
      showAckWindow: false,
      stateToAck: "",
      alarmReason: "",
      alarmNotes: "",

      mapRef: null,
      currentZoom: this.props.saved_zoom,
      snackOpen: false,
      fullscreenActive: false,
      showReasonInfoWindow: false,

      offlinePlaying: Sound.status.STOPPED,
      perimeterPlaying: Sound.status.STOPPED,
    }

    this.domNode = null;
    this.tree = null,
    this.sub = null;
    this.spRef = null;
    this.infoModalInput1Ref = null;
    this.infoModalInput2Ref = null;

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

    this.updateDeviceState = this.updateDeviceState.bind(this);
    this.updatePerimState = this.updatePerimState.bind(this);
    // this.onlineMarker = this.onlineMarker.bind(this);
    // this.offlineMarker = this.offlineMarker.bind(this);
    this.handleAlarmReason = this.handleAlarmReason.bind(this);
    this.handleAlarmNotes = this.handleAlarmNotes.bind(this);

    this.handleLiveData = this.handleLiveData.bind(this);
    this.stopOrStartPerimeterAlarm = this.stopOrStartPerimeterAlarm.bind(this);

    this.saveZoomLevel = this.saveZoomLevel.bind(this);
    this.handleSnackClose = this.handleSnackClose.bind(this);    
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.handleAckWindowClose = this.handleAckWindowClose.bind(this);
    this.renderInfoModal = this.renderInfoModal.bind(this);
  }

  componentDidMount(){
    // Load devices
    this.addInitialDevicesAndPerimeters();

    // Setup ActionCable
    let cable = ActionCable.createConsumer(this.props.cable_url);
    this.sub = cable.subscriptions.create({
        channel: 'LiveMapChannel',
        id: this.props.curr_client_group
      }, {
        received: this.handleLiveData
      }
    );

    // Full screen Listeners
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange, false)
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange, false)
    document.addEventListener('msfullscreenchange', this.handleFullscreenChange, false)
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange, false) //IE11
    document.addEventListener('fullscreenchange', this.handleFullscreenChange, false)
    
  }

  componentWillUnmount() {
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('msfullscreenchange', this.handleFullscreenChange)
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange)
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
  }

  handleFullscreenChange = (e) => {
    let fullscreen = false;

    if (document.fullscreenElement ||
      document.mozFullScreenElement||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreene ||
      document.fullScreenMode ) {
      fullscreen = true
    }

    // console.log(fullscreen);

    this.setState ({
      fullscreenActive: fullscreen,
    })
  }

  handleLiveData = (data) => {
    // console.log(data);
    if (data.attribute == "state") {
      if (data.update == "device") {
        // Find device to update
        let elementsIndex = this.state.markers.findIndex(e => e.id == data.id);

        // Make copy of markers
        let newArray = [...this.state.markers];

        // Update device
        newArray[elementsIndex] = {
          ...newArray[elementsIndex],
          state: data.to
        }

        // Update state
        this.setState({
          markers: newArray,
        }, () => {
          // alert("Data.to: " + data.to)
          // Check to see if we need to start an alarm
          if (data.to.toLowerCase().includes("alarm")) {
            this.playPerimeterAlarm();
          }
          else if (data.to.toLowerCase().includes("offline")) {
            this.playOfflineAlarm();
          }
          else if (data.to.toLowerCase().includes("online") || data.to.toLowerCase().includes("maintenance")) {
            this.stopRelevantAlarm();
          }
        });
      }

      if (data.update == "map_group") {
        // Find map_groups to update
        let elementsIndex = this.state.perimeters.findIndex(e => e.id == data.id);

        // Make copy of perimeters
        let newArray = [...this.state.perimeters];
        let copyPath = newArray[elementsIndex].path

        // Update map_groups
        newArray[elementsIndex] = {
          ...newArray[elementsIndex],
          state: data.to
        }
        
        // First set to empty location
        newArray[elementsIndex] = {
          ...newArray[elementsIndex],
          path: [
            { lat: 0.00, lng: 1.00 },
            { lat: 0.00, lng: 1.00 }
          ]
        }

        // Update state
        this.setState({
          perimeters: newArray,
        }, () => {
        
          // Now set to original location
          // This is needed for the polyline's redraw to get triggered
          newArray[elementsIndex] = {
            ...newArray[elementsIndex],
            path: copyPath
          }

          // Update state
          this.setState({
            perimeters: newArray,
          });
        });

        // Todo: update tree
      }
    }
    else if (data.attribute == "offline_acknowledged") {
      if (data.update == "device" && data.to == true) {
        // Stop offline alarm
        // Find device to update
        let elementsIndex = this.state.markers.findIndex(e => e.id == data.id);

        // Make copy of markers
        let newArray = [...this.state.markers];

        // Update device
        newArray[elementsIndex] = {
          ...newArray[elementsIndex],
          offline_acknowledged: data.to
        }

        // Update state
        this.setState({
          markers: newArray,
        }, () => {
          this.stopOfflineAlarm()
        });
      }
    }
    
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
      // Draw perimeter

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
      // Draw device
      this.placeMarker(coord);
    }
  };

  placeMarker(coord, id = 0, name = "", state = "online") {
    // console.log("Coord:");
    // console.log(coord);

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
              state: this.state.deviceFromTree.state,
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
            state: state,
          }
        ],
      }, () => {
        this.publishMarkerLoc(this.state.markers[this.state.markers.length - 1]);
      });
    } else {
      //  Click on map - Hide infowindow
      this.setState({
        showInfo: false,
        showReasonInfoWindow: false,
      });
    }

    this.setState({
      showPerDel: false,
      perimeterIndex: null,

      perInfoLat: 47.6307081,
      perInfoLng: -122.1434325,

      perInfoState: "",

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
      draggable={this.props.curr_user_type != "Operator"}
      icon={{
        url: (
          marker.state == "online" ? this.props.markerIconOnline :
          marker.state == "offline" ? this.props.markerIconOffline : 
          marker.state == "maintenance" ? this.props.markerIconMaintenance : 
          this.props.markerIconAlarm
        ),
        scaledSize: new window.google.maps.Size(40,40),
      }}
      onDragend={(t, map, coord) => this.onMarkerDragEnd(coord, marker.id, marker.title, index, marker.state)}
      onClick={() => this.showInfo(marker, index)}
    />
  }

  drawPerimeter = (perimeter, index) => {
    return <Polyline
      key={index}
      id={index}
      path={perimeter.path}
      editable={false}
      draggable={false}
      options={{
        strokeColor: (perimeter.state == "online") ? "#42a5f5" : (perimeter.state == "offline") ? "#CCCCCC" : "red",
        strokeOpacity: (perimeter.state == "offline") ? 0.8 : 0.5,
        strokeWeight: 10,
      }}
      onClick={() => this.setPerIndex(index)}
    />
  }

  onMarkerDragEnd(coord, id, name, index, state) {
    // Remove old entry
    this.state.markers.splice(index, 1);

    // Add updated entry
    this.placeMarker(coord, id, name, state);
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
          // console.log(response);
      });
    }
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
          state: item.state,
        },
      });

      // Find marker and show
      
    } else {
      // Todo: Show perimeter info
    }
  }

  updateDeviceState(deviceId, newState) {
    // console.log("Here FINALLY!");

    if (!deviceId || !newState) {
      return;
    }

    let body = JSON.stringify({
      DeviceId: deviceId,
      DeviceState: newState,
    });

    fetch('/client_groups/' + this.props.curr_client_group + '/update_device_state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.props.auth_token,
      },
      body: body,
    }).then(response => response.json())
    .then(response => {
        // window.location.reload(false);
        // console.log(response);

        // Remove old entry
        this.state.markers.splice(this.state.markerInfo.markerIndex, 1);

        // Make call fit with other placeMarker calls
        let coord = {
          latLng: {
            lat: () => { return this.state.markerInfo.position.lat},
            lng: () => { return this.state.markerInfo.position.lng},
          }
        };

        // Add updated entry
        this.placeMarker(coord, this.state.markerInfo.id, this.state.markerInfo.title, newState);
        
        // Create Alarm entry
        this.createAlarmEntry(deviceId, newState);

        // Hide marker info window
        this.hideInfo();
    });
  }

  showInfo = (marker, index) => {
    // alert(JSON.stringify(marker.position));
    this.setState({
      showReasonInfoWindow: false,
      showInfo: true,
      markerInfo: {
        id: marker.id,
        markerIndex: index,
        title: marker.title,
        name: marker.name,
        position: marker.position,
        state: marker.state,
        offline_acknowledged: marker.offline_acknowledged,
      },

      showPerDel: false,

      perInfoLat: 47.6307081,
      perInfoLng: -122.1434325,

      perInfoState: "",

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
        state: "online",
        offline_acknowledged: null,
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
        // console.log(response);
    });
  }

  updatePerimState(perimName, newState) {
    console.log(this.state.alarmReason)

    // update_map_group_state
    let body = JSON.stringify({
      MapGroupName: perimName,
      MapGroupState: newState,
      AlarmReason: this.state.alarmReason,
      AlarmNote: this.state.alarmNotes,
    });

    fetch('/client_groups/' + this.props.curr_client_group + '/update_map_group_state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.props.auth_token,
      },
      body: body,
    }).then(response => response.json())
    .then(response => {
      // trigger refresh
      // window.location.reload(false);
      this.handleAckWindowClose();
      this.hidePerimInfo();
    });
  }

  createAlarmEntry(deviceId, stateChangedTo) {
    let body = JSON.stringify({
      acknowledged: true,
      date_acknowledged: new Date(),
      alarm_reason: this.state.alarmReason,
      note: this.state.alarmNotes,
      device_id: deviceId,
      user_id: this.props.curr_user_i,
      state_change_to: stateChangedTo,
      state_change_from: this.state.markerInfo.state,
    });
    
    this.handleAckWindowClose();

    fetch('/alarms/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.props.auth_token,
      },
      body: body,
    })
    // .then(response => response.json())
    .then(response => {
      // console.log(response);
      // For now just reload the page - 
      // but in future what is still needed is
      // to update perimeter states after
      // a device state has been updated
      // window.location.reload(false);

      // At the moment the modal doesn't want to close??
      // this.handleAckWindowClose();
      // this.hideInfo();
      // this.hidePerimInfo();
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
      perInfoState: "",
    });
  }

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
        // console.log(response);
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

  pushNewPerimeterAndClear() {
    // Get per name
    var perName = this.generatePerName();

    let newPerim = {
      name: perName,
      path: [
        this.state.newPerimeterStart,
        this.state.newPerimeterEnd,
      ],
      state: "online",
    }

    this.publishNewPerim(newPerim);

    // this.publishNewPerim(this.state.perimeters[this.state.perimeters.length - 1]);

    // this.setState({
    //   perimeters: [
    //     ...this.state.perimeters,
    //     {
    //       name: perName,
    //       path: [
    //         this.state.newPerimeterStart,
    //         this.state.newPerimeterEnd,
    //       ],
    //       state: "online",
    //     }
    //   ],
    // });

    // // Todo: add perim state
    // this.triggerPerimAdd(perName);
    // this.toggleDrawPerimeter();

  }

  publishNewPerim(perimeter) {
    let body = JSON.stringify({
      MapGroupName: perimeter.name,
      MapGroupStartLat: perimeter.path[0].lat,
      MapGroupStartLon: perimeter.path[0].lng,
      MapGroupEndLat: perimeter.path[1].lat,
      MapGroupEndLon: perimeter.path[1].lng,
      MapGroupState: perimeter.state,
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

        this.addNewPerimToMap(perimeter, response.map_group_id);
    });
  }

  addNewPerimToMap(_perimeter, _id) {
    this.setState({
      perimeters: [
        ...this.state.perimeters,
        {
          id: _id,
          name: _perimeter.name,
          title: _perimeter.name,
          path: _perimeter.path,
          state: _perimeter.state,
        }
      ],
    });

    // Todo: add perim state
    this.triggerPerimAdd(_perimeter.name, _id);
    this.toggleDrawPerimeter();
  }

  setPerIndex(index) {
    this.setState({
      showPerDel: true,
      perimeterIndex: index,
      perInfoTitle: this.state.perimeters[index].name,

      perInfoLat: this.getMidpoint(
        this.state.perimeters[index].path[0].lat,
        this.state.perimeters[index].path[1].lat
      ),
      perInfoLng: this.getMidpoint(
        this.state.perimeters[index].path[0].lng,
        this.state.perimeters[index].path[1].lng
      ),

      perInfoState: this.state.perimeters[index].state,
    });

    this.hideInfo();
  }

  getMidpoint(p1, p2) {
    return (p1 + p2) / 2;
  }

  hidePerimInfo() {
    this.setState({
      showPerDel: false,
      perimeterIndex: null,
      perInfoTitle: "Perimeter",

      perInfoLat: 47.6307081,
      perInfoLng: -122.1434325,

      perInfoState: "",

      deviceFromTreeSelected: false,
      deviceFromTree: null,
    });
  }

  triggerPerimAdd(_title = "Perimeter", _id = 0) {
    this.tree.addNewNode({
      title: _title,
      id: _id,
      isDevice: false,
      treeIndex: 0,
      children: [],
      state: "online",
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
          state: device.state
        });
      }
    });

    // Place on relevant loc on map (trigger onClick)
    this.placeDevicesFromProps();

    this.props.map_groups.forEach(map_group => {

      devicesAndPerimeters.push({
        id: map_group.id,
        title: map_group.Name,
        isDevice: false,
        treeIndex: 0,
        children: [],
        state: map_group.state,
      });

      if (map_group.devices.length >= 1) {
        // Add perimeter children
        let perimChildrenRef = devicesAndPerimeters[devicesAndPerimeters.length - 1].children;

        map_group.devices.forEach((device) => {
          perimChildrenRef.push({
            id: device.id,
            title: device.Name,
            isDevice: true,
            state: device.state
          });
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
            id: currPerim.id,
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
            state: currPerim.state,
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
        // Add device to map
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
              state: currDevice.state,
              offline_acknowledged: currDevice.offline_acknowledged,
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

  onlineMarker() {
    return <div>
  
      {/* <br/> */}
      {/* <p style={infoSubTitle}>Actions:</p> */}
    
      {
        this.props.curr_user_type != "Operator" &&
        <span>
          <div
            onClick={() => {
              // this.updateDeviceState(this.state.markerInfo.id, "maintenance");
              this.openAlarmAckWindow("maintenance");
            }}
            className={"orange btn"}
            style={infoActionButton} >

            <i className="material-icons right">edit</i>
            {/* Maintenance On */}
            Disable Device
          </div>
          {/* <br/> */}
        </span>
      }

      {/* <div
        onClick={() => {
          // this.updateDeviceState(this.state.markerInfo.id, "offline");
          this.openAlarmAckWindow("offline");
        }}
        className={"grey btn"}
        style={infoActionButton} >

        <i className="material-icons right">edit</i>
        Take Offline
      </div>

      <br/> */}
    </div>
  }

  offlineMarker() {
    console.log(this.state.markerInfo)
    console.log(this.state.markerInfo.offline_acknowledged)
    return <div>
  
      {/* <br/> */}
      {/* <p style={infoSubTitle}>Actions:</p> */}
      
      {
        this.props.curr_user_type != "Operator" &&
        <span>
          <div
            onClick={() => {
              // this.updateDeviceState(this.state.markerInfo.id, "maintenance");
              this.openAlarmAckWindow("maintenance");
            }}
            className={"orange btn"}
            style={infoActionButton} >

            <i className="material-icons right">edit</i>
            {/* Maintenance On */}
            Disable Device
          </div>
          <br/>
        </span>
      }

      {
        (this.state.markerInfo.offline_acknowledged != true) ? (
          <span>
            <div
              onClick={() => {
                // this.updateDeviceState(this.state.markerInfo.id, "online");
                this.acknowledgeOfflineAlarm();
              }}
              className={"green btn"}
              style={infoActionButton} >

              <i className="material-icons right">check</i>
              Acknowledge as Offline
            </div>
            <br/>
          </span>
        ) :
        null
      }

      {/* {
        this.props.curr_user_type != "Operator" &&
        <span>
          <div
            onClick={() => {
              // this.updateDeviceState(this.state.markerInfo.id, "online");
              this.openAlarmAckWindow("online");
            }}
            className={"green btn"}
            style={infoActionButton} >
  
            <i className="material-icons right">edit</i>
            Bring Online
          </div>
          <br/>
        </span>
      } */}

    </div>
  }

  maintMarker() {
    return <div>
  
      {/* <br/> */}
      {/* <p style={infoSubTitle}>Actions:</p> */}

      {/* <div
        onClick={() => {
          // this.updateDeviceState(this.state.markerInfo.id, "offline");
          this.openAlarmAckWindow("offline");
        }}
        className={"grey btn"}
        style={infoActionButton} >

        <i className="material-icons right">edit</i>
        Take Offline
      </div>
      <br/> */}
        
      <div
        onClick={() => {
          // this.updateDeviceState(this.state.markerInfo.id, "online");
          this.openAlarmAckWindow("online");
        }}
        className={"green btn"}
        style={infoActionButton} >

        <i className="material-icons right">edit</i>
        {/* Bring Online */}
        Enable Device
      </div>
      <br/>

    </div>
  }

  alarmMarker() {
    return <div>
  
      {/* <br/> */}
      {/* <p style={infoSubTitle}>Actions:</p> */}

      {
        this.props.curr_user_type != "Operator" &&
        <span>
          <div
            onClick={() => {
              // this.updateDeviceState(this.state.markerInfo.id, "maintenance");
              this.openAlarmAckWindow("maintenance");
            }}
            className={"orange btn"}
            style={infoActionButton} >

            <i className="material-icons right">edit</i>
            {/* Maintenance On */}
            Disable Device
          </div>
          <br/>
        </span>
      }
      
      <div
        onClick={() => {
          // this.updateDeviceState(this.state.markerInfo.id, "online");
          this.openAlarmAckWindow("online");
        }}
        className={"green btn"}
        style={infoActionButton} >

        <i className="material-icons right">check</i>
        Acknowledge Alarm
      </div>
      <br/>

    </div>
  }
  
  openAlarmAckWindow(deviceState) {
    let fullScreen = this.state.fullscreenActive;
    
    if (fullScreen == true) {
      // Full screen, rather use InfoWindow
      this.setState({
        showInfo: false,
        showPerDel: false,
        stateToAck: deviceState,
        showReasonInfoWindow: true,
      }, () => {
        this.setState({
          showReasonInfoWindow: true,
        });
      });
    }
    else {
      this.setState({
        showReasonInfoWindow: false,
        showAckWindow: true,
        stateToAck: deviceState,
      });
    }

  }

  onInfoWindowOpen(props, e) {
    let content;

    if (this.state.markerInfo.state == "online") {
      content = this.onlineMarker();
    }
    else if (this.state.markerInfo.state == "offline") {
      content = this.offlineMarker();
    }
    else if (this.state.markerInfo.state == "maintenance") {
      content = this.maintMarker();
    }
    else {
      content = this.alarmMarker();
    }

    // Need to render InfoWindow contents manually via the DOM like this, otherwise
    // the contents get loaded onPageLoad, meaning the onClicks won't work
    ReactDOM.render(React.Children.only(content), document.getElementById("actionsContainer"));
  }

  alarmPerim() {
    return <div>
      <div
        onClick={() => {
          // this.updateDeviceState(this.state.markerInfo.id, "online");
          this.openAlarmAckWindow("online");
        }}
        className={"green btn"}
        style={infoActionButton} >

        <i className="material-icons right">check</i>
        Acknowledge All Alarms
      </div>
      <br/>
    </div>
  }

  onPeirmInfoWindowOpen(props, e) {
    let content;

    if (this.state.perInfoState == "alarm") {
      content = this.alarmPerim();
    }

    ReactDOM.render(React.Children.only(content), document.getElementById("perimActionsContainer"));
  }

  handleAckWindowClose() {
    this.setState({
      showReasonInfoWindow: false,
      showAckWindow: false,
      stateToAck: "",
      alarmReason: "",
      alarmNotes: "",
    });
  }

  handleAlarmReason(event) {
    this.setState({
      alarmReason: event.target.value,
    });
  }

  handleAlarmNotes(event) {
    this.setState({
      alarmNotes: event.target.value,
    });
  }

  mapActions() {
    return <div style={actionStyle}>
      <span style={bannerTextStyle}>
        Map Actions:
      </span>

      <div style={{ flexDirection: 'row' }}>
        
        <div style={deleteMarkerStyle}>
          <a
            className="waves-effect waves-light primary btn"
            onClick={this.saveZoomLevel} >
              
            <i className="material-icons right">youtube_searched_for</i>
            
            Save Zoom Level
          </a>
        </div>
        
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
  }

  reasonModal() {
    return <Modal
      open={this.state.showAckWindow}
      onClose={() => {
        this.handleAckWindowClose();
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description" >

      <div style = {modalStyle}>
        {
          (this.state.stateToAck == "online") ? (
            // <p style = {infoTitle}>Bring Online:</p>
            <p style = {infoTitle}>Acknowledge Alarm:</p>
          ) :
          (this.state.stateToAck == "offline") ? (
            <p style = {infoTitle}>Take Offline:</p>
          ) :
          (this.state.stateToAck == "maintenance") ? (
            // <p style = {infoTitle}>Put into Maintenance:</p>
            <p style = {infoTitle}>Disable Device:</p>
          ) :
            <p style = {infoTitle}>Acknowledge Alarm:</p>
        }
        
        <hr style = {hrStyle} />

        <div
          style = {{
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }} >

          <TextField
            id="standard-multiline-flexible"
            label={(this.state.stateToAck.includes("alarm")) ? "Reason for Alarm" : "Reason"}
            multiline
            rowsMax={4}
            value={this.state.alarmReason}
            onChange={this.handleAlarmReason}
          />

          <TextField
            id="standard-multiline-flexible"
            label="Notes"
            multiline
            rowsMax={4}
            value={this.state.alarmNotes}
            onChange={this.handleAlarmNotes}
            style = {{
              marginLeft: 15,
            }}
          />
        </div>

        <br/>

        <div
          style = {{
            flexDirection: "row", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }} >

          <div
            onClick={() => {
              // alert(this.state.markerInfo.id + " " + this.state.alarmReason + " " + this.state.alarmNotes);
              if (this.state.showInfo) {
                this.updateDeviceState(this.state.markerInfo.id, this.state.stateToAck);
              }
              else if (this.state.showPerDel) {
                this.updatePerimState(this.state.perInfoTitle, "online");
              }
            }}
            className={"green btn"}
            style={{
              marginTop: 15,
            }} >

            <i className="material-icons right">check</i>
            Submit
          </div>

          <div
            onClick={() => {
              this.handleAckWindowClose();
            }}
            className={"grey btn"}
            style = {{
              marginTop: 15,
              marginLeft: 15,
            }} >

            <i className="material-icons right">close</i>
            Cancel
          </div>
        </div>

      </div>
    </Modal>
  }

  stopRelevantAlarm() {
    this.stopOfflineAlarm();
    this.stopOrStartPerimeterAlarm();
  }

  playOfflineAlarm() {
    if (this.state.perimeterPlaying != Sound.status.PLAYING && this.state.offlinePlaying != Sound.status.PLAYING) {
      // If the perimeter alarm isn't already playing
      // and the offline alarm isn't already playing
      this.setState({
        offlinePlaying: Sound.status.PLAYING,
      });
    }
  }

  stopOfflineAlarm() {
    // Go through devices and see
    // if there is still an offline device
    
    let shouldStopAlarm = true;
    let markers = this.state.markers;

    for (let i = 0; i < markers.length; i++) {
      let marker = markers[i];
      if (marker.state.toLowerCase().includes("offline") && marker.offline_acknowledged != true) {
        shouldStopAlarm = false;
        break;
      }
    }

    if (shouldStopAlarm == true) {
      // Stop offline alarm tone
      this.setState({
        offlinePlaying: Sound.status.STOPPED,
      });
    }
  }

  playPerimeterAlarm() {
    if (this.state.offlinePlaying == Sound.status.PLAYING) {
      // If the offline alarm is already playing, stop it
      // because perimeter alarm takes precedence
      this.setState({
        offlinePlaying: Sound.status.STOPPED,
      });
    }

    if (this.state.perimeterPlaying != Sound.status.PLAYING) {
      this.setState({
        perimeterPlaying: Sound.status.PLAYING,
      });
    }
  
  }

  stopOrStartPerimeterAlarm() {
    // Go through devices and see
    // if there is still an alarm device
    
    let shouldStopAlarm = true;
    let markers = this.state.markers;

    for (let i = 0; i < markers.length; i++) {
      let marker = markers[i];
      if (marker.state.toLowerCase().includes("alarm")) {
        shouldStopAlarm = false;
        break;
      }
    }

    if (shouldStopAlarm == true) {
      // Stop perimeter alarm tone
      this.setState({
        perimeterPlaying: Sound.status.STOPPED,
      });

      // Check to see if offline alarm should now start playing
      for (let i = 0; i < markers.length; i++) {
        let marker = markers[i];
        if (marker.state.toLowerCase().includes("offline") && marker.offline_acknowledged != true) {
          this.playOfflineAlarm();
          break;
        }
      }
    }
    else {
      // Play perimeter alarm if it isn't already
      this.playPerimeterAlarm();
    }
  }

  addOfflineSound() {
    return <Sound
      url={this.props.offlineAlarmUrl}
      playStatus={this.state.offlinePlaying}
      playFromPosition={0}
      loop={true}
      volume={100}
    />
  }

  addPerimeterSound() {
    return <Sound
    url={this.props.perimAlarmUrl}
      playStatus={this.state.perimeterPlaying}
      playFromPosition={0}
      loop={true}
      volume={100}
    />
  }

  saveZoomLevel() {
    if (this.domNode != null) {
      let body = JSON.stringify({
        zoom_level: this.domNode.map.zoom,
      });
  
      fetch('/client_groups/' + this.props.curr_client_group + '/set_zoom_level_for_client_group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.props.auth_token,
        },
        body: body,
      }).then(response => response.json())
      .then(response => {
        console.log(response);

        this.setState({
          snackOpen: true,
        });

      });
    }
  }

  handleSnackClose = () => {
    this.setState({
      snackOpen: false,
    });
  };

  infoModalActions = () => {
    return <div>
      <div
        style = {{
          flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }} >

        <TextField
          id="standard-multiline-flexible"
          label={(this.state.stateToAck.includes("alarm")) ? "Reason for Alarm" : "Reason"}
          multiline
          rowsMax={4}
          value={this.state.alarmReason}
          onChange={this.handleAlarmReason}
        />

        <TextField
          ref={infoModalInput1Ref => this.infoModalInput1Ref = infoModalInput1Ref}
          id="standard-multiline-flexible"
          label="Notes"
          multiline
          rowsMax={4}
          value={this.state.alarmNotes}
          onChange={this.handleAlarmNotes}
          style = {{
            marginLeft: 15,
          }}
        />
      </div>

      <div
      style = {{
        flexDirection: "row", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }} >

      <div
        onClick={() => {
          // alert(this.state.markerInfo.id + " " + this.state.alarmReason + " " + this.state.alarmNotes);
          if (this.state.markerInfo.id) {
            this.updateDeviceState(this.state.markerInfo.id, this.state.stateToAck);
          }
          else if (this.state.showPerDel || (this.state.perInfoLat != null && this.state.perInfoLat != null)) {
            this.updatePerimState(this.state.perInfoTitle, "online");
          }
        }}
        className={"green btn"}
        style={{
          marginTop: 15,
        }} >

        <i className="material-icons right">check</i>
        Submit
      </div>

      <div
        onClick={this.handleAckWindowClose}
        className={"grey btn"}
        style = {{
          marginTop: 15,
          marginLeft: 15,
        }} >

        <i className="material-icons right">close</i>
        Cancel
      </div>
    </div>
    </div>
  }

  onInfoModalOpen(props, e) {
    let content = this.infoModalActions();

    ReactDOM.render(React.Children.only(content), document.getElementById("modalActionsContainer"));
  }

  renderInfoModal() {
    return <InfoWindow
      visible={this.state.showReasonInfoWindow}
      onCloseClick={this.handleAckWindowClose}
      onClose={this.handleAckWindowClose}
      onOpen={e => {
        this.onInfoModalOpen(this.props, e);
      }}

      position={{
        lat: this.state.markerInfo.id ? this.state.markerInfo.position.lat : this.state.perInfoLat,
        lng: this.state.markerInfo.id ? this.state.markerInfo.position.lng : this.state.perInfoLng,
      }} >

      <div style = {infoModalStyle}>
        {
          (this.state.stateToAck == "online") ? (
            <p style = {infoTitle}>Acknowledge Alarm:</p>
          ) :
          (this.state.stateToAck == "offline") ? (
            <p style = {infoTitle}>Take Offline:</p>
          ) :
          (this.state.stateToAck == "maintenance") ? (
            <p style = {infoTitle}>Disable Device:</p>
          ) :
            <p style = {infoTitle}>Acknowledge Alarm:</p>
        }
        
        <hr style = {hrStyle} />

        <br/>
        
        <div id={"modalActionsContainer"}>
          {/* Marker actions loaded on infowindow open */}
        </div>

      </div>

    </InfoWindow>
  }

  acknowledgeOfflineAlarm() {

    if (this.state.markerInfo.state) {
      let body = JSON.stringify({
        id: this.state.markerInfo.id,
        offline_acknowledged: true,
      });
  
      fetch('/acknowledge_offline_alarm_for_device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.props.auth_token,
        },
        body: body,
      }).then(response => response.json())
      .then(response => {
        console.log(response);

        if (response.status == "ok") {
          // Hide info window
          this.hideInfo();
        }
  
      });
    }
    
  }

  render() {
    return (
      <div
        className="wrapper"
        onKeyUp={this.handleKey} >

        {
          this.props.curr_user_type != "Operator" && 
          this.mapActions()
        }

        <Map
          ref={map => this.domNode = map}
          className="map"
          google={this.props.google}
          zoom={this.state.currentZoom}
          style={
            (this.props.curr_user_type == "Operator") ? mapStylesOperator : mapStyles
          }
          initialCenter={{ 
            lat: this.props.map_lat,
            lng: this.props.map_lng,
          }}
          mapTypeControl={true}
          mapType={"hybrid"}
          streetViewControl={true}
          onReady={() => {
            // Play relevant alarms
            this.stopOrStartPerimeterAlarm();
          }}
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

          {
            (this.state.markerInfo.state) ? (
              <InfoWindow
                visible={this.state.showInfo}
                onCloseClick={this.hideInfo}
                onClose={this.hideInfo}
                onOpen={e => {
                  this.onInfoWindowOpen(this.props, e);
                }}

                position={{
                  lat: this.state.markerInfo.position.lat,
                  lng: this.state.markerInfo.position.lng,
                }} >

                <div>
                  <p style={infoTitle}>{this.state.markerInfo.title}</p>
                  <hr/>
                  
                  <p style={infoSubTitle}>State:</p>

                  {
                    (this.state.markerInfo.state == "online") ? (
                      <div>
                        <div className="chip" style = {circleStyleGreen}>
                          Online, No alarm
                        </div>
                      </div>
                    ) :
                    (this.state.markerInfo.state == "offline") ? (
                      <div className="chip" style = {circleStyleGrey}>
                        Offline{this.state.markerInfo.offline_acknowledged == true ? ", Acknowledged" : ""}
                      </div>
                    ) :
                    (this.state.markerInfo.state == "maintenance") ? (
                      <div className="chip" style = {circleStyleYellow}>
                        {/* Maintenance */}
                        Disabled
                      </div>
                    ) :
                      <div className="chip" style = {circleStyleRed}>
                        {this.state.markerInfo.state}
                      </div>
                  }

                  <div id={"actionsContainer"}>
                    {/* Marker actions loaded on infowindow open */}
                  </div>

                  <div style={deleteMarkerStyle}>
                  <a
                    href={"/devices/" + this.state.markerInfo.id}
                    target="blank"
                    className="waves-effect waves-light primary btn" >

                    <i className="material-icons right">router</i>
                    
                    View Device
                  </a>
                </div>
                        
                </div>

              </InfoWindow>
            ) :
              null
          }

          {this.renderInfoModal()}
          
          <InfoWindow
            visible={this.state.showPerDel}
            onCloseClick={this.hidePerimInfo}
            onClose={this.hidePerimInfo}
            onOpen={e => {
              this.onPeirmInfoWindowOpen(this.props, e);
            }}

            position={{
              lat: this.state.perInfoLat,
              lng: this.state.perInfoLng,
            }} >

            <div>
              <p style={infoTitle}>{this.state.perInfoTitle}</p>
              <hr/>
              
              <p style={infoSubTitle}>State:</p>

              {
                (this.state.perInfoState == "online") ? (
                  <div>
                    <div className="chip" style = {circleStyleGreen}>
                      Online, No alarm
                    </div>
                  </div>
                ) :
                (this.state.perInfoState == "offline") ? (
                  <div>
                    <div className="chip" style = {circleStyleGrey}>
                      Offline
                    </div>
                  </div>
                ) :
                  <div className="chip" style = {circleStyleRed}>
                    Alarm has been Triggered
                  </div>
              }

              <div id={"perimActionsContainer"}>
                {/* Marker actions loaded on infowindow open */}
              </div>
              
            </div>

          </InfoWindow>

        </Map>

        {
          (this.props.curr_user_type != "Operator") ? (
            <div style={elementsStyle}>
              <span style={bannerTextStyle}>
                Map Elements:
              </span>

              <div style={{ margin: 15, }} />
              
              <SortableTreeView
                ref={tree => this.tree = tree}
                onDeviceClicked={this.onDeviceClicked}
                onDeviceDragged={this.onDeviceDragged}
              />
            </div>
          ) :
          <div style={elementsStyleBlank}>  
            <SortableTreeView
              hidden={true}
              ref={tree => this.tree = tree}
              onDeviceClicked={this.onDeviceClicked}
              onDeviceDragged={this.onDeviceDragged}
            />
          </div>
        }

        {this.reasonModal()}

        {this.addOfflineSound()}
        {this.addPerimeterSound()}

        <div
          style={{
            position: 'absolute',
          }}>

          <Snackbar
            open={this.state.snackOpen}
            autoHideDuration={1500}
            onClose={this.handleSnackClose}
            // message={"Zoom level saved!"}
            >

            <Alert onClose={this.handleSnackClose} severity="success">
              Zoom level saved!
            </Alert>

          </Snackbar>
        </div>

      </div>
    );
  }
}

const circleStyle = {
  borderRadius: 25,
  color: "white",
  background: "green",
};
const circleStyleGreen = {
  borderRadius: 25,
  color: "white",
  background: "green",
};
const circleStyleGrey = {
  borderRadius: 25,
  color: "white",
  background: "grey",
};
const circleStyleYellow = {
  borderRadius: 25,
  color: "white",
  background: "orange",
};
const circleStyleRed = {
  borderRadius: 25,
  color: "white",
  background: "red",
};
const infoActionButton = {
  marginTop: 15,
};
const mapStyles = {
  width: "60vw",
  height: '60%',
  // marginLeft: '10%',
};
const mapStylesOperator = {
  // flex: 0,
  // top: "-15%",
  left: 0,
  position: "fixed",
  width: "100%",
  height:  "75%",
};
const infoTitle = {
  fontSize: 18,
};
const infoSubTitle = {
  fontSize: 14,
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
const elementsStyleBlank = {
  position: 'relative',
  height: '60vh',
  width: 0,
};
const modalStyle = {
  position: 'relative',
  top: "40vh",
  left: "30vw",
  width: "40vw",
  borderWidth: 0.1,
  borderRadius: 15,
  padding: 25,
  backgroundColor: "white",
};
const infoModalStyle = {
  width: "40vw",
  borderWidth: 0.1,
  borderRadius: 15,
  padding: 25,
  backgroundColor: "white",
};
const hrStyle = {
  display: "block",
  height: 1,
  border: 0,
  borderTop: "1px solid #ccc",
  margin: "1em 0",
  padding: 0,
};
const hiddenStyle = {
  opacity: 0,
  height: 0,
  width: 0
};

GoogleMap.propTypes = {
  markerIconOnline: PropTypes.string,
  perimIconUrl: PropTypes.string,
  curr_client_group: PropTypes.number,
  devices: PropTypes.array,
  map_groups: PropTypes.array,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCY6u1hicHayNKSogBwPU-H7mvIEpe6QJc',
})(GoogleMap)

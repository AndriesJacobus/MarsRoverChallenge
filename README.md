# Wi-I-Cloud
Custom cloud front-end to connect to the Teqcon Sigfox back-end and manage IoT devices for security perimeters.
Currently we are busy with the first iteration of the project - the **MVP Phase One**.

## MVP Phase One Features
The functional requirements of the MVP Phase One include: 

### 1. Configuration
  - Operator
    - Add/Delete user
    - Password management
    - User access level
      - Admin – total access
      - Operator – map view and logs access
  - Devices
    - Add devices
      - SigFox back end
        - Devices to be registered on SigFox back end manually and added manually to Wi-i controller
        - Tie SigFox device ID up with device serial number
        - Callback with unique hash
    - Group devices
    - Remove devices
    - Rename devices, groups
    - Tree list view of devices, groups already configured
  
### 2. Log
  - List view
  - Heading filters

### 3. Map View
  - Static map
  - Graphical representation of layout of perimeter
    - Groups allowing access to individual bridges and devices
  - Editable
    - Provide a list of configured groups and devices
    - Groups and devices can be placed on map
  - Indication of device events/states using colour, icons
    - Alarm
    - Online/offline
    - Maintenance (low battery, device inhibited)
    - States propagate onto parent groups
  - Operator interaction
    - Inhibit devices, groups
      - Provide reason for inhibit
    - Acknowledgement of events
      - Provide reason for event
  
### 4. Business Rules
  - Events
    - Type of events
      - Alarm
      - Maintenance
      - Device Online/Offline
    - List groups, devices currently configured on system
    - Actions
      - Notify
        - Allow notifications to be set on individual devices or group of devices
        - Group notification settings apply to devices in group as well
        - Notification options
        - Map view
      - Ignore
        - Prevent individual devices in a group from sending notifications
        - Same options as notify
  - New added devices configured with default rules
    - Notify on map view on alarms, maintenance, offline devices
  
### 5. Controller Deliverables
  - Cloud server
    - Connected to SigFox back end to handle callbacks
    - Passes on packets received from SigFox devices to local server
    - Synchronization with local server

## Dev Plan
1. ~~Month 1 - Setup and Configuration~~
   - Cloud Setup and Deployment
     - Initial architecture design and implementation
     - Initial data model design
     - Initial database design and model implementation	
   - Configuration
     - Operator
     - Devices
2. Month 2 - Integration and Interaction
   - Map View
     - Static map
     - Graphical representation of layout of perimeter
     - Editable
     - Indication of device events/states using colour, icons
     - Operator interaction
   - Business Rules
     - Events
     - Type of events
     - List groups, devices currently configured on system
     - Actions
     - New added devices configured with default rules
3. Month 3 - Cloud to Local
   - Log
     - List view
     - Heading filters
   - Controller Setup
     - Installation of server on local controller
     - Synchronization of packets received from SigFox devices to local server with local server

## Extra Added Functional Requirements
- [ ] Client Admin
  - [ ] Create new User Type: Client Admin
  - [ ] Transfer Operator privileges to Client Admin
  - [ ] Rename Admin User Type to Sysadmin
  - [ ] New Operator Privileges
    - [ ] View own user info
    - [ ] Map View
    - [ ] Logs
- [ ] Client Groups
  - [ ] Create new Controller and View: Clients (= sifg DeviceType)
  - [ ] Create new Controller and View: Client Groups (= sifg Group like MyTestGroup)
- [ ] Message Controller and View Updates
  - [ ] Add deviceID to Message
  - [ ] Add sigf device Name to Message
  - [ ] Add wi-i device Name to Message
  - [ ] Add deconstructed packet to Message
- [ ] User Create Update
  - [ ] Only Sysadmins can create Client Admins
  - [ ] Only Sysadmins and Client Admins can create Operators

## Project View Hierarchy
1. Clients (sigf device type)
   1. Client Admin
   2. Client Operator
   3. Client Group (sigf Group like MyTestGroup)
      1. Devices

## Progress
- [ ] 1. Configuration
    - [x]  Operator
    - [x]  Add/Delete user
    - [x]  Password management
    - [x]  User access level
      - [x]  Admin – total access
      - [x]  Operator – map view and logs access
    - [ ]  Devices
      - [x]  Add devices
        - [ ]  SigFox back end
          - [x]  Devices to be registered on SigFox back end manually and added manually to Wi- [ ] i controller
          - [ ]  Tie SigFox device ID up with device serial number
          - [ ]  Callback with unique hash
    - [x]  Remove devices
    - [X]  Rename devices
    - [ ]  Group devices
    - [ ]  Rename groups
    - [ ]  Tree list view of devices, groups already configured
  
- [ ] 2. Log
  - [ ]  List view
  - [ ]  Heading filters

- [ ] 3. Map View
  - [ ]  Static map
  - [ ]  Graphical representation of layout of perimeter
    - [ ]  Groups allowing access to individual bridges and devices
  - [ ]  Editable
    - [ ]  Provide a list of configured groups and devices
    - [ ]  Groups and devices can be placed on map
  - [ ]  Indication of device events/states using colour, icons
    - [ ]  Alarm
    - [ ]  Online/offline
    - [ ]  Maintenance (low battery, device inhibited)
    - [ ]  States propagate onto parent groups
  - [ ]  Operator interaction
    - [ ]  Inhibit devices, groups
      - [ ]  Provide reason for inhibit
    - [ ]  Acknowledgement of events
      - [ ]  Provide reason for event
  
- [ ] 4. Business Rules
  - [ ]  Events
    - [ ]  Type of events
      - [ ]  Alarm
      - [ ]  Maintenance
      - [ ]  Device Online/Offline
    - [ ]  List groups, devices currently configured on system
    - [ ]  Actions
      - [ ]  Notify
        - [ ]  Allow notifications to be set on individual devices or group of devices
        - [ ]  Group notification settings apply to devices in group as well
        - [ ]  Notification options
        - [ ]  Map view
      - [ ]  Ignore
        - [ ]  Prevent individual devices in a group from sending notifications
        - [ ]  Same options as notify
  - [ ]  New added devices configured with default rules
    - [ ]  Notify on map view on alarms, maintenance, offline devices
  
- [ ] 5. Controller Deliverables
  - [ ]  Cloud server
    - [ ]  Connected to SigFox back end to handle callbacks
    - [ ]  Passes on packets received from SigFox devices to local server
    - [ ]  Synchronization with local server
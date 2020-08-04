# Wi-I-Cloud
Custom cloud back-end and React-ive front-end view to connect to the Teqcon Sigfox back-end and manage IoT devices for security perimeters.  
Currently we are busy with the first iteration of the project - the **MVP Phase One**.

## Code Initialization and Running
### Prerequisites
You need to have the following installed to run the project:
- npm & node
- ruby on rails (5.1>)
- Database:
  - Dev: sqlite3
  - Prod: postgress

### Local Build and Run
To build and run the code locally (dev environment):

```
yarn install
```
_(or the unrecommended route: `npm install --save`)_

then:

```
rails server
```  

together with (in another terminal):

```
./bin/webpack-dev-server
```  

---

## Deploy to Heroku
### Prerequisites

* Both the Rails and NodeJS heroku buildpacks need to be installed on the heroku dyno. See: [Multiple build packs in Heroku](https://devcenter.heroku.com/articles/using-multiple-buildpacks-for-an-app)
* The heap memory of the dyno needs to be adjusted for the React libraries to build.
  To do this, run:  
  ```
  heroku config:set NODE_OPTIONS="--max_old_space_size=2560" -a [app_name]
  ```  
  from your terminal (for this the heroku cli must be installed locally and you need to be logged into the correct profile - for more info, see [The Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli))

### Pushing Updates
To push updates to Heroku:

1. Precompile all assets locally:  
   ```
   RAILS_ENV=production rake assets:precompile
   ```
2. Precompile webserver assets locally:  
   ```
   RAILS_ENV=production bundle exec rails webpacker:compile
   ```
3. Commit all built assets (for this to work make sure the /public/packs directory is not part of your gitignore file):  
   ```
   git add .; git commit -m 'update: built assets'
   ```
4. Update the remote `master` branch:  
   ```
   git push origin master
   ```
5. Push the `master` branch to heroku:  
   ```
   git push heroku master
   ```

---

## API Documentation
### Local
To view the API docs, run the local server and go to the `/documentation` endpoint.  
_(for example: localhost:3000/documentation)_

### Cloud
To view the API docs, open an instance of the cloud server (for example: https://wi-i-cloud.herokuapp.com) and navigate to the `/documentation` endpoint.  
_Click [here](https://wi-i-cloud.herokuapp.com/documentation) to navigate to an instance of the cloud server at the documentation endpoint._

---

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

---

## Dev Plan
1. ~~Month 1 - Setup and Configuration~~
   - Cloud Setup and Deployment
     - Initial architecture design and implementation
     - Initial data model design
     - Initial database design and model implementation	
   - Configuration
     - Operator
     - Devices
2. ~~Month 2 - Integration and Interaction~~
   - Map View
     - Static map
     - Graphical representation of layout of perimeter
     - Editable
     - Indication of device events/states using colour & icons
     - Operator interaction
   - Business Rules
     - Events
     - Type of events
     - List groups, devices currently configured on system
     - Actions
     - New added devices configured with default rules
3. ~~Month 3 - Cloud to Local~~
   - Log
     - List view
     - Heading filters
   - Controller Setup
     - Installation of server on local controller
     - Synchronization of packets received from SigFox devices to local server

---

## Project View Hierarchy
1. Clients (sigf device type)
   1. Client Admin
   2. Client Operator
   3. Client Group (sigf Group)
      1. MapGroups (Perimeter)
      2. Devices
         1. Messages

---

## Possible Additional Functional Requirements
- [ ] Device create via Message callback:
  - [x] if message comes in from device with sigfox ID not registered on wi-i, create new device and link message to device
  - [ ] enable users to merge current devices with automatically created devices (copy over device name, client, client_group, map_group) 
- [ ] Message Controller and View Updates
  - [x] Add Sigfox Device ID to Message
  - [x] Add wi-i device Name to Message
  - [x] Add deconstructed packet to Message
- [ ] Client Admin
  - [x] Create new User Type: Client Admin
  - [x] Rename Admin User Type to Sysadmin
  - [x] Transfer Operator privileges to Client Admin
  - [x] New Operator Privileges
    - [x] View own user info
    - [x] Map View
    - [x] No Logs
- [ ] Client Groups
  - [x] Create new Controller and View: Clients (= sifg DeviceType like Wi-i Platform Testing)
  - [x] Create new Controller and View: Client Groups (= sifg Group like MyTestGroup)
  - [x] Clients View Styling Updates
  - [x] Client Groups View Styling Updates
  - [x] Link Clients Controller and View in Dashboard
  - [x] Link Client Groups Controller and View in Dashboard
  - [ ] Create Dashboard process to setup a Client (according to Project View Hierarchy)
    - [ ] Create Client
    - [ ] Create/Link Client Admin
    - [ ] Create/Link Operator
    - [ ] Create/Link Client Group
    - [ ] Create/Link Devices
- [ ] Create Client hierarchy view in Dashboard (according to Project View Hierarchy)
- [ ] User Create Update
  - [ ] Only Sysadmins can create Client Admins
  - [ ] Only Sysadmins and Client Admins can create Operators
- [ ] Map View
  - [ ] Admin view of all clients on map
    - [ ] Each client group
    - [ ] Each client group perimeter
    - [ ] Each perimeter device

---

## Progress
- [x] 1. Configuration
    - [x]  Operator
    - [x]  Add/Delete user
    - [x]  Password management
    - [x]  User access level
      - [x]  Admin – total access
      - [x]  Operator – map view and logs access
    - [x]  Devices
      - [x]  Add devices
        - [x]  SigFox back end
          - [x]  Devices to be registered on SigFox back end manually and added manually to Wi-I-Cloud controller
          - [x]  Tie SigFox device ID up with device serial number
          - [x]  Callback with unique hash
    - [x]  Remove devices
    - [X]  Rename devices
    - [x]  Group devices
    - [x]  Rename groups
    - [x]  Tree list view of devices and groups already configured
  
- [x] 2. Log
  - [x]  List view
  - [x]  Heading filters

- [ ] 3. Map View
  - [x]  Static map (integrated a dynamic map)
  - [x]  Graphical representation of layout of perimeter
    - [x]  Groups allowing access to individual bridges and devices
  - [x]  Editable
    - [x]  Provide a list of configured groups and devices
    - [x]  Groups and devices can be placed on map
  - [ ]  Indication of device events/states using colour, icons
    - [x]  Alarm
    - [x]  Online/offline
    - [x]  Maintenance (low battery, device inhibited)
    - [ ]  States propagate onto parent groups
  - [x]  Operator interaction
    - [x]  Inhibit devices, groups
    - [x]  Provide reason for inhibit
    - [x]  Acknowledgement of events
    - [x]  Provide reason for event
  
- [ ] 4. Business Rules
  - [ ]  Events
    - [ ]  Type of events
      - [x]  Alarm
      - [x]  Maintenance
      - [x]  Device Online/Offline
    - [x]  List groups, devices currently configured on system
  - [ ]  Actions
    - [ ]  Notify
      - [ ]  Allow notifications to be set on individual devices or group of devices
      - [ ]  Group notification settings apply to devices in group as well
      - [x]  Notification options
        - [x]  Map view
    - [ ]  Ignore (Prevent individual devices in a group from sending notifications)
      - [ ]  Same options as notify
  - [x]  New added devices configured with default rules
    - [x]  Notify via map view on alarms, maintenance, offline devices
  
- [ ] 5. Controller Deliverables
  - [ ]  Cloud server
    - [x]  Connected to SigFox back end to handle callbacks
    - [ ]  Passes on packets received from SigFox devices to local server
    - [ ]  Synchronization with local server

---

**Created with 💚 by _<a href = "www.ivy-innovation.com" target = "_blank" style = "color: green;">Ivy Innovation</a>_**
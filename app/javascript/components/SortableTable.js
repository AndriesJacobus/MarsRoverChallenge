import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import M from "materialize-css";

class SortableTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,

      logs: [],

      selectedContentFilters: {
        trigger_by_bot: [],
        action_type: [],
        userName: [],           // user.name
        clientName: [],         // client.Name
        client_groupName: [],   // client_group.Name
        deviceName: [],         // device.Name
      },
      triggerItems: [],

		  hover: false,
      created_at_sort: 0,
      trigger_by_bot_sort: null,
      action_type_sort: null,
      user_sort: null,
      client_sort: null,
      client_group_sort: null,
      device_sort: null,
      message_sort: null,
    };

    this.onSort = this.onSort.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.contentFilterClicked = this.contentFilterClicked.bind(this)
  }
  
  componentDidMount(){
    let _triggerItems = this.getTriggerItems();

    // Load Materialize
    let selects = document.querySelectorAll('select');
    
    M.FormSelect.init(selects, {});

    // Load logs
    this.setState({
      logs: this.props.logs,
      loaded: true,
      triggerItems: _triggerItems,
    });
  }

  createdAtSort(logs, sortKey) {
    if (this.state.created_at_sort == null || this.state.created_at_sort == 1) {
      // sort ascending
      logs.sort((a,b) => a[sortKey].localeCompare(b[sortKey]));

      this.setState({
        created_at_sort: 0,
        trigger_by_bot_sort: null,
        action_type_sort: null,
        user_sort: null,
        client_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => a[sortKey].localeCompare(b[sortKey])).reverse();

      this.setState({
        created_at_sort: 1,
        trigger_by_bot_sort: null,
        action_type_sort: null,
        user_sort: null,
        client_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
      });
    }
  }

  triggerBySort(logs, sortKey) {
    if (this.state.trigger_by_bot_sort == null || this.state.trigger_by_bot_sort == 1) {
      // sort ascending
      logs.sort((a,b) => a[sortKey].localeCompare(b[sortKey]));

      this.setState({
        trigger_by_bot_sort: 0,
        created_at_sort: null,
        action_type_sort: null,
        user_sort: null,
        client_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => a[sortKey].localeCompare(b[sortKey])).reverse();

      this.setState({
        trigger_by_bot_sort: 1,
        created_at_sort: null,
        action_type_sort: null,
        user_sort: null,
        client_sort: null,  
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
      });
    }
  }

  actionTypeSort(logs, sortKey) {
    if (this.state.action_type_sort == null || this.state.action_type_sort == 1) {
      // sort ascending
      logs.sort((a,b) => a[sortKey].localeCompare(b[sortKey]));

      this.setState({
        action_type_sort: 0,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        user_sort: null,
        client_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => a[sortKey].localeCompare(b[sortKey])).reverse();

      this.setState({
        action_type_sort: 1,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        user_sort: null,
        client_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
      });
    }
  }

  userSort(logs, sortKey) {

    if (this.state.user_sort == null || this.state.user_sort == 1) {
      // sort ascending

      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].name.localeCompare(b[sortKey].name);
      });

      this.setState({
        user_sort: 0,
        client_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].name.localeCompare(b[sortKey].name);
      }).reverse();

      this.setState({
        user_sort: 1,
        client_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
  }

  clientSort(logs, sortKey) {

    if (this.state.client_sort == null || this.state.client_sort == 1) {
      // sort ascending

      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Name.localeCompare(b[sortKey].Name);
      });

      this.setState({
        client_sort: 0,
        user_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Name.localeCompare(b[sortKey].Name);
      }).reverse();

      this.setState({
        client_sort: 1,
        user_sort: null,
        client_group_sort: null,
        device_sort: null,
        message_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
  }

  clientGroupSort(logs, sortKey) {

    if (this.state.client_group_sort == null || this.state.client_group_sort == 1) {
      // sort ascending

      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Name.localeCompare(b[sortKey].Name);
      });

      this.setState({
        message_sort: null,
        device_sort: null,
        client_group_sort: 0,
        client_sort: null,
        user_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Name.localeCompare(b[sortKey].Name);
      }).reverse();

      this.setState({
        message_sort: null,
        device_sort: null,
        client_group_sort: 1,
        client_sort: null,
        user_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
  }

  deviceSort(logs, sortKey) {

    if (this.state.device_sort == null || this.state.device_sort == 1) {
      // sort ascending

      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Name.localeCompare(b[sortKey].Name);
      });

      this.setState({
        message_sort: null,
        device_sort: 0,
        client_group_sort: null,
        client_sort: null,
        user_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Name.localeCompare(b[sortKey].Name);
      }).reverse();

      this.setState({
        message_sort: null,
        device_sort: 1,
        client_group_sort: null,
        client_sort: null,
        user_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
  }

  messageSort(logs, sortKey) {

    if (this.state.message_sort == null || this.state.message_sort == 1) {
      // sort ascending

      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Data.localeCompare(b[sortKey].Data);
      });

      this.setState({
        message_sort: 0,
        device_sort: null,
        client_group_sort: null,
        client_sort: null,
        user_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
    else {
      // sort descending
      logs.sort((a,b) => {
        console.log(a[sortKey]);
  
        if (!a[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return +1;
        }
   
        if (!b[sortKey]) {
          // Change this values if you want to put `null` values at the end of the array
          return -1;
        }
   
        return a[sortKey].Data.localeCompare(b[sortKey].Data);
      }).reverse();

      this.setState({
        message_sort: 1,
        device_sort: null,
        client_group_sort: null,
        client_sort: null,
        user_sort: null,
        created_at_sort: null,
        trigger_by_bot_sort: null,
        action_type_sort: null,
      });
    }
  }

  onSort(event, sortKey){
    const logs = this.state.logs;

    switch (sortKey) {
      case "created_at":
        this.createdAtSort(logs, sortKey);

        break;
        
      case "trigger_by_bot":
        this.triggerBySort(logs, sortKey);

        break;
        
      case "action_type":
        this.actionTypeSort(logs, sortKey);

        break;
        
      case "user":
        this.userSort(logs, sortKey);

        break;
        
      case "client":
        this.clientSort(logs, sortKey);

        break;
        
      case "client_group":
        this.clientGroupSort(logs, sortKey);

        break;
        
      case "device":
        this.deviceSort(logs, sortKey);

        break;
        
      case "message":
        this.messageSort(logs, sortKey);

        break;
        
      default:
        break;
    }
    
    this.setState({logs})
  }

  toggleHover() {
    this.setState({hover: !this.state.hover})
  }

  handleShow() {
    // Todo, for now omitting
  }

  handleDelete(id, index){
    fetch(`/${id}`, 
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => { 
      console.log('Item was deleted!');

      // Remove from table without refresh
      // Todo: remove anim
      // var newLogs = [...this.state.people];   // make a separate shallow copy of the array

      // if (index !== -1) {
      //   newLogs.splice(index, 1);
      //   this.setState({logs: newLogs});
      // }
    });
  }

  getTriggerItems() {
    const logCopy = this.props.logs;

    // Filter out unique items
    const unique = [...new Set(logCopy.map(item => item.trigger_by_bot))];

    let selects = document.querySelectorAll('select');
    
    M.FormSelect.init(selects, {});

    // return ret;
    return unique;
  }

  contentFilterClicked(event, item) {
    const value = event.target.innerHTML;
    console.log(value);
    console.log(item);
  }

  renderContentFilters() {
    // const triggerItems = this.getTriggerItems();
    
    return <div>
      <div className = "input-field col s12" style = {{width: "40vw",}}>
        <select
          multiple
          style = {{opacity: 0, width: 0, height: 0, }}
          // onChange={this.contentFilterClicked}
          >

          {this.state.triggerItems.map((triggerItem, index) => {
            return <option
              id= "selectTest"
              key = {index}
              value={triggerItem}
              onChange={event => this.contentFilterClicked(event, triggerItem)}
              >

              {triggerItem}
            </option>
          })}
        </select>
        <label>Trigger by bot</label>
      </div>
    </div>
  }

  renderTable() {
    var newdata = this.state.logs;
    var headerStyle;

    if (this.state.hover) {
      headerStyle = {
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        background: "#42A5F5",
        color: "white",
        textAlign: "center",
        whiteSpace: "nowrap",
        cursor: 'pointer'
      }
    }
    else {
      headerStyle = {
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        background: "#42A5F5",
        color: "white",
        textAlign: "center",
        whiteSpace: "nowrap",
      };
    }

    return <div className = "z-depth-5 hoverable scroller">
      {
        this.state.loaded &&
        <table style = {borderStyle}>
          <thead>
            <tr>

              <th
                onClick={e => this.onSort(e, 'created_at')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                Time
                <br/><i>{
                (this.state.created_at_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.created_at_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th
                onClick={e => this.onSort(e, 'trigger_by_bot')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                Trigger by bot
                <br/><i>{
                (this.state.trigger_by_bot_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.trigger_by_bot_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th
                onClick={e => this.onSort(e, 'action_type')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                Action type
                <br/><i>{
                (this.state.action_type_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.action_type_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th
                onClick={e => this.onSort(e, 'user')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                User
                <br/><i>{
                (this.state.user_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.user_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th
                onClick={e => this.onSort(e, 'client')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                Client
                <br/><i>{
                (this.state.client_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.client_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th
                onClick={e => this.onSort(e, 'client_group')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                Client Group
                <br/><i>{
                (this.state.client_group_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.client_group_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th
                onClick={e => this.onSort(e, 'device')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                Device
                <br/><i>{
                (this.state.device_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.device_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th
                onClick={e => this.onSort(e, 'message')}
                onMouseEnter={this.toggleHover}
                onMouseLeave={this.toggleHover}
                style = {headerStyle}>

                Message
                <br/><i>{
                (this.state.message_sort == null) ? (
                  "(not sorted)"
                ) :
                (this.state.message_sort == 0) ? (
                  "(ascending)"
                ) :
                  "(descending)"
                }</i>
              </th>

              <th colSpan="3"></th>
            </tr>
          </thead>

          <tbody>
            {newdata.map(function(log, index) {
              return (
                <tr key={index} id={log.id} data-item={log}>
                  <td style = {tableStyle}>
                    {
                      new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }).format(Date.parse(log.created_at))
                    } ±00:00
                  </td>

                  <td style = {tableStyle}>
                    {log.trigger_by_bot}
                  </td>

                  <td style = {tableStyle}>
                    {log.action_type}
                  </td>

                  {
                    (log.user != null) ? (
                      <td style = {tableStyle}>
                        {log.user.name}
                      </td>
                    ) :
                      <td style = {tableStyle}><i>N/A</i></td>
                  }

                  {
                    (log.client != null) ? (
                      <td style = {tableStyle}>
                        {log.client.Name}
                      </td>
                    ) :
                      <td style = {tableStyle}><i>N/A</i></td>
                  }

                  {
                    (log.client_group != null) ? (
                      <td style = {tableStyle}>
                        {log.client_group.Name}
                      </td>
                    ) :
                      <td style = {tableStyle}><i>N/A</i></td>
                  }

                  {
                    (log.device != null) ? (
                      <td style = {tableStyle}>
                        {log.device.Name}
                      </td>
                    ) :
                      <td style = {tableStyle}><i>N/A</i></td>
                  }

                  {
                    (log.message != null) ? (
                      <td style = {tableStyle}>
                        {log.message.Data}
                      </td>
                    ) :
                      <td style = {tableStyle}><i>N/A</i></td>
                  }

                  {/* <td><button onClick={this.handleShow(log.id)} className = "waves-effect waves-light blue lighten-1 btn-small white-text">Show</button></td>
                  <td><button onClick={this.handleDelete(log.id, index)} className = "waves-effect waves-light blue lighten-1 btn-small white-text">Delete</button></td> */}
                </tr>
              );
            })}
            
          </tbody>
        </table>
      }
      
    </div>
  }

  render() {

    return (
      <div>
        {/* {
          (this.state.loaded) ? (
            <div>
              <p style = {subHeadingStyle}>
                Table Content Filters:
              </p>

              {this.renderContentFilters()}

              <br/>

              {this.renderTable()}
            </div>
          ) : 
          null
          
        } */}
        <div>
          {this.renderTable()}
        </div>
      </div>
    );
  }

}

const subHeadingStyle = {
  marginTop: 35,
  marginBottom: 25,
  fontSize: 18,
};
const borderStyle = {
  borderCollapse: "separate",
  borderSpacing: 15,
};
const tableStyle = {
  // paddingLeft: 25,
  textAlign: "center",
  whiteSpace: "nowrap",
};

export default SortableTable

import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';

class SortableTreeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        {
          id: 'root',
          title: 'Client Group',
          children: [
            {
              id: '3',
              title: 'Perimeter 1',
              children: [
                {
                  id: '4',
                  title: 'Device 1',
                  isDevice: true,
                },
                {
                  id: '5',
                  title: 'Device 2',
                  isDevice: true,
                },
              ],
            },
            {
              id: '1',
              title: 'Perimeter 2 (Empty)',
            },
            {
              id: '11',
              title: 'Device 3',
              isDevice: true,
            },
            {
              id: '12',
              title: 'Device 4',
              isDevice: true,
            },
          ],
        }
      ],
    };
  }

  render() {
    return (
      <div style={{ height: 300, width: '20vw', }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          scaffoldBlockPxWidth={20}
          // getNodeKey={({ node }) => console.log(node)}
          theme={FileExplorerTheme}
          maxDepth={4}
          generateNodeProps={rowInfo => ({
            onClick: (event) => { 
              console.log(rowInfo);
              this.props.onDeviceClicked(event, rowInfo.node.isDevice, rowInfo.node)
              // console.log(event.target);
            }
          })}
        />
      </div>
    );
  }
}

export default SortableTreeView

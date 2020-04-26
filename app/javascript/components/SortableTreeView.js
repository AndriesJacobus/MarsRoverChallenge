import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import {addNodeUnderParent, removeNodeAtPath, find, defaultSearchMethod} from 'react-sortable-tree';
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
              title: 'Perimeter Test',
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
              title: 'Perimeter Test (Empty)',
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

  updateTreeData(newData) {
    this.setState({
      treeData: newData
    });
  }

  addNewNode(rowInfo) {
    const NEW_NODE = {
      title: rowInfo.title,
      isDevice: rowInfo.isDevice,
      isDirectory: false
    };

    const newTree = addNodeUnderParent({
      treeData: this.state.treeData,
      newNode: NEW_NODE,
      expandParent: true,
      parentKey: rowInfo ? rowInfo.treeIndex : undefined,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    this.updateTreeData(newTree.treeData);
  }

  removeNode(rowInfo) {
    let m = [];

    const nT = find({
      treeData: this.state.treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      searchQuery: rowInfo.title,
      searchMethod: defaultSearchMethod,
      searchFocusOffset: 1,
      matches: [],
    });
    
    m = nT.matches;
    // console.log(m);

    // Will delete the first match
    if (m.length >= 1) {
      const path = m[0].path;
      const newTree = removeNodeAtPath({
        treeData: this.state.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
      });
  
      this.updateTreeData(newTree);
    }
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
            }
          })}
        />
      </div>
    );
  }
}

export default SortableTreeView

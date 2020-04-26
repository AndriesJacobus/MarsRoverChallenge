import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { addNodeUnderParent, removeNodeAtPath, find, defaultSearchMethod } from 'react-sortable-tree';
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

    // this.updateTreeData(newTree.treeData);
    this.setState({
      treeData: newTree.treeData
    });
  }

  removeNode(rowInfo) {
    let matches = [];

    const nT = find({
      treeData: this.state.treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
      searchQuery: rowInfo.title,
      searchMethod: defaultSearchMethod,
      searchFocusOffset: 1,
      matches: [],
    });

    matches = nT.matches;
    // console.log(matches);

    // Will delete the first match
    if (matches.length >= 1) {
      // First save children (if any)
      let children = [];

      // Perform deep copy
      if (matches[0].node.children) {
        matches[0].node.children.forEach(child => {
          children.push({
            id: child.id,
            title: child.title,
            isDevice: child.isDevice,
            treeIndex: 0,
          });
        });
      }

      // console.log(children);

      // Delete node
      const path = matches[0].path;
      const newTree = removeNodeAtPath({
        treeData: this.state.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        ignoreCollapsed: true,
      });

      this.setState({
        treeData: newTree
      }, () => {
        // Lastly re-add children (if any)
        this.addNewNodes(children);
      });
    }
  }
  
  addNewNodes(nodes, index = 0) {
    const NEW_NODE = {
      title: nodes[index].title,
      isDevice: nodes[index].isDevice,
      isDirectory: false
    };

    const newTree = addNodeUnderParent({
      treeData: this.state.treeData,
      newNode: NEW_NODE,
      expandParent: true,
      parentKey: nodes[index] ? nodes[index].treeIndex : undefined,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    // this.updateTreeData(newTree.treeData);
    this.setState({
      treeData: newTree.treeData
    }, () => {
      if (nodes[index + 1]) {
        this.addNewNodes(nodes, index + 1);
      }
    });
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
          maxDepth={3}
          generateNodeProps={rowInfo => ({
            onClick: (event) => {
              // console.log(rowInfo);
              this.props.onDeviceClicked(event, rowInfo.node.isDevice, rowInfo.node)
            }
          })}
        />
      </div>
    );
  }
}

export default SortableTreeView

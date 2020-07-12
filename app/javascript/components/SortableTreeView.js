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
      isDirectory: false,
      state: rowInfo.state,
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
        if (children.length >= 1) {
          this.addNewNodes(children);
        }
      });
    }
  }
  
  addNewNodes(nodes, index = 0) {
    if (nodes && nodes.length >= 1) {

      let NEW_NODE;

      if (nodes[index].isDevice) {
        // Is device

        NEW_NODE = {
          id: nodes[index].id,
          title: nodes[index].title,
          isDevice: nodes[index].isDevice,
          isDirectory: false,
          state: nodes[index].state,
        };
      } else {
        // Is perimeter
        // Todo: add children (if present)

        NEW_NODE = {
          title: nodes[index].title,
          isDevice: nodes[index].isDevice,
          isDirectory: (nodes[index].children.length >= 1),
          children: nodes[index].children,
        };
      }
  
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
          onMoveNode={(event) => {
            console.log(event);

            if (event.node.isDevice) {
              // Only listen for Device drags
              this.props.onDeviceDragged(event.node, event.nextParentNode)
            }
          }}
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

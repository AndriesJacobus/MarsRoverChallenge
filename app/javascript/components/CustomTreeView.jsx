import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const data = {
  id: 'root',
  name: 'Client Group',
  children: [
    {
      id: '3',
      name: 'Populated MapGroup (Perimeter)',
      children: [
        {
          id: '4',
          name: 'Device 1',
          isDevice: true,
        },
        {
          id: '5',
          name: 'Device 2',
          isDevice: true,
        },
      ],
    },
    {
      id: '1',
      name: 'Empty MapGroup (Perimeter)',
    },
    {
      id: '11',
      name: 'Device 3',
      isDevice: true,
    },
    {
      id: '12',
      name: 'Device 4',
      isDevice: true,
    },
  ],
};

const renderTree = (nodes, props) => (
  <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} onClick={(e) => props.onDeviceClicked(e, nodes.isDevice, nodes)}>
    {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node, props)) : null}
  </TreeItem>
);

const CustomTreeView = props => (
  <TreeView
    className={useStyles}
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpanded={['root']}
    defaultExpandIcon={<ChevronRightIcon />}
    >

    {renderTree(data, props)}
  </TreeView>
)

const useStyles = {
  height: 240,
  flexGrow: 1,
  maxWidth: 200,
};

CustomTreeView.propTypes = {
};

export default CustomTreeView
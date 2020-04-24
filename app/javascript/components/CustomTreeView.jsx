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
        },
        {
          id: '5',
          name: 'Device 2',
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
    },
    {
      id: '12',
      name: 'Device 4',
    },
  ],
};

const renderTree = (nodes) => (
  <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
    {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
  </TreeItem>
);

const CustomTreeView = props => (
  <TreeView
    className={useStyles}
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpanded={['root']}
    defaultExpandIcon={<ChevronRightIcon />}
    >

    {renderTree(data)}
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
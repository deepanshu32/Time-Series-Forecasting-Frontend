import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import BackupIcon from '@material-ui/icons/Backup';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TimelineIcon from '@material-ui/icons/Timeline';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import AssessmentIcon from '@material-ui/icons/Assessment';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MemoryIcon from '@material-ui/icons/Memory';

const drawerWidth = 210;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const SideNav = (props) => {
  
    return (
      <div>
        <div style={{color: "#0099ff", textAlign: "center", marginTop: 15}}>
        <Typography variant="h5">
          <b><i><span style={{fontWeight: 10000}}>PayMate</span></i></b>
        </Typography>
        </div>
        <Divider style={{marginTop: 16}}/>
        <List component="nav" style={{backgroundColor: "#e6e6e6", minHeight: "100vh"}}>
        <a href="/upload">
        <ListItem
          button
        >
          <ListItemIcon>
              <BackupIcon />
            </ListItemIcon>
          
            <ListItemText primary="Upload Files" />
        </ListItem>
        </a>
        <a href="/average">
        <ListItem
          button
        >
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
            <ListItemText primary="Take Average" />
        </ListItem>
        </a>
        <a href="/decompose">
        <ListItem
          button
        >
          <ListItemIcon>
            <MultilineChartIcon />
          </ListItemIcon>
         <ListItemText primary="Decompose Plots" />
        </ListItem>
        </a>
        <a href="/stationaryTest">
        <ListItem
          button
        >
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Test Stationarity" />
        </ListItem>
        </a>
        <a href="/corelation">
        <ListItem
          button
        >
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Corelation Plots" />
        </ListItem>
        </a>
        <a href="/arima">
        <ListItem
          button
        >
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Fit ARIMA model" />
        </ListItem>
        </a>
        <a href="/autoArima">
        <ListItem
          button
        >
          <ListItemIcon>
            <DynamicFeedIcon />
          </ListItemIcon>
          <ListItemText primary="Auto ARIMA" />
        </ListItem>
        </a>
        <a href="/lstm">
        <ListItem
          button
        >
          <ListItemIcon>
            <MemoryIcon />
          </ListItemIcon>
          <ListItemText primary="LSTM" />
        </ListItem>
        </a>
        <a href="/forecast">
        <ListItem
          button
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Forecast Balances" />
        </ListItem>
        </a>
      </List>
      </div>
    );
  }
  
  SideNav.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };
  
  export default SideNav;
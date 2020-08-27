import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import UserProfileDialog from './components/UserProfileDialog';

import AuthManager from '../Services/Auth';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24,
  },
  menuLink: {
      textDecoration: "none",
      color: "inherit"
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const auth = new AuthManager();

export default function Dashboard() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        openMenu: false,
        menuAnchor: null,

        redirectToLogin: false,

        userProfileOpen: false,
    });

    const handleDrawerOpen = () => {
        setState({
            ...state,
            openMenu: true
        })
    };
    const handleDrawerClose = () => {
        setState({
            ...state,
            openMenu: false
        })
    };

    const handleProfileClick = (event) => {
        setState({
            ...state,
            menuAnchor: event.currentTarget
        })
    };
    
    const handleProfileClose = () => {
        setState({
            ...state,
            menuAnchor: null
        })
    };

    const handleSignOutClick = () => {
      auth.signout();

      setState({
        ...state,
        menuAnchor: null,
        openMenu: false,
        redirectToLogin: true,
      });
    }

    const handleAccountEditClick = () => {
      setState({
        ...state,
        userProfileOpen: true,
        menuAnchor: null,
        openMenu: false,
      });
    }

    const handleProfileDialogCancel = () => {
      setState({
        ...state,
        userProfileOpen: false,
      });
    }

    if (state.redirectToLogin) {
      return <Redirect to="/admin/login" />
    }
    
    return (
        <div className={classes.root}>
          <CssBaseline />
            <UserProfileDialog open={state.userProfileOpen} onCancel={handleProfileDialogCancel} />
            <AppBar position="absolute" className={clsx(classes.appBar, state.openMenu && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx(classes.menuButton, state.openMenu && classes.menuButtonHidden)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Панель администратора
                    </Typography>
                    <IconButton color="inherit" aria-haspopup="true" onClick={handleProfileClick}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu id="simple-menu" anchorEl={state.menuAnchor} keepMounted open={Boolean(state.menuAnchor)} onClose={handleProfileClose}>
                        <MenuItem onClick={handleAccountEditClick}>Редактировать аккаунт</MenuItem>
                        <MenuItem onClick={handleSignOutClick}>Выйти</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" classes={{ paper: clsx(classes.drawerPaper, !state.openMenu && classes.drawerPaperClose), }} open={state.openMenu}>
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Link to="/admin/steps" className={classes.menuLink}>
                        <ListItem button>
                            <ListItemIcon>
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText primary="Шаги" />
                        </ListItem>
                    </Link>

                    <Link to="/admin/users" className={classes.menuLink}>
                        <ListItem button>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Пользователи" />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </div>
      );
}
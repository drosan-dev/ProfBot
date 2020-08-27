import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dashboard from './Dashboard';
import UserDialog from './components/UserDialog';
import ConfirmDialog from './components/ConfirmDialog';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Redirect } from 'react-router';

import ApiService from '../Services/ApiService';
import AuthManager from '../Services/Auth';
import moment from 'moment';

var ruLocale = require('moment/locale/ru'); 
moment.updateLocale('ru', ruLocale);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
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
  button: {
    margin: theme.spacing(1),
  },
  fab: {
    position: "absolute",
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    zIndex:100
  },
}));

const auth = new AuthManager();
const apiService = new ApiService();

export default function UsersPage() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    successAlertOpen: false,
    successAlertText: "",

    errorAlertOpen: false,
    errorAlertText: "",

    users: [],
    usersLoaded: false,

    backdropOpen: false,

    redirectToLogin: false,

    modalOpen: false,
    modalUserState: null,

    confirmDialogOpen: false,
    confirmDialogUser: null,
  });

  const handleSuccessAlertClose = () => {
    setState({
      ...state,
      successAlertText: "",
      successAlertOpen: false,
    });
  }

  const handleErrorAlertClose = () => {
    setState({
      ...state,
      errorAlertOpen: false,
      errorAlertText: ""
    });
  }

  const handleAddUserClick = () => {
    setState({
      ...state,
      modalOpen: true,
    })
  }

  const handleUserDialogAccept = (user) => {
    setState({
      ...state,
      backdropOpen: true,
    });

    if (state.modalUserState === null) {
      apiService.createUser(user, (response) => {
        console.log(response);
        let newUser = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          surname: response.data.surname,
          role: response.data.role,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at
        };

        console.log(newUser);

        let users = state.users;
        users.unshift(newUser);

        setState({
          ...state,
          successAlertText: "Пользователь создан",
          successAlertOpen: true,

          modalOpen: false,
          users: users,
          backdropOpen: false,
        });
      }, (error) => {
        console.log(error);
        if (error.response.status === 401) {
          auth.signout();
          setState({
            ...state,
            redirectToLogin: true
          });
        } else {
          var errorText = "Произошла неизвестная ошибка"
          if (error.response !== null && error.response.data !== null && error.response.data.error !== null) {
            errorText = error.response.data.error;
          }
          setState({
            ...state, 
            errorAlertText: errorText,
            errorAlertOpen: true,
            backdropOpen: false,
          });
        }
      });
    } else {
      var updatedUser = {
      }
      var isChanged = false;

      if (user.password !== "") {
        updatedUser.new_password = user.password;
        isChanged = true;
      }

      if (user.email !== state.modalUserState.email) {
        updatedUser.email = user.email;
        isChanged = true;
      }

      if (user.name !== state.modalUserState.name) {
        updatedUser.name = user.name;
        isChanged = true;
      }

      if (user.surname !== state.modalUserState.surname) {
        updatedUser.surname = user.surname;
        isChanged = true;
      }

      if (user.role_id !== state.modalUserState.role.id) {
        updatedUser.role_id = user.role_id;
        isChanged = true;
      }
      if (isChanged) {
        apiService.updateUser(state.modalUserState.id, updatedUser, (response) => {
          const newUser = {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            surname: response.data.surname,
            role: response.data.role,
            created_at: response.data.created_at,
            updated_at: response.data.updated_at,
          }
          let users = state.users;
          var index = -1;
  
          for (let i = 0; i < users.length; i++) {
            const element = users[i];
            if (element.id === newUser.id) {
              index = i;
              break;
            }
          }
  
          if (index > -1) {
            users[index] = newUser;
  
            setState({
              ...state,
              successAlertOpen: true,
              successAlertText: "Пользователь изменен",
              modalOpen: false,
              modalUserState: null,
              users: users,
              backdropOpen: false,
            });
          }
        }, (error) => {
          console.log(error.response);
          if (error.response.status === 401) {
            auth.signout();
            setState({
              ...state,
              redirectToLogin: true
            });
          } else {
            var errorText = "Произошла неизвестная ошибка"
            if (error.response !== null && error.response.data !== null && error.response.data.error !== null) {
              errorText = error.response.data.error;
            }
            setState({
              ...state,
              errorAlertOpen: true,
              errorAlertText: errorText,
              backdropOpen: false,
            });
          }
        })
      } else {
        setState({
          ...state,
          successAlertOpen: true,
          successAlertText: "Пользователь изменен",
          modalOpen: false,
          modalUserState: null,
          backdropOpen: false,
        });
      }
      
    }
  }

  const handleUserDialogCancel = () => {
    setState({
      ...state,
      modalOpen: false,
    })
  }

  const handleUserUpdate = (user) => {
    setState({
      ...state,
      modalUserState: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
      },
      modalOpen: true,
    })
  }

  const handleUserDelete = (user) => {
    setState({
      ...state,
      confirmDialogOpen: true,
      confirmDialogUser: user,
    })
  }

  const handleConfirmDialogAccept = () => {
    const user = state.confirmDialogUser;
    const users = state.users;
    var userIndex = -1;

    for (let i = 0; i < users.length; i++) {
      const element = users[i];
      if (element.id === user.id) {
        userIndex = i;
        break;
      }
    }

    if (user !== null && userIndex > -1) {
      setState({
        ...state,
        backdropOpen: true
      });

      apiService.deleteUser(user.id, (response) => {
        users.splice(userIndex, 1);

        setState({
          ...state,
          users: users,
          confirmDialogOpen: false,
          confirmDialogUser: null,
          backdropOpen: false,

          modalOpen: false,
          modalUserState: null,

          successAlertOpen: true,
          successAlertText: "Пользователь удален"
        });
        
      }, (error) => {
        console.log(error.response);
        if (error.response.status === 401) {
          auth.signout();
          setState({
            ...state,
            redirectToLogin: true
          });
        } else {
          var errorText = "Произошла неизвестная ошибка"
          if (error.response !== null && error.response.data !== null && error.response.data.error !== null) {
            errorText = error.response.data.error;
          }

          setState({
            ...state,
            confirmDialogOpen: false,
            confirmDialogUser: null,
            backdropOpen: false,
  
            modalOpen: false,
            modalUserState: null,
  
            errorAlertOpen: true,
            errorAlertText: errorText,
          });
        }
      })
    } 
  }

  const handleUserDialogDelete = () => {
    setState({
      ...state,
      confirmDialogOpen: true,
      confirmDialogUser: state.modalUserState,
    });
  }

  const handleConfirmDialogCancel = () => {
    setState({
      ...state,
      confirmDialogOpen: false,
      confirmDialogUser: null,
    })
  }

  React.useEffect(() => {

    apiService.getUsersList((response) => {
      setState({
        ...state,
        usersLoaded: true,
        users: response.data,
      });
    }, (error) => {
      const status = error.response.status;
      if (status === 401) {
        auth.signout();
        setState({
          ...state,
          redirectToLogin: true
        });
      } else if (status === 403) {
        setState({
          ...state,
          usersLoaded: true,
          users: [],

          errorAlertText: "Нет прав на просмотр пользователей",
          errorAlertOpen: true,
        });
      } else {
        console.log(error);
        var errorText = "Произошла неизвестная ошибка"
        if (error.response !== null && error.response.data !== null && error.response.data.error !== null) {
          errorText = error.response.data.error;
        }
        setState({
          ...state,
          usersLoaded: true,
          errorAlertText: errorText,
          errorAlertOpen: true,
        });
      }
    });
  }, []);

  if (state.redirectToLogin) {
    return <Redirect to="/admin/login" />
  }
  
  return (
    <div className={classes.root}>
      <Snackbar open={state.successAlertOpen} autoHideDuration={6000} onClose={handleSuccessAlertClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSuccessAlertClose} severity="success">
          {state.successAlertText}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={state.errorAlertOpen} autoHideDuration={6000} onClose={handleErrorAlertClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleErrorAlertClose} severity="error">
          {state.errorAlertText}
        </MuiAlert>
      </Snackbar>
      <Backdrop className={classes.backdrop} open={state.backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dashboard />
      <CssBaseline />
      <main className={classes.content}>
        <ConfirmDialog open={state.confirmDialogOpen} title="Удаление пользователя" description="Пользователь будет удален. Отменить действие будет невозможно." onAccept={handleConfirmDialogAccept} onCancel={handleConfirmDialogCancel} />
        <UserDialog open={state.modalOpen} userState={state.modalUserState} title={state.modalUserState === null ? "Создание пользователя" : "Редактирование пользователя"}
        onAccept={handleUserDialogAccept} onCancel={handleUserDialogCancel} onDelete={handleUserDialogDelete}/>
        <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddUserClick}>
                <AddIcon />
              </Fab>
              {/* Users list */}
              <Grid item xs={12} md={12} lg={12}>
              {!state.usersLoaded && <CircularProgress open={!state.usersLoaded}/>}
              <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>ФИО</TableCell>
                        <TableCell>Роль</TableCell>
                        <TableCell>Создан</TableCell>
                        <TableCell>Обновлен</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {state.users.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.surname + ' ' + row.name}</TableCell>
                          <TableCell>{row.role.name}</TableCell>
                          
                          <TableCell>{moment(row.created_at).format('DD MMMM YYYY')}</TableCell>
                          <TableCell>{moment(row.updated_at).format('DD MMMM YYYY')}</TableCell>
                          <TableCell align="center">
                          <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              startIcon={<EditIcon />}
                              onClick={() => {handleUserUpdate(row)}}
                            >
                              Редактировать
                            </Button>

                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              startIcon={<DeleteIcon />}
                              onClick={() => {handleUserDelete(row)}}
                            >
                              Удалить
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
    );
}
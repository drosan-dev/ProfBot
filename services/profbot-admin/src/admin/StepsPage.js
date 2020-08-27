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
import StepDialog from './components/StepDialog';
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

export default function StepsPage() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    successAlertOpen: false,
    successAlertText: "",

    errorAlertOpen: false,
    errorAlertText: "",

    steps: [],
    stepsLoaded: false,

    backdropOpen: false,

    redirectToLogin: false,

    modalOpen: false,
    modalStepState: null,

    confirmDialogOpen: false,
    confirmDialogStep: null,
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

  const handleAddStepClick = () => {
    setState({
      ...state,
      modalStepState: null,
      modalOpen: true,
    })
  }

  const handleStepDialogAccept = (step) => {
    setState({
      ...state,
      backdropOpen: true,
    });
    step.buttons = processButtonsMatrix(step.buttons);

    if (state.modalStepState === null) {
      apiService.createStep(step, (response) => {
        let newStep = {
          id: response.data.id,
          text: response.data.text,
          unreachable: response.data.unreachable,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at
        };
  
        let steps = state.steps;
        steps.unshift(newStep);
  
        setState({
          ...state,
          successAlertOpen: true,
          successAlertText: "Шаг создан",
          modalOpen: false,
          steps: steps,
          backdropOpen: false,
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
            errorAlertOpen: true,
            errorAlertText: errorText,
            backdropOpen: false,
          });
        }
      })
    } else {
      step.id = state.modalStepState.id;

      apiService.updateStep(step, (response) => {
        let newStep = {
          id: response.data.id,
          text: response.data.text,
          unreachable: response.data.unreachable,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
        };

        setState({
          ...state,
          steps: [],
          stepsLoaded: false,
          successAlertOpen: true,
          successAlertText: "Шаг обновлен",
          modalOpen: false,
          modalStepState: null,
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
            errorAlertOpen: true,
            errorAlertText: errorText,
            backdropOpen: false,
          });
        }
      })
    }

    
  }

  const handleStepDialogCancel = () => {
    setState({
      ...state,
      modalOpen: false,
    })
  }

  const handleStepUpdate = (step) => {
    setState({
      ...state,
      backdropOpen: true,
      modalStepState: null,
    })

    apiService.getStep(step.id, (response) => {
      setState({
        ...state,
        backdropOpen: false,
        modalStepState: {
          id: step.id,
          text: response.data.text,
          buttons: processButtonsListToMatrix(response.data.buttons),
        },
        modalOpen: true,
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
          backdropOpen: false,
          modalStepState: null,
  
          errorAlertOpen: true,
          errorAlertText: errorText,
        });
      }
    })
  }

  const processButtonsListToMatrix = (buttons) => {
    const rows = [...new Set(buttons.map((btn) => (btn.row)).sort())];
    
    let buttonsMatrix = [];
    var currentRow = 0;

    for (const row of rows) {
      buttonsMatrix.push([]);
      const rowButtons = buttons.filter((btn) => (btn.row === row)).sort((a, b) => { return a.column - b.column });

      for (const button of rowButtons) {
        buttonsMatrix[currentRow].push(button);
      }

      currentRow++;
    }
    return buttonsMatrix;
}

const processButtonsMatrix = (buttonsMatrix) => {
  let resultList = [];

  for (var i = 0; i < buttonsMatrix.length; i++) {
    for (var j = 0; j < buttonsMatrix[i].length; j++) {
      const button = buttonsMatrix[i][j];

      button.row = i;
      button.column = j;

      if (button.to_step_id === '') {
        button.to_step_id = null;
      }

      resultList.push(button);
    }
  }

  return resultList;
}

  const handleStepDelete = (step) => {
    setState({
      ...state,
      confirmDialogOpen: true,
      confirmDialogStep: step,
    })
  }

  const handleConfirmDialogAccept = () => {
    const step = state.confirmDialogStep;
    const steps = state.steps;
    var stepIndex = -1;

    for (let i = 0; i < steps.length; i++) {
      const element = steps[i];
      if (element.id === step.id) {
        stepIndex = i;
        break;
      }
    }

    if (step !== null && stepIndex > -1) {
      setState({
        ...state,
        backdropOpen: true
      });

      apiService.deleteStep(step.id, (response) => {
        const steps = state.steps;

        steps.splice(stepIndex, 1);

        setState({
          ...state,
          steps: steps,
          confirmDialogOpen: false,
          confirmDialogStep: null,
          backdropOpen: false,

          modalOpen: false,
          modalStepState: null,

          successAlertOpen: true,
          successAlertText: "Шаг удален"
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
            confirmDialogStep: null,
            backdropOpen: false,
  
            modalOpen: false,
            modalStepState: null,
  
            errorAlertOpen: true,
            errorAlertText: errorText,
          });
        }
      })
    } 
  }

  const handleStepDialogDelete = () => {
    setState({
      ...state,
      confirmDialogOpen: true,
      confirmDialogStep: state.modalStepState,
    });
  }

  const handleConfirmDialogCancel = () => {
    setState({
      ...state,
      confirmDialogOpen: false,
      confirmDialogStep: null,
    })
  }

  function truncateString(str, num) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  React.useEffect(() => {
    if (!state.stepsLoaded) {
      getStepSlist();
    }
  }, [state.stepsLoaded]);

  const getStepSlist = () => {
    apiService.getStepsList((response) => {
      setState({
        ...state,
        stepsLoaded: true,
        steps: response.data,
      });
    }, (error) => {
      const status = error.response.status;
      if (status === 401) {
        auth.signout()
        setState({
          ...state,
          redirectToLogin: true
        });
      } else {
        console.log(error);
        var errorText = "Произошла неизвестная ошибка"
        if (error.response !== null && error.response.data !== null && error.response.data.error !== null) {
          errorText = error.response.data.error;
        }
        setState({
          ...state,
          stepsLoaded: true,

          errorAlertText: errorText,
          errorAlertOpen: true,
        });
      }
    })
  }

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
        <ConfirmDialog open={state.confirmDialogOpen} title="Удаление шага" description="Шаг будет удален вместе с кнопками. Это действие необратимо." onAccept={handleConfirmDialogAccept} onCancel={handleConfirmDialogCancel} />
        <StepDialog open={state.modalOpen} stepState={state.modalStepState} title={state.modalStepState === null ? "Создание шага" : "Редактирование шага"} steps={state.steps}
        onAccept={handleStepDialogAccept} onCancel={handleStepDialogCancel} onDelete={handleStepDialogDelete}/>
        <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleAddStepClick}>
                <AddIcon />
              </Fab>
              {/* Steps list */}
              <Grid item xs={12} md={12} lg={12}>
              {!state.stepsLoaded && <CircularProgress open={!state.stepsLoaded}/>}
              <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Текст</TableCell>
                        <TableCell>Создан</TableCell>
                        <TableCell>Обновлен</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {state.steps.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{truncateString(row.text, 60)}</TableCell>
                          
                          <TableCell>{moment(row.created_at).format('DD MMMM YYYY')}</TableCell>
                          <TableCell>{moment(row.updated_at).format('DD MMMM YYYY')}</TableCell>
                          <TableCell align="center">
                          <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              startIcon={<EditIcon />}
                              onClick={() => {handleStepUpdate(row)}}
                            >
                              Редактировать
                            </Button>

                            <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              startIcon={<DeleteIcon />}
                              onClick={() => {handleStepDelete(row)}}
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
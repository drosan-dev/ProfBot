import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Redirect } from 'react-router';

import ConfirmDialog from './ConfirmDialog';

import {validatePassword, validateName, validateSurname} from '../../utils/validators.js';
import ApiService from '../../Services/ApiService';
import AuthManager from '../../Services/Auth';

const useStyles = makeStyles((theme) => ({
    textfield: {
        margin: theme.spacing(1),
    },
}));

const apiService = new ApiService();
const auth = new AuthManager();

export default function UserProfileDialog(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        name: "",
        surname: "",
        oldPassword: "",
        newPassword: "",
        
        oldPasswordErrorText: "",
        newPasswordErrorText: "",
        nameErrorText: "",
        surnameErrorText: "",

        isLoading: true,
        loadedName: "",
        loadedSurname: "",

        successAlertText: "",
        successAlertOpen: false,

        errorAlertText: "",
        errorAlertOpen: false,

        confirmDialogOpen: false,
    });

    React.useEffect(() => {
        if (!props.open) return;

        const id = auth.getId();

        apiService.getUser(id, (response) => {
            setState({
                ...state,
                name: response.data.name,
                surname: response.data.surname,

                isLoading: false,

                loadedName: response.data.name,
                loadedSurname: response.data.surname,
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
                    isLoading: false,

                    errorAlertText: errorText,
                    errorAlertOpen: true,
                });
            }
        })
    }, [props.open]);

    const handleTextFieldChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
  
        setState({
            ...state,
            [name]: value
        });
    }

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

    const handleAccept = () => {
        const isValidOldPassword = state.newPassword === "" & state.oldPassword === "" || validatePassword(state.oldPassword);
        const isValidNewPassword = state.newPassword === "" & state.oldPassword === "" || validatePassword(state.newPassword);
        const isValidName = validateName(state.name);
        const isValidSurname = validateSurname(state.surname);

        setState({
            ...state,
            newPasswordErrorText: isValidNewPassword ? "" : "Некорректный пароль",
            oldPasswordErrorText: isValidOldPassword ? "" : "Некорректный пароль",
            nameErrorText: isValidName ? "" : "Некорректное имя",
            surnameErrorText: isValidSurname ? "" : "Некорректная фамилия",
        });

        if (isValidNewPassword && isValidOldPassword && isValidName && isValidSurname) {
            const id = auth.getId();

            var isChanged = false;
            var updatedUser = {}

            if (state.name !== state.loadedName) {
                updatedUser.name = state.name;
                isChanged = true;
            }

            if (state.surname !== state.loadedSurname) {
                updatedUser.surname = state.surname;
                isChanged = true;
            }

            if (state.newPassword !== "" && state.oldPassword !== "") {
                updatedUser.new_password = state.newPassword;
                updatedUser.old_password = state.oldPassword;
                isChanged = true;
            }

            if (isChanged) {
                setState({
                    ...state,
                    isLoading: true,
                });

                apiService.updateUser(id, updatedUser, (response) => {
                    setState({
                        ...state,
                        name: response.data.name,
                        surname: response.data.surname,

                        loadedName: response.data.name,
                        loadedSurname: response.data.surname,

                        oldPassword: "",
                        newPassword: "",

                        nameErrorText: "",
                        surnameErrorText: "",
                        oldPasswordErrorText: "",
                        newPasswordErrorText: "",

                        successAlertText: "Профиль обновлен",
                        successAlertOpen: true,
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
                            isLoading: false,

                            errorAlertText: errorText,
                            errorAlertOpen: true,

                            nameErrorText: "",
                            surnameErrorText: "",
                            oldPasswordErrorText: "",
                            newPasswordErrorText: "",
                        });
                    }
                })
            } else {
                setState({
                    ...state,
                    isLoading: false,

                    successAlertText: "Профиль обновлен",
                    successAlertOpen: true,

                    nameErrorText: "",
                    surnameErrorText: "",
                    oldPasswordErrorText: "",
                    newPasswordErrorText: "",
                });
            }
        }
    }
    
    const handleDelete = () => {
        setState({
            ...state,
            confirmDialogOpen: true,
        })
    }

    const handleConfirmDialogAccept = () => {
        const id = auth.getId();

        setState({
            ...state,
            confirmDialogOpen: false,
        });

        apiService.deleteUser(id, (response) => {
            auth.signout();
            setState({
                ...state,
                redirectToLogin: true,
            });
        }, (error) => {
            console.log(error);
            const status = error.response.status;
            if (status === 401) {
                auth.signout()
                setState({
                    ...state,
                    redirectToLogin: true,
                });
            } else {
                console.log(error);
                var errorText = "Произошла неизвестная ошибка"
                if (error.response !== null && error.response.data !== null && error.response.data.error !== null) {
                    errorText = error.response.data.error;
                }

                setState({
                    ...state,

                    errorAlertText: errorText,
                    errorAlertOpen: true,
                });
            }
        })
    }

    const handleConfirmDialogCancel = () => {
        setState({
            ...state,
            confirmDialogOpen: false,
        })
    }

    const handleClose = () => {
        setState({
            ...state,

            name: "",
            surname: "",
            oldPassword: "",
            newPassword: "",
        
            oldPasswordErrorText: "",
            newPasswordErrorText: "",
            nameErrorText: "",
            surnameErrorText: "",

            isLoading: false,
        });

        props.onCancel();
    }

    if (state.redirectToLogin) {
        return <Redirect to="/admin/login" />
    }
    
    return (
        <div>
            <ConfirmDialog open={state.confirmDialogOpen} title="Удаление аккаунта" description="Аккаунт будет удален. Отменить действие будет невозможно." onAccept={handleConfirmDialogAccept} onCancel={handleConfirmDialogCancel} />
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
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
                <DialogTitle id="form-dialog-title">Редактирование аккаунта</DialogTitle>
                {
                    state.isLoading && <LinearProgress />
                }
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                value={state.name}
                                margin="normal"
                                className={classes.textfield}
                                id="name"
                                name="name"
                                label="Имя"
                                type="text"
                                fullWidth
                                onChange={handleTextFieldChange}
                                error={state.nameErrorText !== ""}
                                helperText={state.nameErrorText}
                                disabled={state.isLoading}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                value={state.surname}
                                margin="normal"
                                className={classes.textfield}
                                id="surname"
                                name="surname"
                                label="Фамилия"
                                type="text"
                                fullWidth
                                onChange={handleTextFieldChange}
                                error={state.surnameErrorText !== ""}
                                helperText={state.surnameErrorText}
                                disabled={state.isLoading}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                value={state.newPassword}
                                margin="normal"
                                className={classes.textfield}
                                id="newPassword"
                                name="newPassword"
                                label="Новый пароль"
                                type="password"
                                fullWidth
                                onChange={handleTextFieldChange}
                                error={state.newPasswordErrorText !== ""}
                                helperText={state.newPasswordErrorText}
                                disabled={state.isLoading}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                value={state.oldPassword}
                                margin="normal"
                                className={classes.textfield}
                                id="oldPassword"
                                name="oldPassword"
                                label="Старый пароль"
                                type="password"
                                fullWidth
                                onChange={handleTextFieldChange}
                                error={state.oldPasswordErrorText !== ""}
                                helperText={state.oldPasswordErrorText}
                                disabled={state.isLoading}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button color="secondary" onClick={handleDelete} disabled={state.isLoading}>
                            Удалить
                    </Button>

                    <Button color="primary" onClick={handleClose}>
                        Отмена
                    </Button>

                    <Button color="primary" onClick={handleAccept} disabled={state.isLoading}>
                        Применить
                    </Button>
                </DialogActions>
        </Dialog>
      </div>
    );
    
}
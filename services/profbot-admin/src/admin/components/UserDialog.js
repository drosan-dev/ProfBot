import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import { makeStyles } from '@material-ui/core/styles';

import {validateEmail, validatePassword, validateName, validateSurname} from '../../utils/validators.js';

const useStyles = makeStyles((theme) => ({
    selectEmpty: {
        marginTop: theme.spacing(20),
    },
    textfield: {
        margin: theme.spacing(1),
    }
}));


export default function UserDialog(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        email: "",
        name: "",
        surname: "",
        role_id: 1,
        password: "",
        
        isUpdate: props.userState !== null,
        deleteButtonVisible: props.userState !== null,

        emailErrorText: "",
        passwordErrorText: "",
        nameErrorText: "",
        surnameErrorText: "",
    });

    React.useEffect(() => {
        setState({
            ...state,

            email: props.userState ? props.userState.email : "",
            name: props.userState ? props.userState.name : "",
            surname: props.userState ? props.userState.surname : "",
            role_id: props.userState ? props.userState.role.id : 1,
        
            isUpdate: props.userState !== null,
            deleteButtonVisible: props.userState !== null,

            emailErrorText: "",
            passwordErrorText: "",
            nameErrorText: "",
            surnameErrorText: "",
        });
    }, [props.userState]);

    const handleTextFieldChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
  
        setState({
            ...state,
            [name]: value
        });
    }

    const handleRoleChange = (event) => {
        setState({
            ...state,
            role_id: event.target.value
        });
    }

    const handleAccept = () => {
        let isValidEmail = validateEmail(state.email);
        let isValidPassword = state.isUpdate & state.password === "" || validatePassword(state.password);
        let isValidName = validateName(state.name);
        let isValidSurname = validateSurname(state.surname);

        setState({
            ...state,
            emailErrorText: isValidEmail ? "" : "Некорректный email",
            passwordErrorText: isValidPassword ? "" : "Некорректный пароль",
            nameErrorText: isValidName ? "" : "Некорректное имя",
            surnameErrorText: isValidSurname ? "" : "Некорректная фамилия",
        });

        if (isValidEmail && isValidPassword && isValidName && isValidSurname) {
            setState({
                ...state,
                email: "",
                name: "",
                surname: "",
                password: "",
                role_id: 1,

                deleteButtonVisible: false,
                isUpdate: false,
            });

            props.onAccept({
                email: state.email,
                name: state.name,
                surname: state.surname,
                password: state.password,
                role_id: state.role_id,
            })
        }
    }
    
    const handleDelete = () => {
        props.onDelete();
    }

    const handleClose = () => {
        setState({
            ...state,

            email: "",
            name: "",
            surname: "",
            password: "",
            role_id: 1,

            deleteButtonVisible: false
        });

        props.onCancel();
    }
    
    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                            value={state.email}
                            margin="normal"
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            onChange={handleTextFieldChange}
                            error={state.emailErrorText !== ""}
                            helperText={state.emailErrorText}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                            margin="normal"
                            id="password"
                            name="password"
                            label="Пароль"
                            type="password"
                            fullWidth
                            onChange={handleTextFieldChange}
                            error={state.passwordErrorText !== ""}
                            helperText={state.passwordErrorText}
                            />
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                            value={state.name}
                            margin="normal"
                            id="name"
                            name="name"
                            label="Имя"
                            type="text"
                            fullWidth
                            onChange={handleTextFieldChange}
                            error={state.nameErrorText !== ""}
                            helperText={state.nameErrorText}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                            value={state.surname}
                            margin="normal"
                            id="surname"
                            name="surname"
                            label="Фамилия"
                            type="text"
                            fullWidth
                            onChange={handleTextFieldChange}
                            error={state.surnameErrorText !== ""}
                            helperText={state.surnameErrorText}
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl>
                            <InputLabel id="select-role-label">Роль</InputLabel>
                            <Select
                            labelId="select-role-label"
                            id="role"
                            value={state.role_id}
                            className={classes.selectEmpty}
                            onChange={handleRoleChange}
                            >
                                <MenuItem value={1}>Модератор</MenuItem>
                                <MenuItem value={2}>Администратор</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    
                </Grid>
            </DialogContent>

            <DialogActions>
                {state.deleteButtonVisible &&
                    <Button color="secondary" onClick={handleDelete}>
                        Удалить
                    </Button>
                }

                <Button color="primary" onClick={handleClose}>
                    Отмена
                </Button>

                <Button color="primary" onClick={handleAccept}>
                    Применить
                </Button>
            </DialogActions>
      </Dialog>
    );
    
}
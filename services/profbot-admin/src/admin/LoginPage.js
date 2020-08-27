import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Redirect } from 'react-router'

import ApiService from '../Services/ApiService'
import AuthManager from '../Services/Auth'

import {validateEmail, validatePassword} from '../utils/validators.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const apiService = new ApiService();
const auth = new AuthManager();

export default function LoginPage(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
      isLoading: false,
      redirect: auth.isAuthorized(),
      isInvalidEmail: false,
      isInvalidPassword: false,
      email: "",
      password: "",
  });

  const handleTextFieldChange = (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.value;

      setState({
          ...state,
          [name]: value
      });
  }

  const handleSignIn = () => {
    setState({
        ...state,
        isLoading: true,
        errorText: null,
    })

    const email = state.email;
    const password = state.password;

    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);

    if (isValidEmail && isValidPassword) {
      apiService.login({
        email: email,
        password: password
      }, (response) => {
        auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)

        setState({
            ...state,
            redirect: true
        });
      }, (error) => {
        console.log(error)
        const status = error.response.status;
        let errorText = ""
        switch (status) {
            case 401:
                errorText = "Не верный email или пароль"
                break;
            
            case 400:
                errorText = "Некорректный email или пароль"
                break;
        
            default:
                errorText = "Непредвиденная ошибка"
                console.log(status)
                console.log(error)
                console.log(error.response.data)
                break;
        }
        setState({
            ...state,
            isInvalidEmail: false,
            isInvalidPassword: false,
            errorText: errorText
        });
      })
    } else {
        setState({
            ...state,
            isInvalidEmail: !isValidEmail,
            isInvalidPassword: !isValidPassword,
            isLoading: false,
        })
    }
  };

  if (state.redirect) {
      const { from } = props.location.state || { from: { pathname: '/' } }
      console.log(from)
      return <Redirect to={from} />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Backdrop className={classes.backdrop} open={state.isLoading}>
        <CircularProgress />
      </Backdrop>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Вход в панель администратора
        </Typography>
        <div className={classes.form}>
          <TextField
            error={state.isInvalidEmail}
            helperText={state.isInvalidEmail && "Некорректный email"}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Электронная почта"
            name="email"
            autoComplete="email"
            value={state.email}
            onChange={handleTextFieldChange}
            disabled={state.isLoading}
          />
          <TextField
            error={state.isInvalidPassword}
            helperText={state.isInvalidPassword && "Пароль должен содержать минимум 6 символов"}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            value={state.password}
            onChange={handleTextFieldChange}
            autoComplete="current-password"
            disabled={state.isLoading}
          />
          <Typography component="p" variant="subtitle2" color="error">
            {state.errorText}
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignIn}
            disabled={state.isLoading}
          >
            Войти
          </Button>
        </div>
      </div>
    </Container>
  );
}
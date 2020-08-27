import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { Typography } from '@material-ui/core';
import StepButtons from './StepButtons';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    textfield: {
        margin: theme.spacing(1),
    }
}));


export default function StepDialog(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        text: "",
        buttons: []
    });

    React.useEffect(() => {
        setState({
            text: props.stepState ? props.stepState.text : "",
            buttons: props.stepState ? props.stepState.buttons : [],

            deleteButtonVisible: props.stepState !== null
        });
    }, [props.stepState, props.title]);

    const handleTextFieldChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
  
        setState({
            ...state,
            [name]: value
        });
    }

    const handleAccept = () => {
        if (state.text !== "") {
            setState({
                text: "",
                buttons: [],
    
                deleteButtonVisible: false
            });
            props.onAccept({
                text: state.text,
                buttons: state.buttons
            })
        }
    }
    
    const handleDelete = () => {
        props.onDelete();
    }

    const handleClose = () => {
        setState({
            text: "",
            buttons: [],

            deleteButtonVisible: false
        });

        props.onCancel();
    }

    const handleButtonsChange = (buttons) => {
        state.buttons = buttons;
    }
    
    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                        value={state.text}
                        margin="normal"
                        multiline
                        id="text"
                        name="text"
                        label="Текст шага"
                        type="text"
                        fullWidth
                        onChange={handleTextFieldChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography component="p" variant="subtitle2">Кнопки</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <StepButtons buttons={state.buttons} steps={props.steps} className={classes.stepButtons} onButtonsChange={handleButtonsChange} />
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
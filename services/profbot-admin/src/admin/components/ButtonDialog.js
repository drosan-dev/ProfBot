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

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textfield: {
        margin: theme.spacing(1),
    }
}));


export default function ButtonDialog(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        type: props.buttonState ? props.buttonState.type : "text",
        color: props.buttonState ? props.buttonState.color : "",
        label: props.buttonState ? props.buttonState.label : "",
        to_step_id: props.buttonState ? (props.buttonState.to_step_id ? props.buttonState.to_step_id : -1) : -1,
        availableSteps: props.availableSteps ? props.availableSteps : []
    });

    React.useEffect(() => {
        if (props.open) {
            setState({
                type: props.buttonState ? props.buttonState.type : "text",
                color: props.buttonState ? props.buttonState.color : "",
                label: props.buttonState ? props.buttonState.label : "",
                to_step_id: props.buttonState ? (props.buttonState.to_step_id ? props.buttonState.to_step_id : -1) : -1,
                availableSteps: props.availableSteps ? props.availableSteps : [],
    
                deleteButtonVisible: props.buttonState !== null
            });
        }
    }, [props.open]);

    function buttonStyle(type) {
        switch (type) {
            case 'primary':
                return {
                    backgroundColor: "#4269A7",
                    color: "white"
                }
            case 'default':
                return {
                    backgroundColor: "#DFE6ED",
                    color: "black"
                }
            case 'positive':
                return {
                    backgroundColor: "#41A63E",
                    color: "white"
                }
            case 'negative':
                return {
                    backgroundColor: "#DB323C",
                    color: "white"
                }
            default:
                return {
                    backgroundColor: "#DFE6ED",
                    color: "black"
                }
        }
    }

    function truncateString(str, num) {
        if (str.length <= num) {
          return str
        }
        return str.slice(0, num) + '...'
      }

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
        if (state.type !== "" && state.color !== "" && state.label !== "") {
            setState({
                type: "text",
                color: "",
                label: "",
                to_step_id: "",
                availableSteps: []
            });

            props.onAccept({
                type: state.type,
                color: state.color,
                label: state.label,
                to_step_id: state.to_step_id === -1 ? null : state.to_step_id
            })
        }
    }

    const handleClose = () => {
        setState({
            type: "text",
            color: "",
            label: "",
            to_step_id: "",
            availableSteps: []
        });

        props.onClose();
    }

    const handleDelete = () => {
        props.onDelete();
    }

    const handleColorChange = (event) => {
        setState({
            ...state,
            color: event.target.value
        });
    };

    const handleStepChange = (event) => {
        setState({
            ...state,
            to_step_id: event.target.value
        });
    };
    
    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth="sm">
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                        className={classes.textfield}
                        margin="normal"
                        multiline
                        value={state.label}
                        name="label"
                        label="Текст на кнопке"
                        type="text"
                        fullWidth
                        onChange={handleTextFieldChange}
                        />

                        <FormControl className={classes.formControl}>
                            <InputLabel id="select-button-type-label">Цвет</InputLabel>
                            <Select
                            labelId="select-button-type-label"
                            id="type"
                            value={state.color}
                            className={classes.selectEmpty}
                            onChange={handleColorChange}
                            >
                                <MenuItem value={'primary'} style={buttonStyle('primary')}>Основной цвет</MenuItem>
                                <MenuItem value={'default'} style={buttonStyle('default')}>Стандартный цвет</MenuItem>
                                <MenuItem value={'positive'} style={buttonStyle('positive')}>Положительный цвет</MenuItem>
                                <MenuItem value={'negative'} style={buttonStyle('negative')}>Отрицательный цвет</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel id="select-button-to_step-label">Переход на шаг</InputLabel>
                            <Select
                            labelId="select-button-to_step-label"
                            id="to_step_id"
                            value={state.to_step_id ? state.to_step_id : -1}
                            className={classes.selectEmpty}
                            onChange={handleStepChange}
                            >
                                <MenuItem key={-1} value={-1}>-</MenuItem>
                                {state.availableSteps.map((step) => (
                                    <MenuItem key={step.id} value={step.id}>{truncateString(step.text, 20)}</MenuItem>
                                ))}
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
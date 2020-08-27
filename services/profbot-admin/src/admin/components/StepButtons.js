import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import ButtonDialog from './ButtonDialog';


export default function StepButtons(props) {
    const [state, setState] = React.useState({
        buttonModalColIndex: null,
        buttonModalRowIndex: null,
        buttonModalOpen: false,
        buttonModalState: null,

        buttons: props.buttons ? props.buttons : []
    });

    const handleButtonModalClose = () => {
        setState({
            ...state,
            buttonModalOpen: false,
            buttonModalRowIndex: null,
            buttonModalColIndex: null,
            buttonModalState: null,
        });
    }

    const updateButton = (row, col, button) => {
        const buttons = state.buttons;
        if (buttons.length <= row || buttons[row].length <= col) {
            return
        }

        buttons[row][col] = button;

        props.onButtonsChange(buttons);

        setState({
            ...state,
            buttonModalOpen: false,
            buttonModalRowIndex: null,
            buttonModalColIndex: null,
            buttonModalState: null,
            buttons: buttons
        });
    }

    const createButton = (row, button) => {
        const buttons = state.buttons;
        if (buttons.length < row) {
            return
        }

        if (buttons.length === row) {
            buttons.push([]);
        }

        buttons[row].push(button);

        props.onButtonsChange(buttons);

        setState({
            ...state,
            buttonModalOpen: false,
            buttonModalRowIndex: null,
            buttons: buttons
        });
    }

    const handleButtonAccept = (button) => {
        const row = state.buttonModalRowIndex;
        const col = state.buttonModalColIndex;

        if (col !== null) {
            updateButton(row, col, button);
        } else {
            createButton(row, button);
        }
    }

    function addButton(row) {
        const buttons = state.buttons;
        if (buttons.length < row) {
            return
        }

        setState({
            ...state,
            buttonModalOpen: true,
            buttonModalRowIndex: row,
        });
    }

    function changeButton(row, col) {
        const buttons = state.buttons;
        if (buttons.length <= row || buttons[row].length <= col) {
            return
        }

        setState({
            ...state,
            buttonModalOpen: true,
            buttonModalState: buttons[row][col],
            buttonModalRowIndex: row,
            buttonModalColIndex: col,
        });

    }

    const handleDelete = () => {
        const row = state.buttonModalRowIndex;
        const col = state.buttonModalColIndex;
        const buttons = state.buttons;

        if (buttons.length <= row || buttons[row].length <= col) {
            return
        }

        const rowButtons = buttons[row];

        if (rowButtons.length === 1) {
            buttons.splice(row, 1)
        } else {
            rowButtons.splice(col, 1);
            buttons[row] = rowButtons;
        }

        props.onButtonsChange(buttons);

        setState({
            ...state,
            buttonModalOpen: false,
            buttonModalRowIndex: null,
            buttonModalColIndex: null,
            buttonModalState: null,
            buttons: buttons
        });
    }

    function truncateString(str, num) {
        if (str.length <= num) {
          return str
        }
        return str.slice(0, num) + '...'
    }

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

    const buttonsCount = () => {
        return state.buttons.reduce((accum, row) => {
            return accum + row.length;
        }, 0)
    }

    function getAvailableSteps(steps) {
        const count = buttonsCount();
        const availableSteps = steps.filter((step) => {
            if (count === 0) {
                return step.unreachable;
            }

            for (var row of state.buttons) {
                for (var button of row) {
                    if (state.buttonModalState === null) {
                        if (!step.unreachable || button.to_step_id === step.id) return false;
                    } else {
                        if (!step.unreachable) {
                            if (step.id !== state.buttonModalState.to_step_id) {
                                return false;
                            }
                        } else {
                            if (button.to_step_id === step.id) return false;
                        }
                    }
                    
                }
            }

            return true;
        })

        return availableSteps;
    }

    function buttonsRow(row, index, count) {
        if (row.length < 5 && count < 39) {
            return (
                <Grid container key={index} item xs={12} spacing={2} justify="center" alignItems="center">
                    {row.map((btn, btnIndex) => (
                        <Grid item key={btnIndex}>
                            <Button variant="contained" style={buttonStyle(btn.color)} onClick={() => changeButton(index, btnIndex)}>{truncateString(btn.label, 15)}</Button>
                        </Grid>
                    ))}
                    <Grid item key={row.length}>
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => addButton(index)}>
                            Добавить кнопку
                        </Button>
                    </Grid>
                </Grid>
            )
        }
    
        return (
            <Grid container key={index} item xs={12} spacing={2} justify="center" alignItems="center">
                {row.map((btn, btnIndex) => (
                    <Grid item key={btnIndex}>
                        <Button variant="contained" style={buttonStyle(btn.color)} onClick={() => changeButton(index, btnIndex)}>{truncateString(btn.label, 15)}</Button>
                    </Grid>
                ))}
            </Grid>
        )
    }


    function buttonsList(buttons) {
        const count = buttonsCount();

        if (count === 0) {
            return (
                <Grid container spacing={3}>
                    <Grid container item xs={12} spacing={2} justify="center" alignItems="center">
                        <Grid item>
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => addButton(0)}>
                                Добавить кнопку
                            </Button>        
                        </Grid>
                    </Grid>
                </Grid>
            );
        }

        if (buttons.length < 9 && count < 39) {
            return (
                <Grid container spacing={3}>
                    {buttons.map((row, index) => (
                        buttonsRow(row, index, count)
                    ))}
                    <Grid container key={buttons.length} item xs={12} spacing={2} justify="center" alignItems="center">
                        <Grid item key={0}>
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => addButton(buttons.length)}>
                                Добавить кнопку
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
    
        return (
            <Grid container spacing={3}>
                {buttons.map((row, index) => (
                    buttonsRow(row, index, count)
                ))}
            </Grid>
        )
    }
    
    return (
        <div>
            <ButtonDialog open={state.buttonModalOpen} title={state.buttonModalState === null ? "Создание кнопки" : "Редактирование кнопки"}
            buttonState={state.buttonModalState} availableSteps={getAvailableSteps(props.steps)}
            onClose={handleButtonModalClose} onAccept={handleButtonAccept} onDelete={handleDelete} />
            {buttonsList(state.buttons)}
        </div>
    );
    
}
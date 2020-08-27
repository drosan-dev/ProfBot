import React from 'react';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';


export default function ConfirmDialog(props) {
    
    return (
        <Dialog
        open={props.open}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
            </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={props.onAccept} color="primary" autoFocus>
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
    );
    
}
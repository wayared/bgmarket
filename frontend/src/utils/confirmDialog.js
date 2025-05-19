import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const confirmAction = ({ title = 'Confirmar', message, onConfirm }) => {
  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: 'Sí',
        onClick: onConfirm
      },
      {
        label: 'No',
        onClick: () => {}
      }
    ]
  });
};

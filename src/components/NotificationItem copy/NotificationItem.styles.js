import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  notificationItem: {
    padding: theme.spacing(1.5, 0),
  },
  notificationTime: {
    display: 'block',
    marginTop: theme.spacing(0.5),
  },
}));
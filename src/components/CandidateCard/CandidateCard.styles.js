import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: theme.palette.background.light,
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));
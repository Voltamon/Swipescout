import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(6, 0),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 0),
    },
  },
  welcomeMessage: {
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
    },
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(5),
  },
}));
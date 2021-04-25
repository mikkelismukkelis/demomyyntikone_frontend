import React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { AlphabetBtn } from './AlphabetBtn'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  title: {
    marginTop: 10
  }
}))

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'.split('')

export const FirstNameLetters = ({ firstNames }) => {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography
        className={classes.title}
        variant="h5"
        color="textPrimary"
        gutterBottom
      >
        Etunimesi ensimmäinen kirjain
      </Typography>

      <Grid container spacing={1}>
        {alphabets.map(letter => (
          <Grid item sm={2} key={letter}>
            <AlphabetBtn
              letter={letter}
              namelist={firstNames}
              namelistType="fn"
            />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

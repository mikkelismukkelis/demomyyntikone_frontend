import React from 'react'
import { Link } from 'react-router-dom'

import helpers from './helpers'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  button: {
    textAlign: 'center',
    padding: 10,
    fontSize: 20
  }
}))

export const AlphabetBtn = ({ letter, onClick, namelist, namelistType }) => {
  const classes = useStyles()

  let activeLetters = helpers.getActiveLetters(namelist)

  if (activeLetters.includes(letter.toUpperCase())) {
    return (
      <div>
        <Link
          to={`/${namelistType}/${letter}`}
          style={{ textDecoration: 'none' }}
        >
          {' '}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={onClick}
          >
            {letter}
          </Button>
        </Link>
      </div>
    )
  } else {
    return (
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled
        >
          {letter}
        </Button>
      </div>
    )
  }
}

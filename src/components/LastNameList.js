import React from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

import helpers from './helpers'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  listItem: {
    fontSize: 16,
    textDecoration: 'none'
  },
  title: {
    marginTop: 10
  }
}))

export const LastNameList = ({ letter, setLastName, lastNames }) => {
  const classes = useStyles()

  const names = helpers.findNames(letter, lastNames)

  const handleClick = (setLastName, name) => {
    return () => {
      setLastName(name)
    }
  }

  const rows = () =>
    names.map(name => (
      <Link
        style={{ textDecoration: 'none' }}
        to="/cart"
        key={name}
        onClick={handleClick(setLastName, name)}
      >
        <ListItem button divider={true}>
          <li> {name} </li>
        </ListItem>
      </Link>
    ))

  return (
    <div className={classes.root}>
      <Typography
        className={classes.title}
        variant="h5"
        color="textPrimary"
        gutterBottom
      >
        Valitse sukunimesi
      </Typography>

      <List component="nav" className={classes.listItem}>
        {rows()}
      </List>
    </div>
  )
}

import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

import { ProductItem } from './ProductItem'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: 3
  },
  listItem: {
    fontSize: 18,
    textDecoration: 'none',
    padding: 15
  }
}))

export const ProductList = ({ products }) => {
  const classes = useStyles()

  const rows = () =>
    products.map(p => (
      <ListItem className={classes.listItem} divider={true} key={p.productId}>
        <ProductItem name={p.productName} price={p.price} />
      </ListItem>
    ))

  return (
    <div className={classes.root}>
      <List component="nav">{rows()}</List>
    </div>
  )
}

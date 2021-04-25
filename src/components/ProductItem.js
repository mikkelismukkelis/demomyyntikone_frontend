import React, { useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded'
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded'

import { CartContext } from './CartContext'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  buttons: {
    position: 'absolute',
    right: 15,
    top: 5
  },
  counter: {
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 15,
    marginRight: 15
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: 10
  }
}))

const CountOccurences = ({ name, cart }) => {
  const classes = useStyles()
  let occurences = cart.reduce(function(n, product) {
    return n + (product.name === name)
  }, 0)

  return <span className={classes.counter}>{occurences}</span>
}

export const ProductItem = props => {
  const [cart, setCart] = useContext(CartContext)

  const classes = useStyles()

  const addToCart = () => {
    const product = { name: props.name, price: props.price }
    setCart(currentState => [...currentState, product])
  }

  const removeFromCart = () => {
    let name = props.name
    let updatedCart = [...cart]
    const index = updatedCart.findIndex(p => p.name === name)

    if (index > -1) {
      updatedCart.splice(index, 1)
      setCart(updatedCart)
    }

    return null
  }

  return (
    <div className={classes.root}>
      {props.name}, {props.price}€
      <span className={classes.buttons}>
        <RemoveCircleRoundedIcon
          fontSize="large"
          onClick={removeFromCart}
          color="secondary"
        />

        <CountOccurences name={props.name} cart={cart} />

        <AddCircleRoundedIcon
          fontSize="large"
          onClick={addToCart}
          color="primary"
        />
      </span>
    </div>
  )
}

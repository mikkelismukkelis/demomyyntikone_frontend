import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  textBody: {
    marginLeft: 20,
    marginTop: 20
  },
  importantText: {
    fontWeight: 'bold'
  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const Instructions = ({ openInstructions, handleCloseInstructions }) => {
  const classes = useStyles()

  return (
    <div>
      <Dialog
        fullScreen
        open={openInstructions}
        onClose={handleCloseInstructions}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseInstructions}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Ohjeistus myyntikoneen käyttöön
            </Typography>
            <Button autoFocus color="inherit" onClick={handleCloseInstructions}>
              OK
            </Button>
          </Toolbar>
        </AppBar>

        <Typography variant="body1" className={classes.textBody}>
          1. Tunnistaudu joko pin-koodilla tai nimellä
          <br />
          <b> PIN: </b>Näppäile sama pin kun oven avauksessa. Järjestelmä
          varmistaa vielä oikean nimen, valitse KYLLÄ/EI
          <br />
          <b> NIMELLÄ: </b>Klikkaa "OSTA NIMELLÄ" -nappia. Valitse sitten
          etunimesi ensimmäinen kirjain ja sitten listalta nimesi, toimi samoin
          sukunimen kanssa
          <br />
          <br />
          2. Lisää ostettavat tuotteet "koriin" + napilla (- napilla voit
          poistaa tuotteen)
          <br />
          <br />
          3. Kun olet valmis, klikkaa "Merkitse tuotteet ostetuksi"
          <br />
          <br />
          4. Järjestelmä kysyy vielä vahvistuksen, hyväksy tai hylkää
          <br />
          <br />
          <b>
            Mikäli sovellus ei toimi, tulee esim. jokin virheilmoitus, niin
            merkkaa ostoksesi vieressä olevaan listaan.
          </b>
        </Typography>
      </Dialog>
    </div>
  )
}

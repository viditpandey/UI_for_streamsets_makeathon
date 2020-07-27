import AppBar from '@material-ui/core/AppBar'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from '@material-ui/icons/Menu'
import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

export default function AppTitleBar ({ text, button, becomeAGuide }) {
  const classes = useStyles()
  return (
    <div className={`margin-bottom-15 ${classes.root}`}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton onClick={becomeAGuide} id='help-icon' edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
            <HelpOutlineIcon />
          </IconButton>
          <Typography id='current-page-title' variant='h6' className={classes.title}>
            {text || <CircularProgress color='inherit' />}
          </Typography>
          {button}
        </Toolbar>
      </AppBar>
    </div>
  )
}

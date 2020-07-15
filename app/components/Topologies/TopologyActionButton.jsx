import Button from '@material-ui/core/Button'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import CircularProgress from '@material-ui/core/CircularProgress'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite'
import React from 'react'
import ReplayIcon from '@material-ui/icons/Replay'
import SaveIcon from '@material-ui/icons/Save'

export default function TopologyActionButton ({ topology, status, disabled, createTopology, startTopology, stopTopology, validateTopology, resetTopology }) {
  let startIcon = <SaveIcon />
  let buttonText = 'PERFORM ACTION'
  let handleClickAction = () => {}
  let style = { background: '#5cb85c' }

  switch (status || topology.topologyStatus) {
    case 'EMPTY':
      style = { background: '#5cb85c' } // green
      buttonText = 'CREATE TOPOLOGY'
      handleClickAction = createTopology
      break

    case 'STOPPED':
    case 'FINISHED':
      buttonText = 'RESET TOPOLOGY'
      style = { background: '#5cb85c' } // green
      startIcon = <ReplayIcon />
      handleClickAction = resetTopology
      break

    case 'TO_START':
      buttonText = 'VALIDATE TOPOLOGY'
      style = { background: '#5cb85c' } // green
      startIcon = <CheckCircleOutlineIcon />
      handleClickAction = validateTopology
      break

    case 'VALIDATING':
      buttonText = 'VALIDATING'
      style = { background: '#0063bf' } // dark - blue
      startIcon = <CircularProgress size={15} />
      handleClickAction = () => {}
      break

    case 'VALIDATED':
      buttonText = 'START TOPOLOGY'
      style = { background: '#5cb85c' } // green
      startIcon = <PlayCircleFilledWhiteIcon />
      handleClickAction = startTopology
      break

    case 'RUNNING':
      buttonText = 'STOP TOPOLOGY'
      style = { background: '#D9534F' } // light-red
      startIcon = <HighlightOffIcon />
      handleClickAction = stopTopology
      break

    case 'ERROR':
      buttonText = 'RETRY VALIDATION'
      startIcon = <ReplayIcon />
      handleClickAction = validateTopology
      break

    default:
      break
  }

  return (
    <Button
      variant='contained'
      color='primary'
      disabled={disabled}
      style={style}
      size='small'
      onClick={(e) => handleClickAction()}
      startIcon={startIcon}
    >
      {buttonText}
    </Button>
  )
}

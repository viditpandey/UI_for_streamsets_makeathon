import Button from '@material-ui/core/Button'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import CircularProgress from '@material-ui/core/CircularProgress'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite'
import React from 'react'
import ReplayIcon from '@material-ui/icons/Replay'
import SaveIcon from '@material-ui/icons/Save'

export default function TopologyActionButton ({ topology, status, disabled, createTopology, startTopology, stopTopology, validateTopology }) {
  let startIcon = <SaveIcon />
  let buttonText = 'PERFORM ACTION'
  let handleClickAction = () => {}

  switch (status || topology.status) {
    case 'EMPTY':
      buttonText = 'CREATE TOPOLOGY'
      handleClickAction = createTopology
      break

    case 'TO_START':
    case 'STOPPED':
    case 'FINISHED':
      buttonText = 'VALIDATE TOPOLOGY'
      startIcon = <CheckCircleOutlineIcon />
      //   handleClickAction = validateTopology
      break

    case 'VALIDATING':
      buttonText = 'VALIDATING'
      startIcon = <CircularProgress />
      handleClickAction = () => {}
      break

    case 'VALIDATED':
      buttonText = 'START TOPOLOGY'
      startIcon = <PlayCircleFilledWhiteIcon />
      handleClickAction = startTopology
      break

    case 'RUNNING':
      buttonText = 'STOP TOPOLOGY'
      startIcon = <HighlightOffIcon />
      handleClickAction = stopTopology
      break

    case 'ERROR':
      buttonText = 'RETRY VALIDATION'
      startIcon = <ReplayIcon />
      //   handleClickAction = validateTopology
      break

    default:
      break
  }

  return (
    <Button
      variant='contained'
      color='primary'
      disabled={disabled}
      size='small'
      onClick={(e) => handleClickAction()}
      startIcon={startIcon}
    >
      {buttonText}
    </Button>
  )
}

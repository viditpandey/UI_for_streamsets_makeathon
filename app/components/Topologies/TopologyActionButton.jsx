import Button from '@material-ui/core/Button'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled'
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite'
import React from 'react'
import ReplayIcon from '@material-ui/icons/Replay'
import SaveIcon from '@material-ui/icons/Save'

export default function TopologyActionButton ({
  topology, status, disabled,
  disabledSecondary,
  createTopology, startTopology, stopTopology,
  validateTopology, resetTopology, pauseTopology
}) {
  let startIcon = <SaveIcon />
  let buttonText = 'PERFORM ACTION'
  let handleClickAction = () => {}
  let style = { background: '#5cb85c' }
  let renderSecondaryButton = false
  const secondaryButtonIcon = <PauseCircleFilledIcon />
  let secondaryButtonText = 'PERFORM ACTION'
  let handleSecondaryClickAction = () => {}
  const secondaryButtonStyle = { background: '#509ade' }

  switch (status || topology.topologyStatus) {
    case 'EMPTY':
      style = { background: '#5cb85c' } // green
      buttonText = 'CREATE TOPOLOGY'
      handleClickAction = createTopology
      renderSecondaryButton = false
      break

    case 'STOPPED':
      buttonText = 'START TOPOLOGY'
      style = { background: '#5cb85c' } // green
      startIcon = <PlayCircleFilledWhiteIcon />
      handleClickAction = startTopology
      renderSecondaryButton = false
      break
    case 'FINISHED':
      buttonText = 'RESET TOPOLOGY'
      style = { background: '#5cb85c' } // green
      startIcon = <ReplayIcon />
      handleClickAction = resetTopology
      renderSecondaryButton = false
      break

    case 'TO_START':
      buttonText = 'VALIDATE TOPOLOGY'
      style = { background: '#5cb85c' } // green
      startIcon = <CheckCircleOutlineIcon />
      handleClickAction = validateTopology
      renderSecondaryButton = false
      break

    case 'VALIDATING':
      buttonText = 'VALIDATING'
      style = { background: '#0063bf' } // dark - blue
      startIcon = <CircularProgress size={15} />
      handleClickAction = () => {}
      renderSecondaryButton = false
      break

    case 'VALIDATED':
      buttonText = 'START TOPOLOGY'
      style = { background: '#5cb85c' } // green
      startIcon = <PlayCircleFilledWhiteIcon />
      handleClickAction = startTopology
      renderSecondaryButton = false
      break

    case 'RUNNING':
      buttonText = 'STOP TOPOLOGY'
      style = { background: '#D9534F' } // light-red
      startIcon = <HighlightOffIcon />
      handleClickAction = stopTopology
      renderSecondaryButton = true
      secondaryButtonText = 'PAUSE TOPOLOGY'
      handleSecondaryClickAction = pauseTopology
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
    <div>
      <Grid container spacing={0} justify='flex-end'>
        {renderSecondaryButton && (
          <Grid item xs={12} md={6}>
            <Button
              variant='contained'
              color='primary'
              disabled={disabledSecondary}
              style={secondaryButtonStyle}
              size='small'
              onClick={(e) => handleSecondaryClickAction()}
              startIcon={secondaryButtonIcon}
            >
              {secondaryButtonText}
            </Button>
          </Grid>
        )}
        <Grid item xs={12} md={renderSecondaryButton ? 6 : 12}>
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
        </Grid>
      </Grid>
    </div>
  )
}

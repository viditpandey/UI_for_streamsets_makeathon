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
import { HEX_CODES } from '../../configs/constants'

// const topologyPossibleStatuses = ['FAILED', 'PAUSED', 'VALIDATED', 'FINISHED', 'VALIDATING', 'RUNNING', 'ERROR', 'TO_START', 'STOPPED']

export default function TopologyActionButton ({
  topology, status, disabled,
  disabledSecondary,
  createTopology, startTopology, stopTopology,
  validateTopology, resetTopology, pauseTopology, resumeTopology
}) {
  let startIcon = <SaveIcon />
  let buttonText = 'PERFORM ACTION'
  let handleClickAction = () => {}
  let style = { background: HEX_CODES.green }
  let renderSecondaryButton = false
  let renderPrimaryButton = true
  let secondaryButtonIcon = <PauseCircleFilledIcon />
  let secondaryButtonText = 'PERFORM ACTION'
  let handleSecondaryClickAction = () => {}
  const secondaryButtonStyle = { background: HEX_CODES.blue }

  switch (status || topology.topologyStatus) {
    case 'EMPTY':
      style = { background: HEX_CODES.green }
      buttonText = 'CREATE TOPOLOGY'
      handleClickAction = createTopology
      renderSecondaryButton = false
      break

    case 'STOPPED':
      buttonText = 'START TOPOLOGY'
      style = { background: HEX_CODES.green }
      startIcon = <PlayCircleFilledWhiteIcon />
      handleClickAction = startTopology
      renderSecondaryButton = false
      break

      // case 'FINISHED':
      //   buttonText = 'RESET TOPOLOGY'
      //   style = { background: HEX_CODES.green }
      //   startIcon = <ReplayIcon />
      //   handleClickAction = resetTopology
      //   renderSecondaryButton = false
      //   break

    case 'FINISHED':
    case 'TO_START':
    case 'FAILED':
      buttonText = 'VALIDATE TOPOLOGY'
      style = { background: HEX_CODES.green }
      startIcon = <CheckCircleOutlineIcon />
      handleClickAction = validateTopology
      renderSecondaryButton = false
      break

    case 'VALIDATING':
      buttonText = 'VALIDATING'
      style = { background: HEX_CODES.blue }
      startIcon = <CircularProgress color='inherit' size={15} />
      handleClickAction = () => {}
      renderSecondaryButton = false
      break

    case 'VALIDATED':
      buttonText = 'START TOPOLOGY'
      style = { background: HEX_CODES.green }
      startIcon = <PlayCircleFilledWhiteIcon />
      handleClickAction = startTopology
      renderSecondaryButton = false
      break

      // case 'VALIDATING':
    case 'STARTING':
    case 'RESUMING':
    case 'STOPPING':
    case 'RESETTING':
    case 'PAUSING':
      renderPrimaryButton = false
      renderSecondaryButton = true
      secondaryButtonText = `${topology.topologyStatus} TOPOLOGY` || 'PAUSING TOPOLOGY'
      handleSecondaryClickAction = () => {}
      secondaryButtonIcon = <CircularProgress color='inherit' size={15} />
      break

    case 'RUNNING':
      buttonText = 'STOP TOPOLOGY'
      style = { background: HEX_CODES.red }
      startIcon = <HighlightOffIcon />
      handleClickAction = stopTopology
      renderSecondaryButton = true
      secondaryButtonText = 'PAUSE TOPOLOGY'
      handleSecondaryClickAction = pauseTopology
      break

    case 'PAUSED':
      buttonText = 'RESUME TOPOLOGY'
      style = { background: HEX_CODES.green }
      startIcon = <PlayCircleFilledWhiteIcon />
      handleClickAction = resumeTopology
      renderSecondaryButton = false
      break

    case 'ERROR':
      buttonText = 'RETRY VALIDATION'
      startIcon = <ReplayIcon />
      renderSecondaryButton = false
      handleClickAction = validateTopology
      break

    default:
      break
  }

  return (
    <div>
      <Grid container spacing={3} justify='flex-end'>
        {renderSecondaryButton && (
          <Grid item xs={12} md={6}>
            <Button
              className='full-width'
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
        {renderPrimaryButton &&
          <Grid item xs={12} md={6}>
            <Button
              className='full-width'
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
          </Grid>}
      </Grid>
    </div>
  )
}

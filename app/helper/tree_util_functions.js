import React from 'react'
import Chip from '@material-ui/core/Chip'
import LinearProgress from '@material-ui/core/LinearProgress'
import SettingsIcon from '@material-ui/icons/Settings'

import { cloneDeep } from 'lodash'
import { HEX_CODES, getStyleByPipelineStatus } from '../configs/constants'
import { Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

export function listToTree (list) {
  try {
    var map = {}; var node; var roots = []; var i

    for (i = 0; i < list.length; i += 1) {
      map[list[i].pipelineId] = i // initialize the map
      list[i].children = [] // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i]
      if (node.dependsOn !== 'root') {
        list[map[node.dependsOn]].children.push(node)
      } else {
        roots.push(node)
      }
    }
    return roots
  } catch (error) {
    return []
  }
}

const BorderLinearProgress = ({ loaderBackground, backgroundColor }) => withStyles((theme) => ({
  root: {
    borderRadius: 10
  },
  colorPrimary: {
    backgroundColor: loaderBackground
  },
  bar: {
    borderRadius: 5,
    backgroundColor: backgroundColor || HEX_CODES.grey
  }
}))(LinearProgress)

const loaderColorByPipelineStatus = {
  STARTING: { background: HEX_CODES.blueVariant1 },
  RUNNING: { background: HEX_CODES.greenVariant1 },
  VALIDATING: { background: HEX_CODES.blueVariant1 }
}

const PIPELINES_IN_PROGRESS = ['STARTING', 'RUNNING', 'VALIDATING', 'PAUSING']

function renderNode ({ p, topologyStatus, handlePipelineClick }) {
  const title = p.title || p.pipelineTitle || p.pipelineId
  const errorCount = p.errorCount ? `(error count: ${p.errorCount})` : ''
  let statusLabel = p.pipelineStatus || 'TO_START'
  if (topologyStatus === 'PAUSED') statusLabel = 'PAUSED'
  const CustomProgressBar = PIPELINES_IN_PROGRESS.indexOf(statusLabel) !== -1 ? BorderLinearProgress({
    loaderBackground: loaderColorByPipelineStatus[statusLabel].background,
    backgroundColor: getStyleByPipelineStatus[statusLabel].background
  }) : () => null
  const chipLabel = (

    <div>{title} (instance of {p.instanceId}) ({statusLabel}) {errorCount}
      <div style={{ margin: '0 10px' }}>
        {<CustomProgressBar />}
      </div>
    </div>)

  return (
    <Tooltip title={`Runs at ${p.processAfter || 'stop'} of parent pipeline. Retry Count: ${p.threshold || 0}. Wait Time: ${p.waitTime || 0}s.`}>
      <Chip
        id={p.pipelineId}
        style={getStyleByPipelineStatus[statusLabel]}
        deleteIcon={<SettingsIcon />}
        size='medium'
        label={chipLabel}
        onDelete={(e) => handlePipelineClick(true, p)}
        onClick={(e) => handlePipelineClick(true, p)}
      />
    </Tooltip>
  )
}

export function getTreeCompatibleData ({ list, topologyStatus, handlePipelineClick }) {
  return list.map(p => {
    return {
      ...cloneDeep(p),
      title: renderNode({ p, topologyStatus, handlePipelineClick }),
      pipelineId: p.pipelineId,
      expanded: true,
      children: []
    }
  })
}

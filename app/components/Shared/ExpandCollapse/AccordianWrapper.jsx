import AccordionSummary from '@material-ui/core/AccordionSummary'
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Paper from '@material-ui/core/Paper'
import React, { useState } from 'react'

import { Typography } from '@material-ui/core'

export default function AccordianWrapper ({ defaultExpanded = false, renderChildrend = () => {}, title }) {
  const [open, setOpen] = useState(defaultExpanded)
  return (
    <div>
      <Paper>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          onClick={() => setOpen(!open)}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography variant='h6' component='div'>
            {title}
          </Typography>
        </AccordionSummary>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <Divider />
          {renderChildrend()}
        </Collapse>
      </Paper>
    </div>
  )
}

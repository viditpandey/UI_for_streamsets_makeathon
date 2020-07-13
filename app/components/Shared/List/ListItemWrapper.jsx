
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    cursor: 'pointer'
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}))
export default function ListItemWrapper ({ items, itemClick, collapsedText, secondaryText, secondaryActionButton, getPrimaryText, getKey }) {
  const classes = useStyles()

  return (
    <List className={classes.root}>
      {items.map(item => {
        return (

          <ListItemRenderer
            key={getKey(item)}
            item={item}
            itemClick={itemClick}
            secondaryText={secondaryText}
            classes={classes}
            getKey={getKey}
            collapsedText={collapsedText(item)}
            getPrimaryText={getPrimaryText}
            secondaryActionButton={secondaryActionButton(item)}
          />

        )
      })}
    </List>
  )
}

const ListItemRenderer = ({ item, getPrimaryText, itemClick, collapsedText, secondaryText, classes, secondaryActionButton, getKey }) => {
  const [open, setOpen] = useState(false)
  return (
    <Paper className='clickable'>
      <ListItem>
        {open ? <ExpandLess onClick={() => setOpen(false)} /> : <ExpandMore onClick={() => setOpen(true)} />}
        <ListItemText
          id={getKey(item)}
          onClick={e => itemClick(item)}
          primary={(getPrimaryText && getPrimaryText(item))}
          secondary={secondaryText(item)}
        />
        <ListItemSecondaryAction>
          {secondaryActionButton}
        </ListItemSecondaryAction>
      </ListItem>
      {collapsedText &&
        <Collapse in={open} timeout='auto' unmountOnExit>
          <ListItem button className={classes.nested}>
            <ListItemText
              id={getKey(item)}
              secondary={collapsedText}
            />
          </ListItem>
        </Collapse>}
      <Divider />
      <div className='margin-bottom-15' />
    </Paper>
  )
}

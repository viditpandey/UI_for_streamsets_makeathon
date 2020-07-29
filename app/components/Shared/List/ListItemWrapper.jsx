
import Collapse from '@material-ui/core/Collapse'
import Divider from '@material-ui/core/Divider'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
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
export default function ListItemWrapper ({
  items, itemClick,
  collapsedText, secondaryText, secondaryActionButton,
  getPrimaryText, getKey, listId
}) {
  const classes = useStyles()

  return (
    <Grid container spacing={0} alignItems='center'>
      <Grid item xs={1} />
      <Grid item xs={10}>
        <List className={classes.root}>
          {items.map((item, index) => {
            return (

              <ListItemRenderer
                key={`${getKey(item)}_${index}`}
                item={item}
                itemClick={itemClick}
                secondaryText={secondaryText}
                classes={classes}
                getKey={getKey}
                collapsedText={collapsedText(item)}
                getPrimaryText={getPrimaryText}
                secondaryActionButton={secondaryActionButton(item)}
                listId={listId}
              />

            )
          })}
        </List>
      </Grid>
    </Grid>
  )
}

const ListItemRenderer = ({ item, getPrimaryText, itemClick, collapsedText, secondaryText, classes, secondaryActionButton, getKey, listId }) => {
  const [open, setOpen] = useState(false)
  return (
    <Paper className='clickable' id={listId}>
      <ListItem>
        <ListItemAvatar>
          {open ? <ExpandLess onClick={() => setOpen(false)} /> : <ExpandMore onClick={() => setOpen(true)} />}
        </ListItemAvatar>
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
      <Divider />
      {collapsedText &&
        <Collapse in={open} timeout='auto' unmountOnExit>
          <ListItem button className={classes.nested}>
            <ListItemText
              id={getKey(item)}
              secondary={collapsedText}
            />
          </ListItem>
        </Collapse>}
      {open && <div className='margin-bottom-15' />}
    </Paper>
  )
}

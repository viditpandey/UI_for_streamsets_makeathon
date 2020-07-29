import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Checkbox from '@material-ui/core/Checkbox'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto'
  },
  cardHeader: {
    padding: theme.spacing(1, 2)
  },
  list: {
    width: 300,
    height: 430,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto'
  },
  button: {
    margin: theme.spacing(0.5, 0)
  }
}))

function not (a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection (a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

function union (a, b) {
  return [...a, ...not(b, a)]
}

export default function TransferList ({ left, setLeft, right, setRight, instanceIdsWithColor }) {
  const classes = useStyles()
  const [checked, setChecked] = React.useState([])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = (items) => intersection(checked, items).length

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component='div' role='list'>
        {items.map((value, index) => {
          const labelId = `transfer-list-all-item-${value.pipelineId}-label`

          return (
            <ListItem
              key={`${value.pipelineId}_${index}`}
              role='listitem'
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                style={{ color: instanceIdsWithColor[value.instanceId] }}
                id={labelId} primary={`${value.title} (${value.instanceId})`}
              />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  return (
    <Grid container spacing={2} justify='center' alignItems='center' className={classes.root}>
      <Grid item>{customList('Choices', left)}</Grid>
      <Grid item>
        <Grid container direction='column' alignItems='center'>
          <Button
            variant='outlined'
            size='small'
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label='move selected right'
          >
            &gt;
          </Button>
          <Button
            variant='outlined'
            size='small'
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label='move selected left'
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Chosen', right)}</Grid>
    </Grid>
  )
}

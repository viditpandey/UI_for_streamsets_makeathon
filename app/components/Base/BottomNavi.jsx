import AccountTreeIcon from '@material-ui/icons/AccountTree'
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import InfoIcon from '@material-ui/icons/Info'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router-dom'
const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: '10',
    boxShadow: '0px 4px 5px 10px rgba(0,0,0,0.12)'
  }
})
const naviRoutes = ['/pipelines', '/topologies', '/topologies/create']
const getDefaultValue = (currentLocation) => {
  let defaultValue = 0
  routeRegex.forEach((item, i) => {
    const isRouteMatched = item.filter(r => currentLocation.match(r))
    if (isRouteMatched && isRouteMatched.length) defaultValue = i
  })
  return defaultValue
}
const routeRegex = [[/pipelines/, /pipelines\/$/], [/topologies/, /topologies\/$/, /topologies\/create$/], [/topologies\/.+/]]
export default function SimpleBottomNavigation () {
  const history = useHistory()
  const classes = useStyles()
  const pageLoc = useLocation().pathname
  const [highlightValue, setHighlightValue] = useState(getDefaultValue(pageLoc))
  history.listen((location) => {
    const newHighlightValue = getDefaultValue(location.pathname)
    if (highlightValue !== newHighlightValue) setHighlightValue(newHighlightValue)
  })
  return (
    <BottomNavigation
      value={highlightValue}
      onChange={(event, newValue) => {
        if (highlightValue === newValue) return
        history.push(naviRoutes[newValue])
        setHighlightValue(newValue)
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label='Pipelines' icon={<AllInclusiveIcon />} />
      <BottomNavigationAction label='Topologies' icon={<AccountTreeIcon />} />
      <BottomNavigationAction label='Single Topology' icon={<InfoIcon />} />
    </BottomNavigation>
  )
}

import AccountTreeIcon from '@material-ui/icons/AccountTree'
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import InfoIcon from '@material-ui/icons/Info'
import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router-dom'
// import { Link } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: '10'
  }
})

const naviRoutes = ['/pipelines', '/topologies', '/topologies/id']

export default function SimpleBottomNavigation () {
  const history = useHistory()
  const classes = useStyles()
  let defaultValue = false
  const pageLoc = useLocation().pathname
  useEffect(() => {
    const routeRegex = [[/pipelines\/$/], [/topologies/, /topologies\/$/, /topologies\/new$/], [/topologies\/.+/]]
    routeRegex.forEach((item, i) => {
      const isRouteMatched = item.filter(r => pageLoc.match(r))
      if (isRouteMatched && isRouteMatched.length) defaultValue = i
    })
  }, [])
  const [value, setValue] = useState(defaultValue || 0)

  return (
    <BottomNavigation
      // style={{ zIndex: '10' }}
      value={value}
      onChange={(event, newValue) => {
        history.push(naviRoutes[newValue])
        setValue(newValue)
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label='All Pipelines' icon={<AllInclusiveIcon />} />
      <BottomNavigationAction label='Topologies' icon={<AccountTreeIcon />} />
      <BottomNavigationAction label='Single Topology' icon={<InfoIcon />} />
    </BottomNavigation>
  )
}

import AllInclusiveIcon from '@material-ui/icons/AllInclusive'
import BarChartIcon from '@material-ui/icons/BarChart'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import FavoriteIcon from '@material-ui/icons/Favorite'
import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
// import { Link } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0

  }
})

const naviRoutes = ['/pipelines', '/pipelines/Demo618e87ac-06d5-45b5-aeee-f63c42b4a76b', '/topologies']

export default function SimpleBottomNavigation () {
  // const location = useLocation()
  // console.log('SimpleBottomNavigation -> location', location)
  const history = useHistory()

  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        history.push(naviRoutes[newValue])
        setValue(newValue)
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label='All Pipelines' icon={<AllInclusiveIcon />} />
      <BottomNavigationAction label='Single Pipeline' icon={<FavoriteIcon />} />
      <BottomNavigationAction label='Topologies' icon={<BarChartIcon />} />
    </BottomNavigation>
  )
}

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
// import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1'
// import ExposureZeroIcon from '@material-ui/icons/ExposureZero'
// import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1'
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'
import FavoriteIcon from '@material-ui/icons/Favorite'
import BarChartIcon from '@material-ui/icons/BarChart'
// import { Link } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0

  }
})

export default function SimpleBottomNavigation () {
  const classes = useStyles()
  const [value, setValue] = useState(0)

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        console.log('SimpleBottomNavigation -> newValue', newValue)
        setValue(newValue)
      }}
      showLabels
      className={classes.root}
    >
      {/* <Link to='/pipelines'><BottomNavigationAction label="All Pipelines" icon={<AllInclusiveIcon />} /></Link>
      <Link to='/pipelines/123'><BottomNavigationAction label="Single Pipeline" icon={<FavoriteIcon />} /></Link>
      <Link to='/topologies'><BottomNavigationAction label="Topologies" icon={<BarChartIcon />} /></Link> */}
      <BottomNavigationAction label='All Pipelines' icon={<AllInclusiveIcon/>} href="/piplines"  />
      <BottomNavigationAction label='Single Pipeline' icon={<FavoriteIcon/>}  href="/pipelines/id" />
      <BottomNavigationAction label='Topologies' icon={<BarChartIcon />} href="/topologies"/>
    </BottomNavigation>
  )
}

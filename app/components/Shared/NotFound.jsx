import React from 'react'
import Grid from '@material-ui/core/Grid'

import { CircularProgress, Typography } from '@material-ui/core'

export default () => {
  return (
    <>
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs={5} />
        <Grid item xs={4}>
          <Typography> {'Still Deciding...'}</Typography>
          <CircularProgress />
        </Grid>
      </Grid>
    </>
  )
}

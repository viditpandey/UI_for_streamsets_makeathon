import 'regenerator-runtime/runtime.js'

import React, { useState, Suspense, useEffect } from 'react'
import AppTitleBar from './AppTitleBar'
import BottomNavi from './BottomNavi'
import CircularProgress from '@material-ui/core/CircularProgress'
import NotFound from '../Shared/NotFound'
import routes from '../../configs/routes'
import ToursLayout from '../Tours/ToursLayout'

import { getBackendUrl } from '../../actions/BaseActions'
import { Route, Switch } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export const AppBarContext = React.createContext({ text: '' })

const Home = (props) => {
  const { enqueueSnackbar } = useSnackbar()
  const [appBar, setAppBar] = useState({ text: '' })
  const [isTourOpen, becomeAGuide] = useState(false)

  useEffect(() => {
    async function getBaseUrl () {
      const baseUrl = await getBackendUrl().catch(e => { enqueueSnackbar('failed to fetch backend URL', { variant: 'error' }) })
      global.BASE_URL = baseUrl.data
    }
    getBaseUrl()
  }, [])

  const setAppTitle = appBar => setAppBar(appBar)

  return (
    <div>
      <div className='app-bar'>
        <AppTitleBar
          becomeAGuide={() => becomeAGuide(!isTourOpen)}
          text={appBar.text}
          button={appBar.button}
        />
      </div>
      <div className='app-body'>
        <ToursLayout
          isTourOpen={isTourOpen}
          tourPage={appBar.currentPage}
          closeTour={() => { becomeAGuide(!isTourOpen) }}
        />

        <Suspense fallback={<CircularProgress />}>
          <AppBarContext.Provider value={{
            setAppTitle: setAppTitle
          }}
          >
            <Switch>
              {routes.map((route, i) => {
                return (
                  <Route
                    key={i}
                    path={route.path}
                    exact={route.exact}
                    children={<route.component />}
                  />
                )
              })}
              <Route component={() => <NotFound />} />
            </Switch>
          </AppBarContext.Provider>
        </Suspense>
      </div>
      <BottomNavi />
    </div>
  )
}

export default Home

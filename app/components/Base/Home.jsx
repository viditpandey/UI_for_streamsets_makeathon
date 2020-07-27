import 'regenerator-runtime/runtime.js'

import AppTitleBar from './AppTitleBar'
import React, { useState, Suspense } from 'react'
import BottomNavi from './BottomNavi'
import CircularProgress from '@material-ui/core/CircularProgress'
import routes from '../../configs/routes'
import NotFound from '../Shared/NotFound'

import { Route, Switch } from 'react-router-dom'
import ToursLayout from '../Tours/ToursLayout'
export const AppBarContext = React.createContext({ text: '' })

const Home = (props) => {
  const [appBar, setAppBar] = useState({ text: '' })
  const [isTourOpen, becomeAGuide] = useState(false)

  const setAppTitle = appBar => setAppBar(appBar)

  return (
    <div>
      <div className='app-bar'>
        <AppTitleBar
          becomeAGuide={(isTourOpen) => becomeAGuide(isTourOpen)}
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

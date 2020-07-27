import React from 'react'
import Tour from 'reactour'
import Steps from '../../configs/TourStepsConstants'

export default function ToursLayout (props) {
  const { isTourOpen, closeTour, tourPage } = props
  console.log('ToursLayout -> isTourOpen', tourPage, Steps[tourPage])
  return (
    <Tour
      steps={Steps[tourPage]}
      isOpen={!!isTourOpen}
      onRequestClose={closeTour}
    />
  )
}

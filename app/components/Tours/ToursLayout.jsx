import React from 'react'
import Tour from 'reactour'
import Steps from '../../configs/TourStepsConstants'

export default function ToursLayout (props) {
  const { isTourOpen, closeTour, tourPage } = props

  return (
    <Tour
      steps={Steps[tourPage] || defaultSteps}
      isOpen={!!isTourOpen}
      startAt={0}
      onRequestClose={closeTour}
    />
  )
}
const defaultSteps = [{
  selector: '#help-icon',
  content: 'Please ask the developer(s) to not be lazy and provide you a tour for this page. Maybe they missed but atleast provided a fallback ;)'
}]

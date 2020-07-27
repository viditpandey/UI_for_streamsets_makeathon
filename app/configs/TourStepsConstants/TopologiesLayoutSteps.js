const Steps = [
  {
    selector: '#help-icon',
    content: 'Click here anytime to view what all can you do on this page.'
  },
  {
    selector: '#current-page-title',
    content: 'Showing help/to-do for: '
  },
  {
    selector: '#current-page-menu-button',
    content: 'Self explanatory.'
  },
  {
    selector: '#topologies-layout',
    content: 'Here is a list of topologies created till now.'
  },
  {
    selector: '#topologies-layout-children > li',
    content: 'This is a single Topology (With count of configured pipelines shown by default).'
  },
  {
    selector: '#topologies-layout-children > li > div.MuiListItem-root.MuiListItem-gutters.MuiListItem-secondaryAction > div.MuiListItemAvatar-root > svg',
    content: 'Click here to expand/collapse and view more details about the topology.'
  },
  {
    selector: '#topologies-action-buttons',
    content: 'These are the action buttons for a Topology. Each button will be demonstrated one by one in next steps.'
  },
  {
    selector: '#topology-schedule-button',
    content: 'Schedule Button. We thought a clock icon would be sufficient. However, this button allows you to configure an automatic schedule for this topology. You can configure a date-time or even  CRON job. Click to view the options. Also you can pause momentarily a schedule already in place.'
  },
  {
    selector: '#topology-history-button',
    content: 'History Button. We thought a different clock icon would be sufficient (No, wait we did it already for scheduler). However, this button allows you to view all the run history for this topology. Click here to navigate to the history page.'
  },
  {
    selector: '#topology-delete-button',
    content: 'Delete Button. This should be obvious. Just to re-iterate the obvious, this trash can standard button allows you to delete the topology.'
  }
]

export default Steps

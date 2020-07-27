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
    selector: '#pipelines-layout',
    content: 'Here is a list of pipelines in the environment. It updates automatically to show the latest status of each pipeline.'
  },
  {
    selector: '#pipelines-layout-children > li',
    content: 'This is a single pipeline (With Pipeline Id/title and status shown by default).'
  },
  {
    selector: '#pipelines-layout-children > li > div.MuiListItem-root.MuiListItem-gutters.MuiListItem-secondaryAction > div.MuiListItemAvatar-root > svg',
    content: 'Click here to expand/collapse and view more details about the pipeline.'
  },
  {
    selector: '#pipeline-action-button',
    content: 'This is the action button for Pipeline. It changes dynamically based on the pipeline current status. You can Start, Stop, Restart a Pipeline.'
  }
]

export default Steps

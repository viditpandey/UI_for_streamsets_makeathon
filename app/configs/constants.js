export const BASE_URL = 'http://localhost:8082'

export const HEX_CODES = {
  green: '#5cb85c',
  blue: '#0063bf',
  red: '#D9534F',
  grey: '#dedede',
  yellow: '#fafab1',

  lightBlue: '#a9cae8',
  lightRed: '#f2dede',
  lightGreen: '#dff0d8',

  greenVariant1: '#b3d6a5',
  blueVariant1: '#509ade',
  darkYellow: '#E69900'

}

export const getStyleByPipelineStatus = {
  STARTING: { background: HEX_CODES.lightBlue },
  RETRY: { background: HEX_CODES.lightRed },
  RUNNING: { background: HEX_CODES.lightGreen },
  FINISHED: { background: HEX_CODES.greenVariant1 }, // slightly darker than light green
  EDITED: { background: HEX_CODES.grey },
  STOPPED: { background: HEX_CODES.lightRed },
  ERROR: { background: HEX_CODES.lightRed },
  FAILED: { background: HEX_CODES.lightRed },
  RUN_ERROR: { background: HEX_CODES.lightRed },
  VALIDATION_ERROR: { background: HEX_CODES.lightRed },
  INVALID: { background: HEX_CODES.lightRed },
  VALID: { background: HEX_CODES.lightGreen },
  VALIDATING: { background: HEX_CODES.lightBlue },
  VALIDATED: { background: HEX_CODES.lightGreen },
  TO_START: { background: HEX_CODES.grey },
  PAUSED: { background: HEX_CODES.yellow },
  undefined: { background: HEX_CODES.grey }
}

export const mockedTopology = {
  topologyId: 'test2',
  topologyStatus: 'FINISHED',
  topologyItems: [
    {
      createTimestamp: '12-07-2020 12:29:59',
      createdBy: 'From UI',
      dependsOn: 'root',
      pipelineTitle: 'Still_deciding_0',
      endTime: '',
      errorCount: 0,
      pipelineId: 'Pipeline2153e399f-ef15-4f39-8a26-351617c09bf4',
      startTime: '',
      threshold: 1,
      triggeredBy: '',
      updateTimestamp: '',
      updatedBy: '',
      waitTime: 1,
      processAfter: 'stop',
      pipelineStatus: 'FINISHED'
    },
    {
      createTimestamp: '12-07-2020 12:29:59',
      createdBy: 'From UI',
      dependsOn: 'Pipeline2153e399f-ef15-4f39-8a26-351617c09bf4',
      endTime: '',
      errorCount: 2,
      pipelineId: 'Pipeline3a6761a94-08de-495f-8870-8221af870fbc',
      pipelineTitle: 'Still_deciding_1',
      startTime: '',
      threshold: 2,
      triggeredBy: '',
      updateTimestamp: '',
      updatedBy: '',
      waitTime: 2,
      processAfter: 'start',
      pipelineStatus: 'RUNNING'
    },
    {
      createTimestamp: '12-07-2020 12:29:59',
      createdBy: 'From UI',
      dependsOn: 'Pipeline3a6761a94-08de-495f-8870-8221af870fbc',
      pipelineTitle: 'Still_deciding_2',
      endTime: '',
      errorCount: 0,
      pipelineId: 'givenf820b18b-effa-4907-8fe6-569477041d14',
      startTime: '',
      threshold: 3,
      triggeredBy: '',
      updateTimestamp: '',
      updatedBy: '',
      waitTime: 3,
      pipelineStatus: 'VALID'
    }
  ]
}

export const mockedPipelines = [{
  pipelineId: 'givenf820b18b-effa-4907-8fe6-569477041d14',
  title: 'Demo given pipeline',
  description: 'This is a demo pipeline.',
  created: 1594131949158,
  lastModified: 1594132731019,
  creator: 'admin',
  lastModifier: 'admin',
  lastRev: '0',
  uuid: '17eaec6d-415f-4371-95c9-7c811f9e7c08',
  valid: true,
  metadata: {
    labels: []
  },
  name: 'givenf820b18b-effa-4907-8fe6-569477041d14',
  sdcVersion: '3.16.1',
  sdcId: 'ce64a628-c03a-11ea-a1ee-7101ba3522df'
}, {
  pipelineId: 'Pipeline3a6761a94-08de-495f-8870-8221af870fbc',
  title: 'Pipeline 1',
  description: 'This is the first pipeline which reads from API and dumps in JSON file',
  created: 1594122021469,
  lastModified: 1594126769974,
  creator: 'admin',
  lastModifier: 'admin',
  lastRev: '0',
  uuid: '5baef38a-2207-4208-bb03-731e45e9fd2f',
  valid: true,
  metadata: {
    labels: []
  },
  name: 'Pipeline3a6761a94-08de-495f-8870-8221af870fbc',
  sdcVersion: '3.16.1',
  sdcId: 'ce64a628-c03a-11ea-a1ee-7101ba3522df'
}, {
  pipelineId: 'Pipeline2153e399f-ef15-4f39-8a26-351617c09bf4',
  title: 'Pipeline 3',
  description: 'reads from a file and dumps in csv',
  created: 1594128056693,
  lastModified: 1594131920517,
  creator: 'admin',
  lastModifier: 'admin',
  lastRev: '0',
  uuid: 'dc88b39e-c9dd-40d3-a5b8-2991e095717b',
  valid: true,
  metadata: {
    labels: []
  },
  name: 'Pipeline2153e399f-ef15-4f39-8a26-351617c09bf4',
  sdcVersion: '3.16.1',
  sdcId: 'ce64a628-c03a-11ea-a1ee-7101ba3522df'
}]

export const mockedTopologies = [{
  topologyId: '001',
  topologyStatus: 'TO_START',
  topologyItems: []
},
{
  topologyId: '002',
  topologyStatus: 'TO_START',
  topologyItems: []
},
{
  topologyId: '003',
  topologyStatus: 'TO_START',
  topologyItems: []
}]

export const mockedTopologyHistory = [{
  historyId: 'Shweta_history_1',
  topologyHistoryItems: [{ createTimestamp: 1595665546921, createdBy: 'From UI', dependsOn: 'PipelineSh8ae839dc-a037-4162-8e0f-f0bac0f8de17', endTime: 1595687496067, errorCount: 0, pipelineId: 'PipelineSh0e39bb14-0fd7-4ff7-994c-5dcf6fb5ffb6', pipelineStatus: 'VALID', pipelineTitle: 'PipelineShweta3', processAfter: 'stop', startTime: 1595687489996, threshold: 0, topologyStatus: '', triggeredBy: 'admin', updateTimestamp: 1595687508331, updatedBy: 'VALIDATE_ACTOR', waitTime: 0 }, { createTimestamp: 1595665546921, createdBy: 'From UI', dependsOn: 'PipelineShd30052ef-3a88-4c3d-81ec-20ef2b36d1ac', endTime: 1595687489887, errorCount: 0, pipelineId: 'PipelineSh8ae839dc-a037-4162-8e0f-f0bac0f8de17', pipelineStatus: 'VALID', pipelineTitle: 'PipelineShweta2', processAfter: 'stop', startTime: 1595687483806, threshold: 0, topologyStatus: '', triggeredBy: 'admin', updateTimestamp: 1595687508332, updatedBy: 'VALIDATE_ACTOR', waitTime: 0 }, { createTimestamp: 1595665546921, createdBy: 'From UI', dependsOn: 'root', endTime: 1595687483522, errorCount: 0, pipelineId: 'PipelineShd30052ef-3a88-4c3d-81ec-20ef2b36d1ac', pipelineStatus: 'VALID', pipelineTitle: 'PipelineShweta1', processAfter: 'stop', startTime: 1595687477370, threshold: 0, topologyStatus: '', triggeredBy: 'admin', updateTimestamp: 1595687508332, updatedBy: 'VALIDATE_ACTOR', waitTime: 0 }],
  topologyStatus: 'VALIDATED',
  topologyStartTime: 1594210800000,
  topologyEndTime: 1594211100000
},
{
  historyId: 'Shweta_history_2',
  topologyHistoryItems: [{ createTimestamp: 1595665546921, createdBy: 'From UI', dependsOn: 'PipelineSh8ae839dc-a037-4162-8e0f-f0bac0f8de17', endTime: 1595687496067, errorCount: 0, pipelineId: 'PipelineSh0e39bb14-0fd7-4ff7-994c-5dcf6fb5ffb6', pipelineStatus: 'VALID', pipelineTitle: 'PipelineShweta3', processAfter: 'stop', startTime: 1595687489996, threshold: 0, topologyStatus: '', triggeredBy: 'admin', updateTimestamp: 1595687508331, updatedBy: 'VALIDATE_ACTOR', waitTime: 0 }, { createTimestamp: 1595665546921, createdBy: 'From UI', dependsOn: 'PipelineShd30052ef-3a88-4c3d-81ec-20ef2b36d1ac', endTime: 1595687489887, errorCount: 0, pipelineId: 'PipelineSh8ae839dc-a037-4162-8e0f-f0bac0f8de17', pipelineStatus: 'VALID', pipelineTitle: 'PipelineShweta2', processAfter: 'stop', startTime: 1595687483806, threshold: 0, topologyStatus: '', triggeredBy: 'admin', updateTimestamp: 1595687508332, updatedBy: 'VALIDATE_ACTOR', waitTime: 0 }, { createTimestamp: 1595665546921, createdBy: 'From UI', dependsOn: 'root', endTime: 1595687483522, errorCount: 0, pipelineId: 'PipelineShd30052ef-3a88-4c3d-81ec-20ef2b36d1ac', pipelineStatus: 'VALID', pipelineTitle: 'PipelineShweta1', processAfter: 'stop', startTime: 1595687477370, threshold: 0, topologyStatus: '', triggeredBy: 'admin', updateTimestamp: 1595687508332, updatedBy: 'VALIDATE_ACTOR', waitTime: 0 }],
  topologyStatus: 'VALIDATED',
  topologyStartTime: 1594556700000,
  topologyEndTime: 1594557900000
}]

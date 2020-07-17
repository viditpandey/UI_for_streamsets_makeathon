export const BASE_URL = 'http://localhost:8081'

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
  blueVariant1: '#509ade'

}

export const getStyleByPipelineStatus = {
  STARTING: { background: HEX_CODES.lightBlue },
  RETRY: { background: HEX_CODES.lightRed },
  RUNNING: { background: HEX_CODES.lightGreen },
  FINISHED: { background: HEX_CODES.greenVariant1 }, // slightly darker than light green
  EDITED: { background: HEX_CODES.grey },
  STOPPED: { background: HEX_CODES.lightRed },
  ERROR: { background: HEX_CODES.lightRed },
  RUN_ERROR: { background: HEX_CODES.lightRed },
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
  topologyStatus: 'RUNNING',
  topologyItems: [
    {
      createTimestamp: '12-07-2020 12:29:59',
      createdBy: 'From UI',
      dependsOn: 'root',
      endTime: '',
      errorCount: 0,
      pipelineId: 'Pipeline2153e399f-ef15-4f39-8a26-351617c09bf4',
      startTime: '',
      threshold: 1,
      triggeredBy: '',
      updateTimestamp: '',
      updatedBy: '',
      waitTime: 1,
      dependencyCriteria: 'stop'
    },
    {
      createTimestamp: '12-07-2020 12:29:59',
      createdBy: 'From UI',
      dependsOn: 'Pipeline2153e399f-ef15-4f39-8a26-351617c09bf4',
      endTime: '',
      errorCount: 0,
      pipelineId: 'Pipeline3a6761a94-08de-495f-8870-8221af870fbc',
      startTime: '',
      threshold: 2,
      triggeredBy: '',
      updateTimestamp: '',
      updatedBy: '',
      waitTime: 2,
      dependencyCriteria: 'start'
    },
    {
      createTimestamp: '12-07-2020 12:29:59',
      createdBy: 'From UI',
      dependsOn: 'Pipeline3a6761a94-08de-495f-8870-8221af870fbc',
      endTime: '',
      errorCount: 0,
      pipelineId: 'givenf820b18b-effa-4907-8fe6-569477041d14',
      startTime: '',
      threshold: 3,
      triggeredBy: '',
      updateTimestamp: '',
      updatedBy: '',
      waitTime: 3
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

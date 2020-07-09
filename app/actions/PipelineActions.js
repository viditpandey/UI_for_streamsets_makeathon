export function getPipelines () {
  return new Promise(function (resolve, reject) {
    resolve([{
      pipelineId: 'Demo618e87ac-06d5-45b5-aeee-f63c42b4a76b',
      title: 'Demo',
      description: '',
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
      name: 'Demo618e87ac-06d5-45b5-aeee-f63c42b4a76b',
      sdcVersion: '3.16.1',
      sdcId: 'ce64a628-c03a-11ea-a1ee-7101ba3522df'
    }, {
      pipelineId: 'Pipeline13510382c-e61d-4fc2-9c89-871eeef82d2a',
      title: 'Pipeline 1',
      description: '',
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
      name: 'Pipeline13510382c-e61d-4fc2-9c89-871eeef82d2a',
      sdcVersion: '3.16.1',
      sdcId: 'ce64a628-c03a-11ea-a1ee-7101ba3522df'
    }, {
      pipelineId: 'Pipeline33a295e3e-a010-4804-b4ff-f11b1c7be433',
      title: 'Pipeline 3',
      description: '',
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
      name: 'Pipeline33a295e3e-a010-4804-b4ff-f11b1c7be433',
      sdcVersion: '3.16.1',
      sdcId: 'ce64a628-c03a-11ea-a1ee-7101ba3522df'
    }]
    )
  })
}

export function listToTree (list) {
  try {
    var map = {}; var node; var roots = []; var i

    for (i = 0; i < list.length; i += 1) {
      map[list[i].pipelineId] = i // initialize the map
      list[i].children = [] // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i]
      if (node.dependsOn !== 'root') {
      // if you have dangling branches check that map[node.parentId] exists
        list[map[node.dependsOn]].children.push(node)
      } else {
        roots.push(node)
      }
    }
    return roots
  } catch (error) {
    return []
  }
}

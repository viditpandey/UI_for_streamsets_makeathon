// export function walk ({
//   treeData,
//   getNodeKey,
//   callback,
//   ignoreCollapsed = true
// }) {
//   if (!treeData || treeData.length < 1) {
//     return
//   }

//   walkDescendants({
//     callback,
//     getNodeKey,
//     ignoreCollapsed,
//     isPseudoRoot: true,
//     node: { children: treeData },
//     currentIndex: -1,
//     path: [],
//     lowerSiblingCounts: []
//   })
// }

// function walkDescendants ({
//   callback,
//   getNodeKey,
//   ignoreCollapsed,
//   isPseudoRoot = false,
//   node,
//   parentNode = null,
//   currentIndex,
//   path = [],
//   lowerSiblingCounts = []
// }) {
//   // The pseudo-root is not considered in the path
//   const selfPath = isPseudoRoot
//     ? []
//     : [...path, getNodeKey({ node, treeIndex: currentIndex })]
//   const selfInfo = isPseudoRoot
//     ? null
//     : {
//       node,
//       parentNode,
//       path: selfPath,
//       lowerSiblingCounts,
//       treeIndex: currentIndex
//     }

//   if (!isPseudoRoot) {
//     const callbackResult = callback(selfInfo)

//     // Cut walk short if the callback returned false
//     if (callbackResult === false) {
//       return false
//     }
//   }

//   // Return self on nodes with no children or hidden children
//   if (
//     !node.children ||
//     (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)
//   ) {
//     return currentIndex
//   }

//   // Get all descendants
//   let childIndex = currentIndex
//   const childCount = node.children.length
//   if (typeof node.children !== 'function') {
//     for (let i = 0; i < childCount; i += 1) {
//       childIndex = walkDescendants({
//         callback,
//         getNodeKey,
//         ignoreCollapsed,
//         node: node.children[i],
//         parentNode: isPseudoRoot ? null : node,
//         currentIndex: childIndex + 1,
//         lowerSiblingCounts: [...lowerSiblingCounts, childCount - i - 1],
//         path: selfPath
//       })

//       // Cut walk short if the callback returned false
//       if (childIndex === false) {
//         return false
//       }
//     }
//   }

//   return childIndex
// }

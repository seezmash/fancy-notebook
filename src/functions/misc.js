const getDocsFromSnapshot = (snapshot) => {
  let newDocs = []
  snapshot.docs.forEach((doc) => {
    newDocs.push({ ...doc.data(), id: doc.id })
  })
  return newDocs
}

export { getDocsFromSnapshot }

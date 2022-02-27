const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  await import('../socket.io/socket.io.js')
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues/create" message from the server.
  socket.on('issues/create', (issue) => insertTaskRow(issue))
}

/**
 * Inserts a issue row at the end of the issue table.
 *
 * @param {object} issue - The issue to add.
 */
function insertTaskRow (issue) {
  const issueList = document.querySelector('#issue-list')

  // Only add an issue if it's not already in the list.
  if (!issueList.querySelector(`[data-id="${issue.id}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    // const doneCheck = issueNode.querySelector('input[type=checkbox]') // REMOVE???
    const descriptionCell = issueNode.querySelector('td:nth-child(2)')
    const [updateLink, deleteLink] = issueNode.querySelectorAll('a')

    issueRow.setAttribute('data-id', issue.id)

    // if (issue.done) {
    //   doneCheck.setAttribute('checked', '')
    //   descriptionCell.classList.add('text-muted')
    // } else {
    //   doneCheck.removeAttribute('checked')
    //   descriptionCell.classList.remove('text-muted') REMOVE???
    // }

    descriptionCell.textContent = issue.description

    updateLink.href = `./issues/${issue.id}/update`
    deleteLink.href = `./issues/${issue.id}/delete`

    issueList.appendChild(issueNode)
  }
}

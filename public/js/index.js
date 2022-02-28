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
    const avatarCell = issueNode.querySelector('#issue-avatar')
    const titleCell = issueNode.querySelector('#issue-title')
    const descriptionCell = issueNode.querySelector('#issue-description')
    const [commentLink, closeLink, updateLink, deleteLink] = issueNode.querySelectorAll('a')

    issueRow.setAttribute('data-id', issue.id)

    avatarCell.setAttribute('src', issue.avatar)
    titleCell.textContent = issue.title
    descriptionCell.textContent = issue.description

    commentLink.href = // FIX THIS
    closeLink.href = // FIX THIS
    updateLink.href = `./issues/${issue.id}/update`
    deleteLink.href = `./issues/${issue.id}/delete`

    issueList.appendChild(issueNode)
  }
}

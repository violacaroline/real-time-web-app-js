const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  await import('../socket.io/socket.io.js')
  // Create a socket connection using Socket.IO.
  const socket = window.io()

  // Listen for "issues/create" message from the server.
  socket.on('issues/create', (issue) => insertIssueRow(issue)) // WHY CAN I NOT REACH UPDATE ISSUE HERE?
}

/**
 * Inserts a issue row at the end of the issue table.
 *
 * @param {object} issue - The issue to add.
 */
function insertIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  document.querySelector('#no-issues')?.remove()
  console.log('THE ISSUE STATE from public js', issue)

  // Only add an issue if it's not already in the list.
  if (!issueList.querySelector(`[data-id="${issue.issueId}"]`)) { // LOGIC IS OFF
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    const avatarCell = issueNode.querySelector('#issue-avatar')
    const titleCell = issueNode.querySelector('#issue-title')
    const descriptionCell = issueNode.querySelector('#issue-description')
    const [reopenLink, closeLink] = issueNode.querySelectorAll('a')

    issueRow.setAttribute('data-id', issue.issueId)

    avatarCell.setAttribute('src', issue.avatar)
    titleCell.textContent = issue.title
    descriptionCell.textContent = issue.description

    reopenLink.href = `./issues/${issue.iid}/reopen`
    closeLink.href = `./issues/${issue.iid}/close`

    issueList.appendChild(issueNode)
  } else if (issueList.querySelector(`[data-id="${issue.issueId}"]`)) {
    updateIssue(issue)
  } else if (issue.closed) {
    closeIssue(issue)
  }

  /**
   * Updates a specific issuerow.
   *
   * @param {object} issue - The issue to update.
   */
  function updateIssue (issue) {
    const issueNode = document.querySelector(`[data-id="${issue.issueId}"]`)

    const titleCell = issueNode.querySelector('#issue-title')
    const descriptionCell = issueNode.querySelector('#issue-description')

    titleCell.textContent = issue.title
    descriptionCell.textContent = issue.description
  }

  /**
   * Removes a specific issuerow due to a closing event.
   *
   * @param {object} issue - The issue to remove.
   */
  function closeIssue (issue) {
    // console.log('Issue id from close function', issue.issueId)
    const issueList = document.querySelector('#issue-list')
    issueList.querySelector(`[data-id="${issue.issueId}"]`).remove()
  }
}

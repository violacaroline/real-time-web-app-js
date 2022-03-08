import '../socket.io/socket.io.js'
const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issue messages.
if (issueTemplate) {
  // Create a socket connection using Socket.IO.
  const baseURL = document.querySelector('base').getAttribute('href')
  const socket = window.io({ path: `${baseURL}socket.io` })

  // Listen for "issues/create" message from the server.
  socket.on('issues/create', (issue) => insertIssueRow(issue))
}

/**
 * Inserts a issue row at the end of the issue table.
 *
 * @param {object} issue - The issue to add.
 */
function insertIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  document.querySelector('#no-issues')?.remove()

  // Only add an issue if it's not already in the list.
  if (!issueList.querySelector(`[data-id="${issue.issueId}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    const avatarCell = issueNode.querySelector('#issue-avatar')
    const titleCell = issueNode.querySelector('#issue-title')
    const descriptionCell = issueNode.querySelector('#issue-description')
    const [reopenLink, closeLink] = issueNode.querySelectorAll('a')

    if (issue.state === 'opened') {
      reopenLink.classList.add('hidden')
      closeLink.classList.remove('hidden')
    }

    issueRow.setAttribute('data-id', issue.issueId)

    avatarCell.setAttribute('src', issue.avatar)
    titleCell.textContent = issue.title
    descriptionCell.textContent = issue.description

    reopenLink.href = `./issues/${issue.iid}/reopen`
    closeLink.href = `./issues/${issue.iid}/close`

    issueList.appendChild(issueNode)
  } else if (issueList.querySelector(`[data-id="${issue.issueId}"]`) && issue.state === 'opened') {
    updateIssue(issue)
  } else if (issue.state === 'closed') {
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
   * Change reopen/close link for if issue is closed or not.
   *
   * @param {object} issue - The issue to remove.
   */
  function closeIssue (issue) {
    const issueList = document.querySelector('#issue-list')
    const issueNode = issueList.querySelector(`[data-id="${issue.issueId}"]`)
    const [reopenLink, closeLink] = issueNode.querySelectorAll('a')

    reopenLink.classList.remove('hidden')
    closeLink.classList.add('hidden')
  }
}

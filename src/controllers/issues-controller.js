/**
 * Module for the IssuesController.
 */

// import { Issue } from '../models/issue.js'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Displays a list of issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const response = await fetch(process.env.GITLAB_PROJECT_URL, {
        method: 'get',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${process.env.GITLAB_ACCESS_TOKEN}`
        }
      })

      const result = await response.json()

      // Only display open issues.
      const viewData = []
      result.forEach(issue => {
        issue = {
          avatar: issue.author.avatar_url,
          issueId: issue.id,
          iid: issue.iid,
          state: issue.state,
          title: issue.title,
          description: issue.description
        }
        viewData.push(issue)
      })

      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Closes an issue on gitlab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async close (req, res, next) {
    try {
      const postUrl = `https://gitlab.lnu.se/api/v4/projects/21393/issues/${req.params.id}?state_event=close`
      await fetch(postUrl, {
        method: 'put',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${process.env.GITLAB_ACCESS_TOKEN}`
        }
      })

      req.session.flash = { type: 'success', text: 'The issue was closed!' }
      res.redirect('../')
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Closes an issue on gitlab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async reopen (req, res, next) {
    try {
      const postUrl = `https://gitlab.lnu.se/api/v4/projects/21393/issues/${req.params.id}?state_event=reopen`
      await fetch(postUrl, {
        method: 'put',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${process.env.GITLAB_ACCESS_TOKEN}`
        }
      })

      req.session.flash = { type: 'success', text: 'The issue was reopened!' }
      res.redirect('../')
      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }
}

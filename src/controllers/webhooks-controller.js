/**
 * Module for the WebhooksController.
 */

import { Issue } from '../models/issue.js'
import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    // Use the GitLab secret token to validate the received payload.
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }

    next()
  }

  /**
   * Receives a webhook, and creates a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      const response = await fetch(process.env.GITLAB_PROJECT_URL, {
        method: 'get',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${process.env.GITLAB_ACCESS_TOKEN}`
        }
      })

      const data = await response.json()
      console.log('Response from webhook controller: ', data)
      // Only interested in issues events. (But still, respond with a 200
      // for events not supported.)
      let issue = null
      if (req.body.event_type === 'issue') {
        issue = new Issue({
          avatar: req.body.user.avatar_url,
          title: req.body.object_attributes.title,
          description: req.body.object_attributes.description
        })

        await issue.save()
      }

      // It is important to respond quickly!
      res.status(200).end()

      // Put this last because socket communication can take long time.
      if (issue) {
        res.io.emit('issues/create', issue.toObject())
      }
    } catch (error) {
      console.log(error)
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}

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
      if (req.body.object_attributes.action === 'open') {
        console.log('This is an open post!')
        // Only interested in issues events. (But still, respond with a 200
        // for events not supported.)
        let issue = null
        if (req.body.event_type === 'issue') {
          issue = new Issue({
            avatar: req.body.user.avatar_url,
            issueId: req.body.object_attributes.id,
            iid: req.body.object_attributes.iid,
            title: req.body.object_attributes.title,
            description: req.body.object_attributes.description
          })
        }

        // It is important to respond quickly!
        res.status(200).end()

        // Put this last because socket communication can take long time.
        if (issue) {
          res.io.emit('issues/create', issue.toObject())
        }
      } else if (req.body.object_attributes.action === 'update') {
        console.log('This is an update post!')
        // Only interested in issues events. (But still, respond with a 200
        // for events not supported.)
        let issue = null
        if (req.body.event_type === 'issue') {
          const response = await fetch(`${process.env.GITLAB_PROJECT_URL}${req.body.object_attributes.iid}`, {
            method: 'get',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${process.env.GITLAB_ACCESS_TOKEN}`
            }
          })
          const data = await response.json()

          issue = {
            avatar: data.author.avatar_url,
            issueId: data.id,
            iid: data.iid,
            title: data.title,
            description: data.description
          }
        }

        // It is important to respond quickly!
        res.status(200).end()

        // Put this last because socket communication can take long time.
        if (issue) {
          res.io.emit('issues/create', issue)
        }
      } else if (req.body.object_attributes.action === 'close') {
        console.log('This is a close post!')

        const data = req.body.object_attributes
        const issue = {
          closed: data.closed_at,
          issueId: data.id
        }
        // It is important to respond quickly!
        res.status(200).end()

        // Put this last because socket communication can take long time.
        if (issue) {
          res.io.emit('issues/create', issue)
        }
      }
    } catch (error) {
      console.log(error)
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}

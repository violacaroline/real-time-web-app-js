/**
 * Webhooks routes.
 */

import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'

export const router = express.Router()

const webhooksController = new WebhooksController()

// Map HTTP verbs and route paths to controller actions.
router.post('/',
  webhooksController.authenticate,
  webhooksController.indexPost
)

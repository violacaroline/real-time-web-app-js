/**
 * Issues routes.
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/:id/close', (req, res, next) => controller.close(req, res, next))

router.get('/:id/reopen', (req, res, next) => controller.reopen(req, res, next))

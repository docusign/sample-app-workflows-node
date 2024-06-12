const { Router } = require('express');
const workflowsController = require('../controllers/workflowsController');

const router = Router();

router.get('/', workflowsController.getWorkflowDefinitions);
router.get('/:id', workflowsController.getWorkflowDefinition);
router.post('/create', workflowsController.createWorkflow);
router.put('/:id/trigger', workflowsController.triggerWorkflow);
router.put('/:id/cancel', workflowsController.cancelWorkflow);

module.exports = router;

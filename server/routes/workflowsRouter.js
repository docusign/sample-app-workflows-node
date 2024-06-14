const { Router } = require('express');
const workflowsController = require('../controllers/workflowsController');

const router = Router();

router.get('/', workflowsController.getWorkflowDefinitions);
router.get('/:id', workflowsController.getWorkflowDefinition);
router.put('/:id/trigger', workflowsController.triggerWorkflow);
router.put('/:id/cancel', workflowsController.cancelWorkflow);
router.post('/create', workflowsController.createWorkflow);
router.get('/download/:templateName', workflowsController.downloadWorkflowTemplate);

module.exports = router;

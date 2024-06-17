const { Router } = require('express');
const workflowsController = require('../controllers/workflowsController');

const router = Router();

router.get('/:definitionId/instances', workflowsController.getWorkflowInstances);
router.get('/:definitionId/instances/:instanceId', workflowsController.getWorkflowInstance);
router.put('/:definitionId/instances/:instanceId/cancel', workflowsController.cancelWorkflow);

router.post('/create', workflowsController.createWorkflow);
router.put('/:definitionId/trigger', workflowsController.triggerWorkflow);
router.get('/download/:templateName', workflowsController.downloadWorkflowTemplate);

module.exports = router;

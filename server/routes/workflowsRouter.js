const { Router } = require('express');
const workflowsController = require('../controllers/workflowsController');

const router = Router();

router.get('/instances', workflowsController.getWorkflowInstances);
router.get('/instances/:instanceId', workflowsController.getWorkflowInstance);
router.put('/instances/:instanceId/trigger', workflowsController.triggerWorkflow);
router.put('/instances/:instanceId/cancel', workflowsController.cancelWorkflow);

router.post('/create', workflowsController.createWorkflow);
//router.get('/:definitionId', workflowsController.getWorkflowDefinition);
router.get('/download/:templateName', workflowsController.downloadWorkflowTemplate);

module.exports = router;

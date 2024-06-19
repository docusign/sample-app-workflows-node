const { Router } = require('express');
const workflowsController = require('../controllers/workflowsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/:definitionId/instances', authMiddleware, workflowsController.getWorkflowInstances);
router.get('/:definitionId/instances/:instanceId', authMiddleware, workflowsController.getWorkflowInstance);
router.put('/:definitionId/instances/:instanceId/cancel', authMiddleware, workflowsController.cancelWorkflow);

router.post('/create', authMiddleware, workflowsController.createWorkflow);
router.put('/:definitionId/trigger', authMiddleware, workflowsController.triggerWorkflow);
router.get('/download/:templateName', workflowsController.downloadWorkflowTemplate);

router.post('/publish', authMiddleware, workflowsController.publishWorkflow);
router.get('/definitions', authMiddleware, workflowsController.getWorkflowDefinitions);

module.exports = router;

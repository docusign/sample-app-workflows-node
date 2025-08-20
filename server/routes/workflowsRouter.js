const { Router } = require('express');
const workflowsController = require('../controllers/workflowsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.put('/:definitionId/trigger', authMiddleware, workflowsController.triggerWorkflow);
router.post('/:definitionId/pause', authMiddleware, workflowsController.pauseWorkflow);
router.post('/:definitionId/resume', authMiddleware, workflowsController.resumePausedWorkflow);
router.get('/:definitionId/instances', authMiddleware, workflowsController.getInstances);
router.post('/:definitionId/instances/:instanceId/cancel', authMiddleware, workflowsController.cancelWorkflow);
router.get('/definitions', authMiddleware, workflowsController.getWorkflowDefinitions);
router.get('/:definitionId/requirements', authMiddleware, workflowsController.getWorkflowTriggerRequirements);

module.exports = router;

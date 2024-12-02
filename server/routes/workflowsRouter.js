const { Router } = require('express');
const workflowsController = require('../controllers/workflowsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.put('/:definitionId/trigger', authMiddleware, workflowsController.triggerWorkflow);
router.get('/definitions', authMiddleware, workflowsController.getWorkflowDefinitions);
router.get('/:definitionId/requirements', authMiddleware, workflowsController.getWorkflowTriggerRequirements);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect, checkProjectAccess } = require('../middleware/auth');
const {
  createTask,
  updateTask,
  getProjectTasks,
  getTaskById,
  deleteTask,
  getTaskActivityLogs
} = require('../controllers/taskController');

router.use(protect);

router.route('/')
  .post(createTask);

router.route('/project/:projectId')
  .get(checkProjectAccess('member'), getProjectTasks);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

router.get('/:id/logs', getTaskActivityLogs);

module.exports = router;

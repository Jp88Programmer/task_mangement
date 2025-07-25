const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, priority, dueDate, project, assignedTo, labels } = req.body;

  const task = await Task.create({
    title,
    description,
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate,
    project,
    createdBy: req.user.id,
    assignedTo: assignedTo || [],
    labels: labels || []
  });

  await ActivityLog.create({
    action: 'task_created',
    task: task._id,
    project: task.project,
    user: req.user.id,
    changes: {
      field: 'all',
      oldValue: null,
      newValue: task
    }
  });

  res.status(201).json({
    success: true,
    data: task
  });
});

const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };
  
  let task = await Task.findById(id);
  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${id}`, 404));
  }

  const originalTask = { ...task._doc };
  
  const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo', 'labels', 'position'];
  const updatedFields = {};
  const changes = [];

  allowedUpdates.forEach(field => {
    if (updates[field] !== undefined && JSON.stringify(updates[field]) !== JSON.stringify(originalTask[field])) {
      updatedFields[field] = updates[field];
      changes.push({
        field,
        oldValue: originalTask[field],
        newValue: updates[field]
      });
    }
  });

  if (Object.keys(updatedFields).length === 0) {
    return res.status(200).json({
      success: true,
      data: task
    });
  }

  task = await Task.findByIdAndUpdate(id, updatedFields, {
    new: true,
    runValidators: true
  });

  const activityLogs = changes.map(change => ({
    action: 'task_updated',
    task: task._id,
    project: task.project,
    user: req.user.id,
    changes: change,
    metadata: {
      updatedAt: new Date()
    }
  }));

  await ActivityLog.insertMany(activityLogs);

  res.status(200).json({
    success: true,
    data: task
  });
});

const getProjectTasks = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const { status } = req.query;

  const query = { project: projectId };
  
  if (status) {
    query.status = status;
  }

  const tasks = await Task.find(query)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ position: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('project', 'name');

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  await ActivityLog.create({
    action: 'task_deleted',
    task: task._id,
    project: task.project,
    user: req.user.id,
    changes: {
      field: 'all',
      oldValue: task,
      newValue: null
    }
  });

  await task.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

const getTaskActivityLogs = asyncHandler(async (req, res, next) => {
  const logs = await ActivityLog.find({ task: req.params.id })
    .sort('-createdAt')
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs
  });
});

const batchUpdateTasks = asyncHandler(async (req, res, next) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return next(new ErrorResponse('No updates provided', 400));
  }

  const bulkOps = [];
  const activityLogs = [];
  const now = new Date();

  for (const update of updates) {
    const { id, ...fields } = update;
    
    bulkOps.push({
      updateOne: {
        filter: { _id: id },
        update: { $set: { ...fields, updatedAt: now } }
      }
    });

    Object.entries(fields).forEach(([field, newValue]) => {
      activityLogs.push({
        action: 'task_updated',
        task: id,
        user: req.user.id,
        changes: {
          field,
          newValue
        },
        metadata: {
          batchUpdate: true,
          updatedAt: now
        }
      });
    });
  }

  const result = await Task.bulkWrite(bulkOps);

  if (activityLogs.length > 0) {
    await ActivityLog.insertMany(activityLogs);
  }

  res.status(200).json({
    success: true,
    data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    }
  });
});

module.exports = {
  createTask,
  updateTask,
  getProjectTasks,
  getTaskById,
  deleteTask,
  getTaskActivityLogs,
  batchUpdateTasks
};

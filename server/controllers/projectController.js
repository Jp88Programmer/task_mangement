const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: [{
      user: req.user._id,
      role: 'admin'
    }]
  });

  res.status(201).json(project);
});

const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    'members.user': req.user._id
  })
  .populate('createdBy', 'name email')
  .populate('members.user', 'name email role');

  res.json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('members.user', 'name email role');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const isMember = project.members.some(
    member => member.user._id.toString() === req.user._id.toString()
  );

  if (!isMember && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.json(project);
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!member || (member.role !== 'admin' && req.user.role !== 'admin')) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  project.name = name || project.name;
  project.description = description || project.description;

  const updatedProject = await project.save();
  
  res.json(updatedProject);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const member = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!member || (member.role !== 'admin' && req.user.role !== 'admin')) {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  await project.remove();
  
  res.json({ message: 'Project removed' });
});

const addProjectMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const currentUserMember = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!currentUserMember || (currentUserMember.role !== 'admin' && req.user.role !== 'admin')) {
    res.status(403);
    throw new Error('Not authorized to add members');
  }

  const memberExists = project.members.some(
    m => m.user.toString() === userId
  );

  if (memberExists) {
    res.status(400);
    throw new Error('User is already a member of this project');
  }

  project.members.push({
    user: userId,
    role: role || 'member'
  });

  await project.save();
  
  res.status(201).json({ message: 'Member added to project' });
});

const removeProjectMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const currentUserMember = project.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (!currentUserMember || (currentUserMember.role !== 'admin' && req.user.role !== 'admin')) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  if (req.params.userId === req.user._id.toString()) {
    const adminMembers = project.members.filter(m => m.role === 'admin');
    if (adminMembers.length <= 1) {
      res.status(400);
      throw new Error('Project must have at least one admin');
    }
  }

  project.members = project.members.filter(
    member => member.user.toString() !== req.params.userId
  );

  await project.save();
  
  res.json({ message: 'Member removed from project' });
});

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
};

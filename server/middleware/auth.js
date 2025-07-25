const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

const checkProjectAccess = (requiredRole = 'member') => {
  return async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.projectId || req.body.projectId);
      
      if (!project) {
        res.status(404);
        throw new Error('Project not found');
      }
      
      const member = project.members.find(m => m.user.toString() === req.user._id.toString());
      
      if (!member) {
        res.status(403);
        throw new Error('Not authorized to access this project');
      }
      
      const roles = ['member', 'manager', 'admin'];
      if (roles.indexOf(member.role) < roles.indexOf(requiredRole)) {
        res.status(403);
        throw new Error(`Insufficient permissions for this action`);
      }
      
      req.project = project;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { protect, authorize, checkProjectAccess };

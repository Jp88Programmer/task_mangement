const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin'
};

// Sample project data
const sampleProject = {
  name: 'Sample Project',
  description: 'This is a sample project to get you started.'
};

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(adminUser.password, salt);
    
    const createdUser = await User.create(adminUser);
    
    // Create sample project with admin as the creator
    const project = await Project.create({
      ...sampleProject,
      createdBy: createdUser._id,
      members: [{
        user: createdUser._id,
        role: 'admin'
      }]
    });

    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany({});
    await Project.deleteMany({});
    
    console.log('Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

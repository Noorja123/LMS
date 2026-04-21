const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.log('Ensure your MongoDB server is running or MONGODB_URI is valid in .env', err);
    process.exit(1);
  });

const seed = async () => {
  try {
    // Clear out testing DB easily if needed
    console.log('Clearing existing users...');
    await User.deleteMany({}); 
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      { name: 'Admin Demo', email: 'admin@lms.com', password, role: 'admin', approved: true },
      { name: 'Teacher Demo', email: 'teacher@lms.com', password, role: 'teacher', approved: true },
      { name: 'Student Demo', email: 'student@lms.com', password, role: 'student', approved: true }
    ];

    await User.insertMany(users);
    console.log('✅ Dummy users successfully inserted:');
    console.log('-------------------------------------------');
    console.log('👑 Admin    | admin@lms.com   | password123');
    console.log('👨‍🏫 Teacher  | teacher@lms.com | password123');
    console.log('👨‍🎓 Student  | student@lms.com | password123');
    console.log('-------------------------------------------');
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

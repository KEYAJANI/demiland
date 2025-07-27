// Authentication Routes for DEMILAND Backend
import express from 'express';
import jwt from 'jsonwebtoken';
import database from '../services/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await database.authHelpers.getUserByEmail(email);
    if (existingUser.data) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const userData = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role: 'user'
    };

    const result = await database.authHelpers.createUser(userData);
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.data.id, 
        email: result.data.email,
        role: result.data.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return user data (excluding password)
    const { password_hash, ...userWithoutPassword } = result.data;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Authenticate user
    const result = await database.authHelpers.authenticateUser(email, password);
    if (result.error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.data.id, 
        email: result.data.email,
        role: result.data.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Update last login
    await database.authHelpers.updateLastLogin(result.data.id);

    // Return user data (excluding password)
    const { password_hash, ...userWithoutPassword } = result.data;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await database.authHelpers.getUserById(req.user.userId);
    if (result.error) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user data (excluding password)
    const { password_hash, ...userWithoutPassword } = result.data;

    res.json({
      success: true,
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const updateData = {
      first_name: firstName,
      last_name: lastName,
      phone,
      address
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const result = await database.authHelpers.updateUser(req.user.userId, updateData);
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    // Return user data (excluding password)
    const { password_hash, ...userWithoutPassword } = result.data;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const result = await database.authHelpers.changePassword(
      req.user.userId, 
      currentPassword, 
      newPassword
    );

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error.message
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Verify token (for frontend token validation)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Admin only: Create new user
router.post('/admin/users', authenticateToken, requireRole(['admin', 'super-admin']), async (req, res) => {
  try {
    const { email, password, first_name, last_name, role = 'user', is_active = true } = req.body;

    console.log('🚀 Admin creating user:', { email, first_name, last_name, role, is_active });

    // Validation
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      });
    }

    // Validate role
    if (!['user', 'admin', 'super-admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Check if user already exists
    const existingUser = await database.authHelpers.getUserByEmail(email);
    if (existingUser.data) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user with admin-specified fields
    const userData = {
      email,
      password,
      first_name,
      last_name,
      role,
      is_active
    };

    const result = await database.authHelpers.createUser(userData);
    if (result.error) {
      console.error('❌ User creation failed:', result.error);
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    console.log('✅ User created successfully:', result.data.id);

    // Return user data (excluding password)
    const { password_hash, ...userWithoutPassword } = result.data;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Admin user creation error:', error);
    res.status(500).json({
      success: false,
      message: 'User creation failed',
      error: error.message
    });
  }
});

// Admin only: Update user
router.put('/users/:id', authenticateToken, requireRole(['admin', 'super-admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role, is_active, password } = req.body;

    console.log('🚀 Admin updating user:', id, { first_name, last_name, email, role, is_active });

    // Prepare update data
    const updateData = {
      first_name,
      last_name,
      email,
      role,
      is_active
    };

    // Handle password update if provided
    if (password && password.trim()) {
      updateData.password_hash = await database.authHelpers.hashPassword(password);
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const result = await database.authHelpers.updateUser(id, updateData);
    if (result.error) {
      console.error('❌ User update failed:', result.error);
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    console.log('✅ User updated successfully:', id);

    // Return updated user data (excluding password)
    const { password_hash, ...userWithoutPassword } = result.data;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Admin user update error:', error);
    res.status(500).json({
      success: false,
      message: 'User update failed',
      error: error.message
    });
  }
});

// Admin only: Delete user
router.delete('/users/:id', authenticateToken, requireRole(['admin', 'super-admin']), async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🚀 Admin deleting user:', id);

    // Don't allow deleting yourself
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Perform hard delete by completely removing user from database
    const result = await database.authHelpers.deleteUser(id);
    if (result.error) {
      console.error('❌ User deletion failed:', result.error);
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    console.log('✅ User deleted successfully:', id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Admin user deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'User deletion failed',
      error: error.message
    });
  }
});

// Admin only: Get all users
router.get('/users', authenticateToken, requireRole(['admin', 'super-admin']), async (req, res) => {
  try {
    const result = await database.authHelpers.getAllUsers();
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    // Remove password hashes from all users
    const usersWithoutPasswords = result.data.map(user => {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: usersWithoutPasswords
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

export default router;
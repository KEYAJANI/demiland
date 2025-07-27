// User Routes for DEMILAND Backend
import express from 'express';
import database from '../services/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await database.productHelpers.getAllCategories();
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    res.json({
      success: true,
      data: result.data || []
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// User favorites management
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const result = await database.favoriteHelpers.getUserFavorites(req.user.userId);
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    res.json({
      success: true,
      data: result.data || []
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
      error: error.message
    });
  }
});

router.post('/favorites/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await database.favoriteHelpers.addFavorite(req.user.userId, productId);
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    res.json({
      success: true,
      message: 'Product added to favorites'
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
      error: error.message
    });
  }
});

router.delete('/favorites/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await database.favoriteHelpers.removeFavorite(req.user.userId, productId);
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    res.json({
      success: true,
      message: 'Product removed from favorites'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
      error: error.message
    });
  }
});

// Admin endpoints
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await database.authHelpers.getAllUsers();
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    // Remove password hashes
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

router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'super-admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const result = await database.authHelpers.updateUser(id, { role });
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully'
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
});

export default router;
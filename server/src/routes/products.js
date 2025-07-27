// Product Routes for DEMILAND Backend
import express from 'express';
import database from '../services/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      featured, 
      limit, 
      offset,
      search,
      minPrice,
      maxPrice,
      brand,
      inStock
    } = req.query;

    // Build filters object
    const filters = {};
    if (category && category !== 'all') filters.category = category;
    if (featured !== undefined) filters.featured = featured === 'true';
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (brand && brand !== 'all') filters.brand = brand;
    if (inStock !== undefined) filters.inStock = inStock === 'true';

    let result;
    
    if (search) {
      // Search products
      result = await database.productHelpers.searchProducts(search, filters);
    } else {
      // Get all products with filters
      result = await database.productHelpers.getAllProducts({
        ...filters,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined
      });
    }

    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    res.json({
      success: true,
      data: result.data || [],
      count: result.data?.length || 0
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const { limit } = req.query;
    
    const result = await database.productHelpers.getFeaturedProducts(
      limit ? parseInt(limit) : undefined
    );

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
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit, offset } = req.query;

    const result = await database.productHelpers.getProductsByCategory(category, {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });

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
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.productHelpers.getProduct(id);
    if (result.error) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { 
      category, 
      minPrice, 
      maxPrice, 
      brand, 
      inStock, 
      limit, 
      offset 
    } = req.query;

    // Build filters
    const filters = {};
    if (category && category !== 'all') filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (brand && brand !== 'all') filters.brand = brand;
    if (inStock !== undefined) filters.inStock = inStock === 'true';
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const result = await database.productHelpers.searchProducts(query, filters);
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
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
});

// Create new product (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productData = req.body;

    // Validation
    if (!productData.name || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      });
    }

    const result = await database.productHelpers.createProduct(productData);
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await database.productHelpers.updateProduct(id, updateData);
    if (result.error) {
      return res.status(500).json({
        success: false,
        message: result.error.message
      });
    }

    if (!result.data) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Starting product deletion:', id);

    // First, get the product data to access the image URL
    const productResult = await database.productHelpers.getProduct(id);
    if (productResult.error) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = productResult.data;
    const imageUrl = product.image_url || product.image;

    // Delete from database first
    const deleteResult = await database.productHelpers.deleteProduct(id);
    if (deleteResult.error) {
      return res.status(500).json({
        success: false,
        message: deleteResult.error.message
      });
    }

    console.log('✅ Product deleted from database');

    // Delete image from ImageKit if it exists (non-blocking)
    if (imageUrl) {
      try {
        console.log('🖼️ Attempting to delete image from ImageKit:', imageUrl);
        
        // Import ImageKit service dynamically from frontend
        const imagekitService = await import('../../../src/services/imagekitService.js');
        const imageKit = imagekitService.default;
        
        const imageDeleteResult = await imageKit.deleteImageByUrl(imageUrl);
        
        if (imageDeleteResult.success) {
          console.log('✅ Image deleted from ImageKit successfully');
        } else {
          console.warn('⚠️ ImageKit deletion failed:', imageDeleteResult.message);
          // Continue anyway - don't fail the entire operation
        }
      } catch (imageError) {
        console.warn('⚠️ ImageKit deletion error (non-blocking):', imageError.message);
        // Continue anyway - don't fail the entire operation
      }
    } else {
      console.log('⏭️ No image to delete from ImageKit');
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

export default router;
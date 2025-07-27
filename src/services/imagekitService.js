/**
 * ImageKit.io Image Upload Service
 * 
 * This service handles image uploads to ImageKit.io for product images.
 * It provides secure image upload, transformation, and CDN delivery.
 */

class ImageKitService {
  constructor() {
    // ImageKit.io configuration from environment variables
    this.config = {
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_sAx86hCmEoACxWtk2kdVRi8zbOo=',
      privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY || 'private_sKeRmZDZuhrayUx/RTgHWIo8yyg=',
      urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/oriwj2eis',
      imagekitId: import.meta.env.VITE_IMAGEKIT_ID || 'oriwj2eis'
    };
    
    this.uploadEndpoint = 'https://upload.imagekit.io/api/v1/files/upload';
  }

  /**
   * Generate authentication parameters for ImageKit upload
   * Note: For security, this should be done server-side in production
   * This is a client-side implementation for development/testing
   */
  async generateAuthParams() {
    try {
      // Generate token and expiry
      const token = crypto.randomUUID ? crypto.randomUUID() : this.generateRandomString(32);
      const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
      
      // Generate signature using Web Crypto API
      const signature = await this.generateSignature(token, expire);
      
      return {
        token,
        expire,
        signature
      };
    } catch (error) {
      console.error('Error generating auth params:', error);
      // Fallback for older browsers
      return this.generateFallbackAuth();
    }
  }

  /**
   * Generate cryptographic signature for ImageKit authentication
   */
  async generateSignature(token, expire) {
    const message = token + expire;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.config.privateKey),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Fallback auth generation for older browsers
   */
  generateFallbackAuth() {
    const token = this.generateRandomString(32);
    const expire = Math.floor(Date.now() / 1000) + 2400;
    // Simple hash fallback (less secure)
    const signature = this.simpleHash(token + expire + this.config.privateKey);
    
    return { token, expire, signature };
  }

  /**
   * Generate random string for token
   */
  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Simple hash function for fallback
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Upload image to ImageKit.io
   * @param {File} file - The image file to upload
   * @param {Object} options - Upload options
   */
  async uploadImage(file, options = {}) {
    try {
      console.log('🖼️ Starting ImageKit upload:', file.name);
      
      // Generate authentication parameters
      console.log('🔐 Generating authentication parameters...');
      const authParams = await this.generateAuthParams();
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const fileName = `product_${timestamp}_${randomString}.${fileExtension}`;
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('publicKey', this.config.publicKey);
      
      // Add authentication parameters
      formData.append('token', authParams.token);
      formData.append('expire', authParams.expire.toString());
      formData.append('signature', authParams.signature);
      
      // Add optional parameters
      if (options.folder) {
        formData.append('folder', options.folder);
      } else {
        formData.append('folder', '/products'); // Default folder for products
      }
      
      // Add transformation options for product images (correct format)
      formData.append('transformation', JSON.stringify({
        pre: 'q-80', // Set quality to 80%
        post: [
          {
            type: 'transformation',
            value: 'w-800,h-600,c-maintain_ratio' // Resize for web
          }
        ]
      }));
      
      console.log('📤 Uploading to ImageKit with auth params...');
      
      // Upload to ImageKit
      const response = await fetch(this.uploadEndpoint, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          
          // Provide specific error messages for common issues
          if (response.status === 400) {
            if (errorMessage.includes('authorization')) {
              errorMessage = 'Authentication failed: Invalid signature or expired token. Please check your ImageKit credentials.';
            } else if (errorMessage.includes('file')) {
              errorMessage = 'File upload error: ' + errorMessage;
            }
          } else if (response.status === 401) {
            errorMessage = 'Unauthorized: Invalid ImageKit API keys or insufficient permissions.';
          } else if (response.status === 403) {
            errorMessage = 'Forbidden: Access denied. Check your ImageKit account permissions.';
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      console.log('✅ ImageKit upload successful:', result.url);
      
      return {
        success: true,
        data: {
          image_url: result.url,
          file_id: result.fileId,
          file_path: result.filePath,
          thumbnail_url: result.thumbnailUrl,
          width: result.width,
          height: result.height,
          size: result.size
        },
        message: 'Image uploaded successfully to ImageKit'
      };
      
    } catch (error) {
      console.error('❌ ImageKit upload failed:', error);
      
      // Categorize errors for better user feedback
      let userMessage = 'Failed to upload image to ImageKit';
      if (error.message.includes('fetch')) {
        userMessage = 'Network error: Could not connect to ImageKit. Please check your internet connection.';
      } else if (error.message.includes('Authentication') || error.message.includes('authorization')) {
        userMessage = 'ImageKit authentication failed. Please check your API credentials.';
      } else if (error.message.includes('Unauthorized')) {
        userMessage = 'ImageKit API key is invalid or expired. Please update your credentials.';
      } else if (error.message.includes('file')) {
        userMessage = 'File format or size not supported. Please try a different image.';
      }
      
      return {
        success: false,
        error: error.message,
        message: userMessage
      };
    }
  }

  /**
   * Delete image from ImageKit.io
   * @param {string} fileId - The ImageKit file ID to delete
   */
  async deleteImage(fileId) {
    try {
      const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa(this.config.privateKey + ':')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return {
        success: true,
        message: 'Image deleted successfully from ImageKit'
      };
      
    } catch (error) {
      console.error('❌ ImageKit delete failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete image from ImageKit'
      };
    }
  }

  /**
   * Extract file path from ImageKit URL
   * @param {string} imageUrl - The ImageKit image URL
   */
  extractFilePathFromUrl(imageUrl) {
    try {
      if (!imageUrl || !imageUrl.includes('imagekit.io')) {
        return null;
      }
      
      // Remove the base URL and transformation parameters
      const url = new URL(imageUrl);
      let filePath = url.pathname;
      
      // Remove transformation parameters (everything before /tr:)
      if (filePath.includes('/tr:')) {
        filePath = filePath.split('/tr:')[1];
        // Remove the transformation part and get the actual file path
        const parts = filePath.split('/');
        filePath = '/' + parts.slice(1).join('/');
      }
      
      // Handle direct URLs without transformations
      if (filePath.startsWith(`/${this.config.imagekitId}/`)) {
        filePath = filePath.replace(`/${this.config.imagekitId}`, '');
      }
      
      return filePath;
    } catch (error) {
      console.error('❌ Failed to extract file path from URL:', error);
      return null;
    }
  }

  /**
   * Find file ID by file path using ImageKit List Files API
   * @param {string} filePath - The file path to search for
   */
  async findFileIdByPath(filePath) {
    try {
      if (!filePath) {
        throw new Error('File path is required');
      }

      // Use ImageKit List Files API to find the file
      const response = await fetch(`https://api.imagekit.io/v1/files?path=${encodeURIComponent(filePath)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(this.config.privateKey + ':')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const files = await response.json();
      
      if (files.length === 0) {
        throw new Error('File not found in ImageKit');
      }

      // Return the first matching file's ID
      return files[0].fileId;
      
    } catch (error) {
      console.error('❌ Failed to find file ID by path:', error);
      throw error;
    }
  }

  /**
   * Delete image by URL (combines path extraction and file ID lookup)
   * @param {string} imageUrl - The ImageKit image URL to delete
   */
  async deleteImageByUrl(imageUrl) {
    try {
      console.log('🗑️ Starting ImageKit deletion for URL:', imageUrl);
      
      if (!imageUrl || !imageUrl.includes('imagekit.io')) {
        console.log('⏭️ Skipping deletion - not an ImageKit URL');
        return {
          success: true,
          message: 'No ImageKit image to delete'
        };
      }

      // Extract file path from URL
      const filePath = this.extractFilePathFromUrl(imageUrl);
      if (!filePath) {
        throw new Error('Could not extract file path from URL');
      }

      console.log('📂 Extracted file path:', filePath);

      // Find file ID by path
      const fileId = await this.findFileIdByPath(filePath);
      console.log('🆔 Found file ID:', fileId);

      // Delete the image
      const result = await this.deleteImage(fileId);
      
      if (result.success) {
        console.log('✅ ImageKit image deleted successfully');
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ ImageKit deletion by URL failed:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to delete image from ImageKit: ${error.message}`
      };
    }
  }

  /**
   * Get optimized image URL with transformations
   * @param {string} imagePath - The ImageKit image path
   * @param {Object} transformations - Transformation options
   */
  getOptimizedUrl(imagePath, transformations = {}) {
    const {
      width = 400,
      height = 300,
      quality = 80,
      format = 'auto'
    } = transformations;
    
    const transformationString = `tr=w-${width},h-${height},q-${quality},f-${format}`;
    return `${this.config.urlEndpoint}/${transformationString}${imagePath}`;
  }

  /**
   * Get different sizes for responsive images
   * @param {string} imagePath - The ImageKit image path
   */
  getResponsiveUrls(imagePath) {
    return {
      thumbnail: this.getOptimizedUrl(imagePath, { width: 150, height: 150 }),
      small: this.getOptimizedUrl(imagePath, { width: 300, height: 225 }),
      medium: this.getOptimizedUrl(imagePath, { width: 600, height: 450 }),
      large: this.getOptimizedUrl(imagePath, { width: 1200, height: 900 }),
      original: `${this.config.urlEndpoint}${imagePath}`
    };
  }
}

// Create and export singleton instance
const imagekitService = new ImageKitService();
export default imagekitService;
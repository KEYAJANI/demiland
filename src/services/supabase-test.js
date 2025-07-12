// Test script to verify Supabase connection and data
import { supabase, productHelpers } from './supabase.js';

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check if Supabase client is properly initialized
    console.log('✅ Supabase client initialized:', !!supabase);
    
    // Test 2: Try to get session (this will test connection)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('🔑 Session test:', { sessionData, sessionError });
    
    // Test 3: Test database connection by trying to query products table
    console.log('🗄️ Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    console.log('📊 Database test result:', { testData, testError });
    
    // Test 4: Test the productHelpers.getAllProducts function
    console.log('🛍️ Testing getAllProducts function...');
    const result = await productHelpers.getAllProducts();
    console.log('📦 getAllProducts result:', result);
    
    return { success: true, result };
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test the function
testSupabaseConnection().then(result => {
  console.log('🎯 Final test result:', result);
});

export { testSupabaseConnection };
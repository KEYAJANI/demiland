#!/usr/bin/env node

// Simple test to check if database is populated and connection is working
// Run this with: node test-database.js

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection...');
console.log('📋 Environment variables:', {
  url: supabaseUrl ? '✅ Present' : '❌ Missing',
  key: supabaseKey ? '✅ Present' : '❌ Missing'
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    console.log('\n🔍 Testing database connection...');
    
    // Test 1: Check if products table exists and has data
    console.log('📊 Checking products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Products table error:', productsError);
      console.error('💡 This might indicate:');
      console.error('   - Products table doesn\'t exist');
      console.error('   - Database permissions issue');
      console.error('   - Network connectivity issue');
      return;
    }
    
    console.log('✅ Products table query successful');
    console.log('📦 Products found:', products?.length || 0);
    
    if (products && products.length > 0) {
      console.log('🛍️ First product:', {
        id: products[0].id,
        name: products[0].name,
        category: products[0].category,
        is_active: products[0].is_active
      });
    } else {
      console.log('⚠️ No products found in database');
      console.log('💡 You may need to run the database migration to populate products');
    }
    
    // Test 2: Check categories table
    console.log('\n🏷️ Checking categories table...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError);
    } else {
      console.log('✅ Categories table query successful');
      console.log('📦 Categories found:', categories?.length || 0);
    }
    
    // Test 3: Check active products specifically
    console.log('\n🔍 Checking active products...');
    const { data: activeProducts, error: activeError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    if (activeError) {
      console.error('❌ Active products error:', activeError);
    } else {
      console.log('✅ Active products query successful');
      console.log('📦 Active products found:', activeProducts?.length || 0);
    }
    
    console.log('\n✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.error('💡 This might indicate:');
    console.error('   - Network connectivity issue');
    console.error('   - Invalid Supabase credentials');
    console.error('   - Supabase service is down');
  }
}

testDatabase();
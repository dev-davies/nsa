#!/usr/bin/env python
"""Test login and dashboard access"""

try:
    from app import app
    
    with app.test_client() as client:
        print("Testing admin login flow...\n")
        
        # Test 1: Get login page
        response = client.get('/admin/login')
        print(f"GET /admin/login: {response.status_code}")
        
        # Test 2: Try to access dashboard without login
        response = client.get('/admin/dashboard')
        print(f"GET /admin/dashboard (no login): {response.status_code} (should be redirect)")
        
        # Test 3: Login with valid credentials
        response = client.post('/admin/login', data={
            'username': 'admin',
            'password': 'admin123'  # Change this to the actual password if different
        }, follow_redirects=True)
        print(f"POST /admin/login: {response.status_code}")
        
        if response.status_code == 200:
            print("✓ Login and redirect successful!")
            if 'Admin Management' in response.get_data(as_text=True):
                print("✓ Dashboard loads and Admin Management section is visible")
            else:
                print("✗ Dashboard loads but Admin Management section not found")
        else:
            print(f"✗ Login failed with status {response.status_code}")
            
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()

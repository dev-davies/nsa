#!/usr/bin/env python
"""Test script to verify the app loads and the admin dashboard works"""

try:
    from app import app
    print("✓ App loaded successfully!")
    
    # Test the dashboard route
    with app.test_client() as client:
        print("✓ Test client created")
        
        # Try to access login
        response = client.get('/admin/login')
        if response.status_code == 200:
            print("✓ Admin login page loads (200 OK)")
        else:
            print(f"✗ Admin login returned {response.status_code}")
        
        # Test database query
        from app import get_db
        db = get_db()
        admins = db.execute('SELECT id, username, email, role, created_at FROM admins ORDER BY created_at DESC').fetchall()
        print(f"✓ Database query successful - Found {len(admins)} admins")
        for admin in admins:
            print(f"  - {admin[1]} ({admin[3]}): {admin[2]}")
            
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()

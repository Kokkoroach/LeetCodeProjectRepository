# tests/test_api.py
import pytest
from app import app, init_db
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    init_db()
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the health check endpoint"""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'

def test_get_service_status(client):
    """Test getting service status"""
    response = client.get('/api/service-status')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert 'data' in data
    assert len(data['data']) > 0

def test_get_stations(client):
    """Test getting stations"""
    response = client.get('/api/stations')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert 'data' in data

def test_create_user(client):
    """Test creating a new user"""
    response = client.post('/api/users', 
                          json={'firebase_uid': 'test_uid_123', 'email': 'test@example.com'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert 'user_id' in data

def test_create_duplicate_user(client):
    """Test creating a duplicate user"""
    client.post('/api/users', 
               json={'firebase_uid': 'test_uid_456', 'email': 'duplicate@example.com'})
    response = client.post('/api/users', 
                          json={'firebase_uid': 'test_uid_456', 'email': 'duplicate@example.com'})
    assert response.status_code == 409

def test_get_user(client):
    """Test getting user information"""
    # Create a user first
    client.post('/api/users', 
               json={'firebase_uid': 'test_uid_789', 'email': 'getuser@example.com'})
    
    response = client.get('/api/users/test_uid_789')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['user']['email'] == 'getuser@example.com'

def test_add_favorite(client):
    """Test adding a favorite route"""
    # Create a user first
    client.post('/api/users', 
               json={'firebase_uid': 'test_uid_fav', 'email': 'favorite@example.com'})
    
    response = client.post('/api/favorites',
                          json={'firebase_uid': 'test_uid_fav', 'route_id': '1', 'route_type': 'subway'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True

def test_get_favorites(client):
    """Test getting user favorites"""
    # Create a user and add a favorite
    client.post('/api/users', 
               json={'firebase_uid': 'test_uid_getfav', 'email': 'getfav@example.com'})
    client.post('/api/favorites',
               json={'firebase_uid': 'test_uid_getfav', 'route_id': 'A', 'route_type': 'subway'})
    
    response = client.get('/api/favorites?firebase_uid=test_uid_getfav')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert len(data['favorites']) > 0

def test_create_alert(client):
    """Test creating an alert"""
    # Create a user first
    client.post('/api/users', 
               json={'firebase_uid': 'test_uid_alert', 'email': 'alert@example.com'})
    
    response = client.post('/api/alerts',
                          json={'firebase_uid': 'test_uid_alert', 'route_id': '1', 'alert_type': 'delay'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True

def test_get_arrivals(client):
    """Test getting arrivals for a station"""
    response = client.get('/api/arrivals/1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert 'arrivals' in data
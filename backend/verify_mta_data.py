"""
MTA Data Verification Tool
Run this to verify that your app is pulling real MTA data
"""
from google.transit import gtfs_realtime_pb2
import requests
from datetime import datetime

print("=" * 70)
print("MTA REAL-TIME DATA VERIFICATION")
print(f"Timestamp: {datetime.now().isoformat()}")
print("=" * 70)

# Test 1: Check alerts feed
print("\n[TEST 1] Checking Service Alerts Feed")
print("-" * 70)
feed_url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts'
try:
    response = requests.get(feed_url, timeout=5)
    print(f"✓ Alerts feed accessible (Status: {response.status_code}, Size: {len(response.content)} bytes)")
    
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)
    
    alerts_by_route = {}
    for entity in feed.entity:
        if entity.HasField('alert'):
            alert = entity.alert
            for informed in alert.informed_entity:
                if informed.HasField('route_id'):
                    route_id = informed.route_id
                    header = alert.header_text.translation[0].text if alert.header_text.translation else ""
                    alerts_by_route[route_id] = header[:80]
    
    print(f"✓ Parsed {len(alerts_by_route)} routes with service alerts\n")
    
    # Show first 10 alerts
    print("Current Service Alerts (sample):")
    for i, (route_id, alert_msg) in enumerate(sorted(alerts_by_route.items())[:10]):
        print(f"  • Route {route_id}: {alert_msg}...")
    
    if len(alerts_by_route) > 10:
        print(f"  ... and {len(alerts_by_route) - 10} more")
        
except Exception as e:
    print(f"✗ Error: {e}")

# Test 2: Check GTFS-realtime trip updates
print("\n[TEST 2] Checking GTFS-realtime Trip Updates (ACE line)")
print("-" * 70)
feed_url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace'
try:
    response = requests.get(feed_url, timeout=5)
    print(f"✓ GTFS feed accessible (Status: {response.status_code}, Size: {len(response.content)} bytes)")
    
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)
    
    trip_updates = [e for e in feed.entity if e.HasField('trip_update')]
    print(f"✓ Received {len(trip_updates)} trip updates for ACE line\n")
    
    # Show a sample trip update
    if trip_updates:
        sample = trip_updates[0].trip_update
        print(f"Sample trip update:")
        print(f"  Route: {sample.trip.route_id}")
        print(f"  Trip ID: {sample.trip.trip_id}")
        print(f"  Stop updates: {len(sample.stop_time_update)}")
        if sample.stop_time_update:
            first_stop = sample.stop_time_update[0]
            print(f"  First stop: {first_stop.stop_id}")
            if first_stop.HasField('arrival'):
                arrival_time = first_stop.arrival.time
                current_time = int(datetime.now().timestamp())
                minutes = (arrival_time - current_time) // 60
                print(f"  Arrival in: {max(0, minutes)} minutes")
        
except Exception as e:
    print(f"✗ Error: {e}")

# Test 3: Verify your backend endpoint
print("\n[TEST 3] Checking Your Backend Endpoint")
print("-" * 70)
try:
    response = requests.get('http://localhost:5000/api/service-status', timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Backend service-status endpoint working")
        print(f"✓ Returned {len(data['data'])} lines")
        
        # Count by status
        status_count = {}
        for line in data['data']:
            status = line['status']
            status_count[status] = status_count.get(status, 0) + 1
        
        print(f"\nStatus breakdown:")
        for status, count in sorted(status_count.items()):
            print(f"  • {status}: {count} lines")
        
        # Show lines with issues
        issues = [l for l in data['data'] if l['status'] != 'good']
        if issues:
            print(f"\nLines with service issues:")
            for line in sorted(issues, key=lambda x: x['id']):
                print(f"  • {line['id']:3} ({line['name']:30}): {line['status']:15} - {line['message'][:50]}...")
        else:
            print("\n✗ WARNING: No service issues detected - this may be incorrect!")
            print("  Check that your backend is actually fetching from MTA feeds.")
        
        if 'updated_at' in data:
            print(f"\nLast updated: {data['updated_at']}")
            
    else:
        print(f"✗ Backend returned status code {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("✗ Cannot connect to backend at http://localhost:5000")
    print("  Make sure your Flask app is running!")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n" + "=" * 70)
print("VERIFICATION COMPLETE")
print("=" * 70)
print("\nTroubleshooting:")
print("• If Test 1 shows alerts but Test 3 doesn't, check your backend logs")
print("• If Test 3 shows 'good' status for all lines, the parsing may be failing")
print("• Check the terminal where your Flask app is running for error messages")
print("• You can compare results with https://new.mta.info/status")

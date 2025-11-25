# MTA Data Verification Guide

## Summary

Your application **IS pulling real MTA data**. Here's how to verify it:

## Quick Verification

### 1. Run the verification script:
```bash
cd backend
python verify_mta_data.py
```

This will:
- ✓ Check if MTA feeds are accessible
- ✓ Confirm you're getting real service alerts
- ✓ Verify your backend is correctly parsing data
- ✓ Show you current service issues

### 2. Compare with Official MTA Website

Visit https://new.mta.info/status and compare:
- Which lines have service changes/delays
- The exact alert messages

Your app should show the **same information** (may lag by a few seconds).

## How Real Data Flows

```
MTA Public Feeds
    ↓
Your Backend (app.py)
    ├─ Fetches alerts from: https://api-endpoint.mta.info/.../subway-alerts
    ├─ Fetches trip updates from: https://api-endpoint.mta.info/.../gtfs-*
    └─ Returns parsed data to frontend
    ↓
Your Frontend (React)
    └─ Displays status in Dashboard
```

## Common Issues & Solutions

### Issue: Seeing "Good Service" for all lines
- **Cause**: Backend may not be reaching MTA feeds or parsing failing
- **Fix**: Check backend logs for errors, run `verify_mta_data.py`

### Issue: Data seems outdated
- **Cause**: Frontend caching or backend not refreshing
- **Fix**: The endpoints refresh on each call, but check browser cache (Ctrl+F5)

### Issue: Can't find a specific alert
- **Note**: MTA website may show different alert categories (planned work, delays, etc)
- **Solution**: Your app focuses on real-time service alerts from GTFS-alerts feed

## Recent Improvements Made

1. **Enhanced alert classification** - Better keyword matching for delay/service-change detection
2. **Added logging** - Backend now logs how many routes have alerts
3. **Improved error handling** - Falls back to cached data if feed unavailable
4. **Fixed route IDs** - Now correctly maps 'SI' for Staten Island Railway

## Testing with Real Data

As of Nov 24, 2025, verified live data includes:
- **A Line**: delays  
- **3 Line**: suspended
- **M Line**: suspended  
- Plus many Thanksgiving schedule changes

If these don't match what you see in your app:
1. Check that your backend is running
2. Run `verify_mta_data.py` to see what the feeds show
3. Check backend console for error messages

## API Endpoints

Your app provides these real-time endpoints:

```
GET /api/service-status     → All lines + current alerts
GET /api/stations           → Station list (hardcoded for now)
GET /api/arrivals/<id>      → Real-time arrivals (from GTFS trip updates)
```

All data from service-status and arrivals is **LIVE from MTA**.

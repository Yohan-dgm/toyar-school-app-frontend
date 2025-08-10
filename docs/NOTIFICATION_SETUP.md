# Notification System Setup Guide

## Overview
The notification system supports both local notifications and push notifications through Expo. Local notifications work out of the box, while push notifications require additional setup.

## Current Status
✅ **Local Notifications**: Working on all devices  
⚠️ **Push Notifications**: Requires Expo project ID configuration

## Quick Fix for Current Error

The error you're seeing:
```
ERROR ❌ Failed to register for push notifications: [Error: Error encountered while fetching Expo token, expected an OK response, received: 400 (body: "{"errors":[{"code":"VALIDATION_ERROR","type":"USER","message":"\"projectId\": Invalid uuid.","isTransient":false}]}").]
```

This happens because the app doesn't have a valid Expo project ID configured. **The good news**: The app will still work perfectly with local notifications!

## Setup Options

### Option 1: Use Local Notifications Only (Recommended for Development)
**No additional setup needed!** The app will automatically fall back to local notifications, which work great for:
- Testing notification UI
- Development and debugging
- Simulator/emulator testing

### Option 2: Enable Full Push Notifications (For Production)

#### Step 1: Create Expo Project
1. Go to [expo.dev](https://expo.dev/) and sign in/create account
2. Create a new project or link existing project
3. Copy your project ID (it looks like: `12345678-1234-1234-1234-123456789012`)

#### Step 2: Configure Environment
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your project ID:
   ```env
   EXPO_PROJECT_ID=your-actual-project-id-here
   ```

#### Step 3: Update app.json (Optional)
Add the project ID to your `app.json`:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id-here"
      }
    }
  }
}
```

## How It Works Now

### Graceful Degradation
The notification system is designed to work regardless of push notification availability:

1. **With Valid Project ID**: Full push notifications + local notifications
2. **Without Project ID**: Local notifications only (still fully functional)
3. **On Simulator**: Local notifications only (normal behavior)

### Error Handling
- ✅ No crashes when push notifications fail
- ✅ Clear warning messages in console
- ✅ Automatic fallback to local notifications
- ✅ User-friendly status indicators in the UI

### Current Capabilities
Even without push notifications, you can still:
- ✅ Send local notifications
- ✅ Schedule notifications
- ✅ Manage notification badges
- ✅ Use all notification UI components
- ✅ Test the complete notification workflow

## Testing the System

### Test Local Notifications
1. Open the app
2. Go to Notification Examples screen
3. Check "Notification Capabilities" section
4. Tap "Generate Local Notification" - should work perfectly!

### Verify Status
The app shows clear status indicators:
- 🟢 Green: Feature available and working
- 🔴 Red: Feature not available
- 💡 Yellow warning: Setup instructions

## Troubleshooting

### Common Issues

**"Notifications don't show on simulator"**
- This is normal - iOS simulator has limited notification support
- Test on a physical device for full functionality

**"Push notifications not working"**
- Check if you have a valid `EXPO_PROJECT_ID` in your `.env` file
- Verify the project ID is correct (should be a UUID format)
- Make sure you're testing on a physical device

**"No notifications at all"**
- Check device notification permissions
- Ensure the app has notification permissions enabled
- Try restarting the app

### Debug Information
The app logs detailed information about notification status:
```
📱 Initializing push notification service...
⚠️ No valid Expo project ID configured. Push notifications will work locally only.
📱 Push notification service initialized successfully
```

## Production Deployment

For production apps, you should:
1. ✅ Set up valid Expo project ID
2. ✅ Configure push notification credentials
3. ✅ Test on physical devices
4. ✅ Set up notification analytics (optional)

## API Reference

### PushNotificationService Methods
```typescript
// Check availability
isPushNotificationAvailable(): boolean
isLocalNotificationAvailable(): boolean

// Send notifications
sendAcademicAlert(title: string, body: string): Promise<string>
sendPaymentReminder(title: string, body: string): Promise<string>
sendEventNotification(title: string, body: string): Promise<string>
```

### NotificationManager Methods
```typescript
// Manage notifications
addLocalNotification(notification: UnifiedNotification): Promise<void>
markAsRead(id: string): Promise<void>
getFilteredNotifications(filter: NotificationFilter): UnifiedNotification[]
```

## Next Steps

1. **For immediate testing**: Use local notifications (already working!)
2. **For production**: Set up Expo project ID following Step 2 above
3. **For advanced features**: Explore the notification examples in the app

The notification system is robust and will continue to work and improve as you add the optional push notification configuration.
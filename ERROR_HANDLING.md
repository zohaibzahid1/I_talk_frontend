# Error Handling System

This application includes a comprehensive error handling system that gracefully handles GraphQL errors, network issues, and authentication failures.

## Features

### 🔄 Automatic Error Handling
- **Authentication Errors**: Automatically redirects to login page and clears stored auth data
- **Network Errors**: Shows user-friendly offline messages
- **Server Errors**: Redirects to home page with appropriate notifications
- **Validation Errors**: Displays specific error messages to users

### 📱 User-Friendly Notifications
- **Toast Notifications**: Non-intrusive error, success, and warning messages
- **Auto-dismiss**: Notifications automatically disappear after a set duration
- **Responsive Design**: Works on all screen sizes

### 🛡️ Graceful Degradation
- **Offline Handling**: Detects network status and shows appropriate messages
- **Progressive Enhancement**: App continues to work even with partial failures
- **Error Recovery**: Automatic retry mechanisms for certain types of errors

## How It Works

### GraphQL Error Handling (`graphqlService.ts`)
```typescript
// Automatically handles:
- 401 Unauthorized → Redirect to login
- 500/503 Server errors → Redirect to home
- Network errors → Show offline message
- Validation errors → Show specific error message
```

### Notification System (`notificationService.ts`)
```typescript
// Usage examples:
notificationService.showError('Something went wrong');
notificationService.showSuccess('Operation completed');
notificationService.showWarning('Please check your input');
```

### Global Error Handler (`globalErrorHandler.ts`)
```typescript
// Initialize in your main app component:
globalErrorHandler.init();

// Manually handle critical errors:
globalErrorHandler.handleCriticalError(error, true);
```

## Setup

### 1. Initialize Global Error Handler
Add to your main layout or app component:

```typescript
import { globalErrorHandler } from '@/services/globalErrorHandler';

useEffect(() => {
  globalErrorHandler.init();
}, []);
```

### 2. Environment Variables
Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
```

## Error Flow

### Authentication Errors
1. GraphQL returns 401 or authentication error
2. Clear local storage (token, user data)
3. Show "Session expired" notification
4. Redirect to `/login` after 1.5 seconds

### Server Errors
1. GraphQL returns 500/503 or network error
2. Show "Server error" notification
3. Redirect to `/` (home) after 2 seconds
4. Middleware will handle authentication routing

### Network Errors
1. Detect offline status
2. Show "You are offline" warning
3. Don't redirect, allow user to retry when back online

### Validation Errors
1. Show specific error message from GraphQL
2. No redirection, allow user to fix input
3. Error stays until resolved

## API Error Handling

All API services now use centralized error handling:

- **authApi**: Authentication-related operations
- **chatApi**: Chat and messaging operations
- **graphqlService**: Core GraphQL communication

Errors are handled consistently across all services with appropriate user feedback and navigation.

## Customization

### Custom Error Messages
You can customize error messages in `graphqlService.ts`:

```typescript
private handleError(error: any, response?: Response): void {
  // Add custom logic here
}
```

### Custom Notification Styles
Modify notification styles in `notificationService.ts`:

```typescript
toast.style.cssText = `
  // Your custom styles here
`;
```

## Testing Error Scenarios

### Test Authentication Errors
1. Log in to the app
2. Manually delete cookies/tokens from browser
3. Try to perform any GraphQL operation
4. Should redirect to login with notification

### Test Network Errors
1. Disconnect from internet
2. Try to perform any operation
3. Should show offline warning

### Test Server Errors
1. Stop the backend server
2. Try to perform any operation
3. Should show server error and redirect to home

This error handling system ensures your users always have a smooth experience, even when things go wrong!

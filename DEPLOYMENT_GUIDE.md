# Deployment Instructions

## Environment Configuration

### Development & Production (using deployed server)
All environments now use the deployed server:
```
VITE_API_URL=https://xnova-5coe.onrender.com/api/
VITE_REACT_APP_API_URL=https://xnova-5coe.onrender.com/api/
VITE_REACT_APP_API_KEY=your_api_key
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_ANALYTICS=false
```

### Production (deployed server)
Use `.env.production` file:
```
VITE_API_URL=https://xnova-5coe.onrender.com/api/
VITE_REACT_APP_API_URL=https://xnova-5coe.onrender.com/api/
VITE_REACT_APP_API_KEY=your_api_key
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_ANALYTICS=true
```

## Build Commands

### For Development
```bash
npm run dev
```

### For Production Build
```bash
npm run build:prod
```

## Configuration Changes

- **No localhost API**: All environments now use the deployed server
- **Consistent API URL**: `https://xnova-5coe.onrender.com/api/`
- **Mock API**: Disabled by default for all environments
- **Analytics**: Enabled only in production

## Environment Files Priority
Vite loads environment files in this order:
1. `.env.production` (production mode)
2. `.env.local` (always loaded except in test)
3. `.env` (always loaded)

## Deployment Steps

1. Make sure your production environment variables are set correctly
2. Run production build: `npm run build:prod`
3. Deploy the `dist` folder to your hosting service
4. Configure your hosting service to serve the index.html for all routes (SPA mode)

## Troubleshooting

If you're still seeing issues:
1. Check browser console for API calls
2. Verify environment variables are loaded: `console.log(import.meta.env)`
3. Check network tab to see actual API endpoints being called
4. All API calls should now point to: `https://xnova-5coe.onrender.com/api/`

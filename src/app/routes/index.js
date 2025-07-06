import { lazy } from 'react';

// Lazy load pages for better performance
const Homepage = lazy(() => import('../pages/Homepage.jsx'));
const BookingPage = lazy(() => import('../pages/BookingPageV2.jsx'));
const FindTeammatePage = lazy(() => import('../pages/FindTeammatePage.jsx'));

export const routeConfig = [
  {
    path: '/',
    component: Homepage,
  },
  {
    path: '/booking',
    component: BookingPage,
  },
  {
    path: '/find-teammates',
    component: FindTeammatePage,
  },
];

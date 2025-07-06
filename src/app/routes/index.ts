import { lazy } from 'react';

// Lazy load pages for better performance
const Homepage = lazy(() => import('../pages/Homepage'));
const BookingPage = lazy(() => import('../pages/BookingPage'));
const FindTeammatePage = lazy(() => import('../pages/FindTeammatePage'));

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

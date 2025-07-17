import { lazy } from 'react';

// Lazy load pages for better performance
const Homepage = lazy(() => import('../pages/Home/Homepage.jsx'));
const BookingPage = lazy(() => import('../pages/Booking/BookingPageV2.jsx'));
const FindTeammatePage = lazy(() => import('../pages/FindTeammate/FindTeammatePage.jsx'));
const ProfileSettings = lazy(() => import('../pages/Profile/ProfileSettings.jsx'));
const TeamManagement = lazy(() => import('../pages/TeamManagement/TeamManagement.jsx'));

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
  {
    path: '/profile',
    component: ProfileSettings,
  },
  {
    path: '/team',
    component: TeamManagement,
  },
];

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute'
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/ErrorPage';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import AllTrainer from '../pages/AllTrainer/allTrainer';
import AllClasses from '../pages/AllClasses/allClasses';
import DashboardLayout from '../layouts/DashboardLayout'
import Community from '../pages/Community/Community';
import Profile from '../pages/DashboardPages/Member/Profile';
import BecomeTrainer from '../pages/BecomeTrainer/BecomeTrainer';
import TrainerDetails from '../pages/TrainerDetails/TrainerDetails';
import TrainerBooked from '../pages/TrainerBooked/TrainerBooked';
import AddNewClass from '../pages/DashboardPages/Admin/AddNewClass';
import NewsletterSubscribers from '../pages/DashboardPages/Admin/newsletterSubscribers';
import AppliedTrainer from '../pages/DashboardPages/Admin/appliedTrainer';
import AppliedTrainerDetails from '../pages/DashboardPages/Admin/AppliedTrainerDetails';
import AllApprovedTrainer from '../pages/DashboardPages/Admin/allApprovedTrainers';
import AddNewSlot from '../pages/DashboardPages/Trainer/addNewSlot';
import ForumPage from '../pages/DashboardPages/ForumPage/ForumPage';
import ActivityLog from '../pages/DashboardPages/Member/activityLog';
import PaymentPage from '../pages/Payment/payment';
import ManageSlots from '../pages/DashboardPages/Trainer/ManageSlots';
import Balance from '../pages/DashboardPages/Admin/Balance';
import BookedTrainer from '../pages/DashboardPages/Member/bookedTrainer';
import SpecificForumPost from '../pages/Home/HomePageSections/SpecificForumPost';
import Dashboard from '../pages/Dashboard/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/allTrainer',
        element: <AllTrainer />,
      },
      {
        path: '/trainer/:id',
        element: <TrainerDetails />,
      },
      {
        path: '/TrainerBooked/:trainerId/:day',
        element: (
          <PrivateRoute>
            <TrainerBooked />
          </PrivateRoute>
        ),
      },
      {
        path: '/allClasses',
        element: <AllClasses />,
      }
      ,
      {
        path: '/community',
        element: <Community />,
      },
      {
        path: '/forum/:id',
        element: <SpecificForumPost />,
      },
      {
        path: '/becomeTrainer',
        element: (
          <PrivateRoute>
            <BecomeTrainer />
          </PrivateRoute>
        ),
      },

      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
      {
        path: '/payment',
        element: (
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        ),
      },
    ],

  },
  // _______ DashboardLayout___________
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: '/dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      }
      ,
      {
        path: '/dashboard/AddNewClass',
        element: (
          <PrivateRoute>
            <AddNewClass />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/newsletter-subscribers',
        element: (
          <PrivateRoute>
            <NewsletterSubscribers />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/applied-trainer',
        element: (
          <PrivateRoute>
            <AppliedTrainer />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/applied-trainer/:id',
        element: (
          <PrivateRoute>
            <AppliedTrainerDetails />
          </PrivateRoute>
        ),
      }
      ,
      {
        path: '/dashboard/allApprovedTrainers',
        element: (
          <PrivateRoute>
            <AllApprovedTrainer />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/addNewSlot',
        element: (
          <PrivateRoute>
            <AddNewSlot />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/ForumPage',
        element: (
          <PrivateRoute>
            <ForumPage />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/activity-log',
        element: (
          <PrivateRoute>
            <ActivityLog />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/ManageSlots',
        element: (
          <PrivateRoute>
            <ManageSlots />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/balance',
        element: (
          <PrivateRoute>
            <Balance />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: '/dashboard/booked-trainer', // this is for member
        element: (
          <PrivateRoute>
            <BookedTrainer />
          </PrivateRoute>
        ),
      },


    ],
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/ErrorPage';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import AllTrainer from '../pages/AllTrainer/allTrainer';
import AllClasses from '../pages/AllClasses/allClasses';
import DashboardLayout from '../layouts/DashboardLayout'
import Community from '../pages/Community/Community';
import Profile from '../pages/Profile/Profile';
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
        element: <TrainerBooked />,
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
        path: '/profile',
        element: <Profile />,
      },

      {
        path: '/becomeTrainer',
        element: <BecomeTrainer />,
      },

      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
      {
        path: '/payment',
        element: <PaymentPage />,
      },
    ],

  },
  // _______ DashboardLayout___________
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: '/dashboard/AddNewClass',
        element: <AddNewClass />,
      },
      {
        path: '/dashboard/newsletter-subscribers',
        element: <NewsletterSubscribers />,
      },
      {
        path: '/dashboard/applied-trainer',
        element: <AppliedTrainer />,
      },
      {
        path: '/dashboard/applied-trainer/:id',
        element: <AppliedTrainerDetails />,
      }
      ,
      {
        path: '/dashboard/allApprovedTrainers',
        element: <AllApprovedTrainer />,
      },
      {
        path: '/dashboard/addNewSlot',
        element: <AddNewSlot />,
      },
      {
        path: '/dashboard/ForumPage',
        element: <ForumPage />,
      },
      {
        path: '/dashboard/activity-log',
        element: <ActivityLog />,
      },
      {
        path: '/dashboard/ManageSlots',
        element: <ManageSlots />,
      }


    ],
  },
]);

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/ErrorPage';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import AllTrainer from '../pages/AllTrainer/allTrainer';
import AllClasses from '../pages/AllClasses/allClasses';
import Dashboard from '../pages/Dashboard/dashboard';
import Community from '../pages/Community/Community';
import Profile from '../pages/Profile/Profile';
import BecomeTrainer from '../pages/BecomeTrainer/BecomeTrainer';
import TrainerDetails from '../pages/TrainerDetails/TrainerDetails';

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
        path: '/allClasses',
        element: <AllClasses />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
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
    ],
  },
]);

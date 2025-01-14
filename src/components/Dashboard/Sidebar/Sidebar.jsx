import { Link, NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'All Newsletter Subscribers', path: '/dashboard/newsletter-subscribers' },
    { name: 'All Trainers', path: '/dashboard/allApprovedTrainers' },
    { name: 'Applied Trainer', path: '/dashboard/applied-trainer' },
    { name: 'Balance', path: '/dashboard/balance' },
    { name: 'Add New Class', path: '/dashboard/AddNewClass' },
    { name: 'Manage Slots', path: '/dashboard/manage-slots' },
    { name: 'Add New Slot', path: '/dashboard/addNewSlot' },
    { name: 'Add New Forum', path: '/dashboard/add-forum' },
    { name: 'Activity Log', path: '/dashboard/activity-log' },
    { name: 'Profile Page', path: '/dashboard/profile' },
    { name: 'Booked Trainer', path: '/dashboard/booked-trainer' },
  ];

  return (
    <div className='w-64 bg-gray-800 text-white fixed inset-y-0 left-0'>
      <div className='p-4'>
        <Link to="/">
        <h1 className='text-lg font-bold mb-4'>Dashboard</h1>
        </Link>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className='py-2'>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'text-gray-300 hover:text-white'
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import SearchBar from '../SearchBar/SearchBar';

const Header: React.FC = () => {
  return (
    <header className='w-full border-b shadow-sm'>
      <nav className='container mx-auto flex items-center justify-between py-4'>
        {/* Left Section (Logo & Links) */}
        <div className='flex items-center gap-10'>
          <div className='text-lg font-semibold'>My App</div>

          <ul className='flex space-x-6'>
            <li>
              <Link to='/' className='hover:underline'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/my-calendar' className='hover:underline'>
                My Calendar
              </Link>
            </li>
            <li>
              <Link to='/user/:id' className='hover:underline'>
                User Profile
              </Link>
            </li>
            <li>
              <Link to='/my-contacts/:id' className='hover:underline'>
                My Contacts
              </Link>
            </li>
            <li>
              <Link to='/create-event' className='hover:underline'>
                Create Event
              </Link>
            </li>
            <li>
              <Link to='/admin-board' className='hover:underline'>
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Center Section (Search Bar) */}
        <div className='flex-1 max-w-md'>
          <SearchBar placeholder='Search...' onChange={console.log} />
        </div>

        {/* Right Section (Buttons) */}
        <div className='flex items-center gap-4'>
          <Button
            onClick={() => {}}
            className='bg-primary text-white px-4 py-2 rounded'
          >
            Sign in
          </Button>
          <Button
            onClick={() => {}}
            className='bg-secondary text-white px-4 py-2 rounded'
          >
            Register
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

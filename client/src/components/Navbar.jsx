import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-white text-2xl font-bold">MyApp</Link>
        <div className="space-x-6">
          <Link to="/conversations" className="text-white hover:text-blue-400">Conversations</Link>
          <Link to="/profile" className="text-white hover:text-blue-400">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

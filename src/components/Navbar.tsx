import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <Link to="/" className="text-xl font-bold">
        🏦 MyBank
      </Link>
      {user ? (
        <div className="flex gap-4 items-center">
          <span className="text-sm">{user.email}</span>
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </div>
      ) : (
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      )}
    </nav>
  );
}

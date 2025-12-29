import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AmLayout = () => {
  const { getAmNavigationItems, logout, user } = useAuth();

  const nameParts = user?.fullName?.split(' ') || [];
  const initials = nameParts.map((n) => n[0]).join('');

  return (
    <div className="h-screen flex flex-col bg-[var(--color-background)] overflow-hidden">
      {/* Navigation Bar */}
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-muted)] px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between">

          {/* Left: Logo + Navigation */}
          <div className="flex items-center space-x-10">
            <Link
              to="/main"
              className="text-xl font-semibold text-[var(--color-chart-2)] tracking-wide hover:opacity-90 transition"
            >
              KosquTrack
            </Link>

            <div className="flex items-center space-x-6 text-sm">
              {getAmNavigationItems().map((link) => (
                <NavLink
                  key={link.id}
                  to={link.href}
                  className={({ isActive }) =>
                    `transition font-medium ${
                      isActive
                        ? 'text-[var(--color-chart-2)]'
                        : 'text-[var(--color-foreground)] hover:text-[var(--color-chart-4)]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right: Logout Button + User Avatar */}
          <div className="flex items-center space-x-4">

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-[var(--color-chart-2)] text-white text-sm font-medium 
                     hover:bg-[var(--color-chart-4)] transition-all shadow-sm hover:shadow-md"
            >
              Logout
            </button>

            {/* User Avatar */}
            <div
              className="w-9 h-9 bg-[var(--color-chart-4)] rounded-full flex items-center justify-center 
                        font-semibold text-sm text-white shadow-sm"
            >
              {initials}
            </div>

          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto bg-[var(--color-background)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AmLayout;

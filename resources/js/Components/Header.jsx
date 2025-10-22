import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import profile from '../../assets/profile.webp';
import DOMPurify from 'dompurify';

export default function Header({ sidebarOpen, toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const { auth, notifications = [] } = usePage().props;
  const programId = auth?.user?.program_id;

  // 🟢 Header text based on program
  const programTitles = {
    1: '  Community Empowerment thru Science and Technology Digital System',
    2: '  Local Grants-in-Aid Programme Digital System',
    3: '  Smart and Sustainable Communities Program Digital System',
  };

  const fullText = programTitles[programId] || 'DOST Digital System';

  // 🟢 Header color based on program
  const programColors = {
    1: 'bg-green-100 border-green-400',
    2: 'bg-blue-100 border-blue-400',
    3: 'bg-orange-100 border-orange-400',
  };

  const headerColor = programColors[programId] || 'bg-green-100 border-green-400';

  const fullName = auth?.user
    ? `${auth.user.first_name} ${auth.user.last_name}`
    : 'User';

  const hasUnread = notifications.some((notif) => !notif.is_read);

  // ✍️ Typing animation
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setDisplayText((prev) => prev + fullText.charAt(i));
      i++;
      if (i === fullText.length) clearInterval(typing);
    }, 30);
    return () => clearInterval(typing);
  }, [fullText]);

  // 🔁 Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((p) => !p), 500);
    return () => clearInterval(blink);
  }, []);

  // 🔄 Auto-refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['notifications'] });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <header className={`${headerColor} border-b px-6 py-4 flex items-center justify-between shadow-sm transition-colors`}>
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="text-gray-700 hover:text-gray-900 focus:outline-none mr-4 text-2xl font-bold"
      >
        ☰
      </button>

      {/* Animated Title */}
      <h1 className="text-lg sm:text-xl font-semibold text-gray-800 font-mono whitespace-nowrap">
        {displayText}
        {showCursor && <span className="animate-pulse">|</span>}
      </h1>

      {/* Right Section: Notifications + Profile */}
      <div className="flex items-center space-x-4 relative">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            className="relative text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasUnread && <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border z-20">
              <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notifications</div>
              <ul className="text-sm text-gray-600 max-h-60 overflow-y-auto divide-y">
                {notifications.length > 0 ? (
                  notifications.map((notif, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        !notif.is_read ? 'bg-green-50' : 'bg-white'
                      }`}
                      onClick={() =>
                        router.post(`/notifications/read/${notif.notification_id}`, {}, {
                          onSuccess: () => {
                            if (notif.title === 'MOA Generated') router.visit('/moa');
                            if (notif.title === 'Company Project Updated')
                              router.visit(`/draft-moa?company_id=${notif.company_id}`);
                          },
                        })
                      }
                    >
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {notif.title}
                        {!notif.is_read ? (
                          <span className="text-red-500 text-xs font-medium">● Unread</span>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">Read</span>
                        )}
                      </div>
                      <div
                        className="text-xs text-gray-500"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notif.message) }}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-sm">No new notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img src={profile} alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="font-medium text-gray-700">{fullName}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
              <a
                onClick={() => router.visit(route('users.edit', auth.user.user_id))}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Settings
              </a>
              <a
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

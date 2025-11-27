import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePage, router } from "@inertiajs/react";
import profile from '../../assets/profile.webp';
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import DOMPurify from 'dompurify';

export default function Header({ sidebarOpen, toggleSidebar }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('mobile');

  const { auth, notifications = [] } = usePage().props;
  const programId = auth?.user?.program_id;

  // 🟢 Header text based on program
  const programTitles = {
    1: '  Community Empowerment thru Science and Technology Digital System',
    2: '  Local Grants-in-Aid Programme Digital System',
    3: '  Smart and Sustainable Communities Program Digital System',
  };

  const fullText = programTitles[programId] || 'DOST Digital System';
  const mediumText = programId === 1 ? '  CEST Digital System' : programId === 2 ? '  LGIA Digital System' : programId === 3 ? '  SSCP Digital System' : 'DOST Digital System';
  const shortText = programId === 1 ? '  CEST' : programId === 2 ? '  LGIA' : programId === 3 ? '  SSCP' : 'DOST';

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

  // Handle window resize to detect screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Typing animation
  useEffect(() => {
    let textToUse = shortText;
    if (screenSize === 'desktop') {
      textToUse = fullText;
    } else if (screenSize === 'tablet') {
      textToUse = mediumText;
    }

    let i = 0;
    setDisplayText('');
    
    const typingInterval = setInterval(() => {
      setDisplayText((prev) => prev + textToUse.charAt(i));
      i++;
      if (i === textToUse.length) clearInterval(typingInterval);
    }, 25);

    return () => clearInterval(typingInterval);
  }, [screenSize, fullText, mediumText, shortText]);

  // Cursor blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Auto-refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['notifications'] });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleNotification = () => {
    setNotifOpen(!notifOpen);
    setDropdownOpen(false);
  };

  const handleToggleProfile = () => {
    setDropdownOpen(!dropdownOpen);
    setNotifOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <header className={`${headerColor} border-b px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm sticky top-0 z-40 transition-all duration-300`}>
      {/* Left Section - Menu Button + Title */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
        {/* Menu Button - Mobile and Tablet */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-opacity-50 rounded-lg transition flex-shrink-0"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Title with Typing Animation */}
        <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800 font-mono truncate whitespace-nowrap">
          {displayText}
          {showCursor && <span className="animate-pulse">|</span>}
        </h1>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 relative flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleToggleNotification}
            className="relative text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
            onClick={handleToggleProfile}
            className="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition"
          >
            <img src={profile} alt="Profile" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full" />
            <span className="hidden sm:block font-medium text-gray-700 text-sm">{fullName}</span>
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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-t"
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
// components/SidebarMenuItems.jsx
import { Link, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Building,
  Users,
  FileSignature,
  FileText,
  ClipboardList,
  SquareKanban,
  HandCoins,
  ArrowLeftRight,
  FileDiff,
  Megaphone,
  Eye,
  AlertCircle,
  Settings,
  Files,
  CheckCircle,
  Pencil,
  Search,
  ClipboardCheck,
  Award,
  BookOpen,
  FilePlus2,
  Hammer,
  ShieldAlert,
  AudioLines,
  Logs,
  FilePlus,
  FileUser,
  Plus,
  List,
  FolderOpen,
} from "lucide-react";
import Dropdown from "./Dropdown";

export default function SidebarMenuItems({ role, dropdowns, toggleDropdown, onClose, getHomePage }) {
  const { auth } = usePage().props;

  return (
    <>
      {/* Dashboard Link */}
      <Link
        href={getHomePage()}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:shadow hover:bg-gray-100 transition"
        onClick={onClose}
      >
        <LayoutDashboard size={18} />
        {role === 'user' ? 'Dashboard' : 
         ['rd', 'au'].includes(role) ? 'Dashboard' : 
         'Overview'}
      </Link>

      {/* Admin Panel - Head Only */}
      {role === 'head' && (
        <Dropdown
          title="Admin Panel"
          icon={<ShieldAlert size={18} />}
          isOpen={dropdowns.adminpanel}
          onToggle={() => toggleDropdown('adminpanel')}
          links={[
            { label: 'User Management', href: `/admin/users`, icon: <Users size={16} /> },
            { label: 'Director Management', href: `/admin/directors`, icon: <Settings size={16} /> },
            { label: 'Blocking Management', href: `/blocked-ips`, icon: <AlertCircle size={16} /> },
            { label: 'Login Frequency', href: `/login-frequency`, icon: <AudioLines size={16} /> },
            { label: 'Logs Management', href: `/logs`, icon: <Logs size={16} /> },
          ]}
          onClose={onClose}
        />
      )}

      {/* Manage Proposals - RPMO/Staff */}
      {(role === 'rpmo' || role === 'staff' || role === 'user') && (
        <Dropdown
          title="Manage Proposals"
          icon={<Files size={18} />}
          isOpen={dropdowns.proposal}
          onToggle={() => toggleDropdown('proposal')}
          links={[
            { 
              label: 'Create Proposal', 
              href: `/proposals/create/${auth?.user?.program_id}`, 
              icon: <FilePlus size={16} /> 
            },
            { 
              label: 'My Proposals', 
              href: '/proposals', 
              icon: <FileUser size={16} /> 
            },
          ]}
          onClose={onClose}
        />
      )}

      {/* Review & Approval - RPMO/Staff */}
     {(role === 'rpmo' || role === 'staff') && (
        <Dropdown
          title="Manage Projects"
          icon={<FolderOpen size={18} />}
          isOpen={dropdowns.review}
          onToggle={() => toggleDropdown('review')}
          links={[
            { label: 'Create Project', href: '/draft-moa', icon: <Plus size={16} /> },
            { label: 'Project List', href: '/draft-moa', icon: <List size={16} /> },
            { label: 'Generate MOA', href: '/draft-moa', icon: <FileSignature size={16} /> },
            { label: 'MOA List', href: '/moa', icon: <FileText size={16} /> },
            { label: 'Project Compliance', href: '/compliance', icon: <ClipboardCheck size={16} /> },
            { label: 'Approved Project', href: `/approved-projects`, icon: <CheckCircle size={16} /> },
          ]}
          onClose={onClose}
        />
      )}

      {/* Implementation - Staff/RPMO/RD */}
      {(role === 'staff' || role === 'rpmo' || role === 'rd') && (
        <Dropdown
          title="Implementation"
          icon={<Pencil size={18} />}
          isOpen={dropdowns.implementation}
          onToggle={() => toggleDropdown('implementation')}
          links={[
            // Phase One & Two visible to staff and rpmo (and rd if needed)
            ...(role === 'staff' || role === 'rpmo'
              ? [
                  { label: 'Phase One', href: '/implementation', icon: <Hammer size={16} /> },
                  { label: 'Phase Two', href: '/refunds', icon: <HandCoins size={16} /> },
                ]
              : []),

            ...(role === 'staff'
              ? [
                  { label: 'Apply for Restructuring', href: '/apply-restructuring', icon: <BookOpen size={16} /> },
                ]
              : []),

            ...(role === 'rpmo' || role === 'rd'
              ? [
                  { label: 'Verify Restructure', href: '/verify-restructure', icon: <Search size={16} /> },
                ]
              : []),
          ]}
          onClose={onClose}
        />
      )}

      {/* Reports - Staff/RPMO */}
      {(role === 'staff' || role === 'rpmo') && (
        <Dropdown
          title="Reports"
          icon={<FileText size={18} />}
          isOpen={dropdowns.reports}
          onToggle={() => toggleDropdown('reports')}
          links={[
            { label: 'Quarterly Reports', href: '/reports', icon: <ClipboardList size={16} /> },
          ]}
          onClose={onClose}
        />
      )}



      {/* My Transactions - User Only */}
      {role === 'user' && (
        <Dropdown
          title="My Transactions"
          icon={<ArrowLeftRight size={18} />}
          isOpen={dropdowns.transaction}
          onToggle={() => toggleDropdown('transaction')}
          links={[
            { label: 'Quarterly Report', href: '/reports', icon: <FileDiff size={16} /> },
          ]}
          onClose={onClose}
        />
      )}

            {/* Announcements - All Roles */}
      <Dropdown
        title="Announcements"
        icon={<Megaphone size={18} />}
        isOpen={dropdowns.announce}
        onToggle={() => toggleDropdown('announce')}
        links={[
          ...((role === 'rpmo' || role === 'head' || role === 'staff')
            ? [{ label: 'Manage Announcement', href: '/announcements', icon: <FilePlus2 size={16} /> }]
            : []),
          {
            label: 'Check Announcements',
            href: '/announcements/view',
            icon: <Eye size={16} />,
            target: '_blank',
          },
        ]}
        onClose={onClose}
      />
    </>
  );
}
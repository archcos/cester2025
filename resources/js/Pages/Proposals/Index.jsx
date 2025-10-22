import { Link, router, Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  X,
  FileText,
  Calendar,
  User,
  Tag,
  Clock,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Helper to format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Status badge component
function StatusBadge({ status }) {
  const statusConfig = {
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    Approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    'Under Review': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  };

  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Tag };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export default function Index({ proposals, filters }) {
  const [search, setSearch] = useState(filters.search || '');
  const [perPage, setPerPage] = useState(filters.perPage || 10);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const { auth } = usePage().props;
  const role = auth?.user?.role;

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      router.get('/proposals', { search, perPage }, { 
        preserveState: true, 
        replace: true 
      });
    }, 400);
    return () => clearTimeout(delaySearch);
  }, [search]);

  const handlePerPageChange = (e) => {
    const newPerPage = e.target.value;
    setPerPage(newPerPage);
    router.get('/proposals', {
      search,
      perPage: newPerPage,
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      router.delete(`/proposals/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          alert('Proposal deleted successfully.');
        }
      });
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <Head title="Proposals" />
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {role === 'user' ? 'My Proposals' : 'Proposal Management'}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {role === 'user' 
                      ? 'View and manage your submitted proposals' 
                      : 'Review and manage all proposals'}
                  </p>
                </div>
              </div>
              
              {role === 'user' && (
                <Link
                  href={`/proposals/create/${auth?.user?.program_id}`}
                  className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Proposal
                </Link>
              )}
            </div>
          </div>

          {/* Filters Section */}
          <div className="p-6 bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title, details, status, or user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Per Page Selector */}
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 border border-gray-300 shadow-sm">
                <select
                  value={perPage}
                  onChange={handlePerPageChange}
                  className="border-0 bg-transparent text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer"
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">entries</span>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Proposal Details
                    </div>
                  </th>
                  {role !== 'user' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Submitted By
                      </div>
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Program & Type
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Submitted
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {proposals.data.map((proposal) => (
                  <tr key={proposal.proposal_id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg mt-1">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {proposal.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {proposal.details}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {role !== 'user' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {proposal.user?.first_name?.charAt(0)}{proposal.user?.last_name?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {proposal.user?.name || 'Unknown User'}
                            </div>
                            {proposal.user?.office && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {proposal.user.office.office_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {proposal.program?.program_name || 'N/A'}
                        </div>
                        {proposal.project_type && (
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block">
                            {proposal.project_type}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <StatusBadge status={proposal.status} />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(proposal.created_at)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedProposal(proposal)}
                          className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {role === 'user' && proposal.status === 'Pending' && (
                          <>
                            <Link
                              href={`/proposals/${proposal.proposal_id}/edit`}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit Proposal"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(proposal.proposal_id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete Proposal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {proposals.data.length === 0 && (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No proposals found</h3>
                    <p className="text-gray-500 text-sm">
                      {search 
                        ? 'Try adjusting your search criteria' 
                        : role === 'user' 
                          ? 'Get started by creating your first proposal' 
                          : 'No proposals have been submitted yet'}
                    </p>
                  </div>
                  {role === 'user' && !search && (
                    <Link
                      href={`/proposals/create/${auth?.user?.program_id}`}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Proposal
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {proposals.links && proposals.links.length > 3 && (
            <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {proposals.from || 1} to {proposals.to || proposals.data.length} of {proposals.total || proposals.data.length} results
                </div>
                <div className="flex gap-1">
                  {proposals.links.map((link, index) => (
                    <button
                      key={index}
                      disabled={!link.url}
                      onClick={() => link.url && router.visit(link.url)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                        link.active
                          ? 'bg-blue-500 text-white border-transparent shadow-md'
                          : link.url
                          ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <ProposalModal
          proposal={selectedProposal}
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposal(null)}
          role={role}
        />
      )}
    </main>
  );
}

function ProposalModal({ proposal, isOpen, onClose, role }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Proposal Details</h3>
                <p className="text-blue-100 text-sm">Complete proposal information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Status and Date */}
          <div className="flex items-center justify-between pb-4 border-b">
            <StatusBadge status={proposal.status} />
            <div className="text-sm text-gray-500">
              Submitted: {formatDate(proposal.created_at)}
            </div>
          </div>

          {/* User Info (if not user role) */}
          {role !== 'user' && proposal.user && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Submitted By
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {proposal.user.first_name?.charAt(0)}{proposal.user.last_name?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{proposal.user.name}</div>
                  {proposal.user.office && (
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {proposal.user.office.office_name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Proposal Information */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Proposal Title</h4>
              <p className="text-gray-900 font-semibold text-lg">{proposal.title}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Program</h4>
              <p className="text-gray-900">{proposal.program?.program_name || 'N/A'}</p>
            </div>

            {proposal.project_type && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Project Type</h4>
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm">
                  {proposal.project_type}
                </span>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Details</h4>
              <p className="text-gray-900 whitespace-pre-wrap">{proposal.details}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
            {role === 'user' && proposal.status === 'Pending' && (
              <Link
                href={`/proposals/${proposal.proposal_id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium"
              >
                <Edit3 className="w-4 h-4" />
                Edit Proposal
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
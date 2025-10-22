import { Head, Link, usePage } from '@inertiajs/react';
import {
  ChevronLeft,
  FileText,
  User,
  Calendar,
  Tag,
  Clock,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';

// Helper to format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Status badge component
function StatusBadge({ status }) {
  const statusConfig = {
    Pending: { 
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500'
    },
    Approved: { 
      color: 'bg-green-50 text-green-700 border-green-200', 
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500'
    },
    Rejected: { 
      color: 'bg-red-50 text-red-700 border-red-200', 
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500'
    },
    'Under Review': { 
      color: 'bg-blue-50 text-blue-700 border-blue-200', 
      icon: AlertCircle,
      gradient: 'from-blue-500 to-indigo-500'
    },
  };

  const config = statusConfig[status] || { 
    color: 'bg-gray-50 text-gray-700 border-gray-200', 
    icon: Tag,
    gradient: 'from-gray-500 to-gray-600'
  };
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold ${config.color}`}>
      <Icon className="w-5 h-5" />
      {status}
    </div>
  );
}

export default function Show({ proposal }) {
  const { auth } = usePage().props;
  const role = auth?.user?.role;
  const isOwner = auth?.user?.user_id === proposal.user_id;
  const canEdit = isOwner && proposal.status === 'Pending';

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <Head title={`Proposal: ${proposal.title}`} />
      
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/proposals"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 hover:gap-3 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Proposals
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
                  <div className="flex items-center gap-3 text-blue-100">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Submitted {formatDate(proposal.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <StatusBadge status={proposal.status} />
            </div>

            {/* Quick Info Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-200">Program</div>
                  <div className="font-semibold">{proposal.program?.program_name || 'N/A'}</div>
                </div>
              </div>

              {proposal.project_type && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-200">Project Type</div>
                    <div className="font-semibold capitalize">{proposal.project_type.replace('_', ' ')}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-200">Last Updated</div>
                  <div className="font-semibold text-sm">{formatDate(proposal.updated_at)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 space-y-8">
            {/* Submitter Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Submitted By
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {proposal.user?.first_name?.charAt(0)}{proposal.user?.last_name?.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {proposal.user?.name || 'Unknown User'}
                  </div>
                  <div className="text-sm text-gray-600">{proposal.user?.email}</div>
                  {proposal.user?.office && (
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {proposal.user.office.office_name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Proposal Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Proposal Details
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{proposal.details}</p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Created</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {formatDate(proposal.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Proposal was submitted to the system</p>
                  </div>
                </div>

                {proposal.updated_at !== proposal.created_at && (
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">Last Modified</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {formatDate(proposal.updated_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Proposal was updated</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Your proposal is pending review
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      You can still edit or delete this proposal while it's pending.
                    </p>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/proposals/${proposal.proposal_id}/edit`}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Proposal
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this proposal?')) {
                            window.location.href = `/proposals/${proposal.proposal_id}/delete`;
                          }
                        }}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Information */}
            {proposal.status !== 'Pending' && (
              <div className={`rounded-xl p-6 border-2 ${
                proposal.status === 'Approved' 
                  ? 'bg-green-50 border-green-200' 
                  : proposal.status === 'Rejected'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-4">
                  {proposal.status === 'Approved' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : proposal.status === 'Rejected' ? (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Status: {proposal.status}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {proposal.status === 'Approved' && 'Your proposal has been approved and is ready for the next steps.'}
                      {proposal.status === 'Rejected' && 'Unfortunately, your proposal was not approved at this time.'}
                      {proposal.status === 'Under Review' && 'Your proposal is currently being reviewed by the team.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Proposal ID: <span className="font-mono font-semibold text-gray-900">#{proposal.proposal_id}</span>
            </div>
            <Link
              href="/proposals"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All Proposals →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
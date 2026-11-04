import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Check,
  X,
  Search,
} from "lucide-react";
import api from "../../services/api";
import {
  fetchInstructorRequestsStart,
  fetchInstructorRequestsSuccess,
  fetchInstructorRequestsFailure,
  handleInstructorRequestStart,
  handleInstructorRequestSuccess,
  handleInstructorRequestFailure,
} from "../../store/slices/adminSlice";

export default function AdminInstructorRequests({ onUserRoleUpdated }) {
  const dispatch = useDispatch();
  const {
    requests,
    requestsLoading,
    requestsError,
    actionLoading,
  } = useSelector((state) => state.admin);

  const [processingId, setProcessingId] = useState(null);
  const [localSuccess, setLocalSuccess] = useState("");
  const [localError, setLocalError] = useState("");
  const [filterTab, setFilterTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = useCallback(async () => {
    dispatch(fetchInstructorRequestsStart());
    try {
      const response = await api.get("/admin/instructor-requests");
      dispatch(fetchInstructorRequestsSuccess(response.data.requests || []));
    } catch (err) {
      dispatch(
        fetchInstructorRequestsFailure(
          err.response?.data?.message ||
            "Failed to load instructor requests. Please try again.",
        ),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (userId, userName) => {
    setProcessingId(userId);
    setLocalSuccess("");
    setLocalError("");
    dispatch(handleInstructorRequestStart());

    try {
      const res = await api.patch(
        `/admin/instructor-requests/${userId}/approve`,
        {
          feedback: "Application reviewed and approved.",
        },
      );
      if (res.data?.success && res.data?.user) {
        dispatch(handleInstructorRequestSuccess(res.data.user));
        setLocalSuccess(
          res.data.message || `${userName} has been promoted to Instructor!`,
        );
      }
      if (onUserRoleUpdated) onUserRoleUpdated();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to approve request.";
      dispatch(handleInstructorRequestFailure(msg));
      setLocalError(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId, userName) => {
    setProcessingId(userId);
    setLocalSuccess("");
    setLocalError("");
    dispatch(handleInstructorRequestStart());

    try {
      const res = await api.patch(
        `/admin/instructor-requests/${userId}/reject`,
        {
          feedback: "Application declined after administrative review.",
        },
      );
      if (res.data?.success && res.data?.user) {
        dispatch(handleInstructorRequestSuccess(res.data.user));
        setLocalSuccess(
          res.data.message || `Instructor request for ${userName} declined.`,
        );
      }
      if (onUserRoleUpdated) onUserRoleUpdated();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reject request.";
      dispatch(handleInstructorRequestFailure(msg));
      setLocalError(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = useMemo(() => {
    return requests.filter(
      (r) => r.instructorRequestStatus === "pending",
    ).length;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchTab =
        filterTab === "all" || r.instructorRequestStatus === filterTab;
      const matchSearch =
        (r.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.instructorRequestReason || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [requests, filterTab, searchQuery]);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Inbox Header */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
              <GraduationCap size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Instructor Upgrade Requests
                </h2>
                {pendingCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-2xs">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Review and moderate student applications to become course creators
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchRequests}
              disabled={requestsLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={requestsLoading ? "animate-spin" : ""}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterTab("pending")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterTab === "pending"
                  ? "bg-amber-100 text-amber-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("approved")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterTab === "approved"
                  ? "bg-emerald-100 text-emerald-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Approved
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("rejected")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterTab === "rejected"
                  ? "bg-red-100 text-red-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Rejected
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterTab === "all"
                  ? "bg-slate-200 text-slate-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({requests.length})
            </button>
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applicant..."
              className="h-8 w-full sm:w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action alerts */}
      {localSuccess && (
        <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50 px-6 py-2.5 text-xs font-medium text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-600" />
            <span>{localSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setLocalSuccess("")}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {(requestsError || localError) && (
        <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-6 py-2.5 text-xs font-medium text-red-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{requestsError || localError}</span>
          </div>
          <button
            type="button"
            onClick={() => setLocalError("")}
            className="text-red-700 hover:text-red-900"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Requests table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/70 text-[11px] font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3">Applicant</th>
              <th className="px-6 py-3">Application Statement</th>
              <th className="px-6 py-3">Requested On</th>
              <th className="px-6 py-3">Current Status</th>
              <th className="px-6 py-3 text-right">Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requestsLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <span>Loading requests inbox...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  No {filterTab !== "all" ? filterTab : ""} instructor requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const isPending = req.instructorRequestStatus === "pending";
                const isApproved = req.instructorRequestStatus === "approved";
                const isRejected = req.instructorRequestStatus === "rejected";
                const isProcessing =
                  actionLoading && processingId === req._id;

                return (
                  <tr key={req._id} className="hover:bg-slate-50/40">
                    {/* Applicant details */}
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-900">
                        {req.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {req.email}
                      </div>
                      <div className="mt-0.5 inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 uppercase">
                        Current: {req.role}
                      </div>
                    </td>

                    {/* Statement / Reason */}
                    <td className="px-6 py-3.5 max-w-xs">
                      {req.instructorRequestReason ? (
                        <div className="rounded-lg bg-slate-50 p-2 text-slate-700 italic border border-slate-100 text-[11px] leading-relaxed">
                          "{req.instructorRequestReason}"
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">
                          No statement provided
                        </span>
                      )}
                      {req.instructorRequestFeedback && (
                        <div className="mt-1 text-[10px] text-slate-500">
                          <strong className="text-slate-700">Admin feedback:</strong>{" "}
                          {req.instructorRequestFeedback}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        <span>
                          {req.instructorRequestDate
                            ? new Date(
                                req.instructorRequestDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          isPending
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : isApproved
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isRejected
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isPending && <Clock size={11} />}
                        {isApproved && <CheckCircle2 size={11} />}
                        {isRejected && <XCircle size={11} />}
                        <span className="capitalize">
                          {req.instructorRequestStatus}
                        </span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleApprove(req._id, req.name)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition disabled:opacity-50"
                            title="Approve applicant as Instructor"
                          >
                            <Check size={13} />
                            <span>{isProcessing ? "..." : "Approve"}</span>
                          </button>

                          {/* Reject Button */}
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleReject(req._id, req.name)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition disabled:opacity-50"
                            title="Decline request"
                          >
                            <X size={13} />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : isApproved ? (
                        <span className="text-[11px] font-medium text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 size={12} /> Instructor Active
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleApprove(req._id, req.name)}
                            className="text-[11px] font-semibold text-indigo-600 hover:underline"
                          >
                            Re-approve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

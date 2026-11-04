import {
  X,
  User,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  GraduationCap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedUser,
  updateUserRoleStart,
  updateUserRoleSuccess,
  updateUserRoleFailure,
  updateUserStatusStart,
  updateUserStatusSuccess,
  updateUserStatusFailure,
} from "../../store/slices/adminSlice";
import api from "../../services/api";

export default function AdminUserDetailsModal() {
  const dispatch = useDispatch();
  const { selectedUser, selectedUserLoading, selectedUserError, actionLoading } =
    useSelector((state) => state.admin);

  if (!selectedUser && !selectedUserLoading && !selectedUserError) {
    return null;
  }

  const handleClose = () => {
    dispatch(clearSelectedUser());
  };

  const handleToggleStatus = async () => {
    if (!selectedUser?._id) return;
    dispatch(updateUserStatusStart());
    try {
      const res = await api.patch(`/admin/users/${selectedUser._id}/status`, {
        status: !selectedUser.status,
      });
      if (res.data?.success) {
        dispatch(
          updateUserStatusSuccess({
            _id: selectedUser._id,
            status: !selectedUser.status,
          }),
        );
      }
    } catch (err) {
      dispatch(
        updateUserStatusFailure(
          err.response?.data?.message || "Failed to update user status.",
        ),
      );
    }
  };

  const handleRoleChange = async (newRole) => {
    if (!selectedUser?._id) return;
    dispatch(updateUserRoleStart());
    try {
      const res = await api.patch(`/admin/users/${selectedUser._id}/role`, {
        role: newRole,
      });
      if (res.data?.success) {
        dispatch(
          updateUserRoleSuccess({
            _id: selectedUser._id,
            role: newRole,
          }),
        );
      }
    } catch (err) {
      dispatch(
        updateUserRoleFailure(
          err.response?.data?.message || "Failed to update user role.",
        ),
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <User size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                User Account Overview
              </h3>
              <p className="text-xs text-slate-500">
                Detailed profile & platform permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedUserLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
              <p className="text-xs font-medium text-slate-500">
                Loading user profile...
              </p>
            </div>
          ) : selectedUserError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-600">
              {selectedUserError}
            </div>
          ) : selectedUser ? (
            <div className="space-y-5">
              {/* Profile Card Header */}
              <div className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white shadow-sm">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {selectedUser.name}
                    </h4>
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <Mail size={13} /> {selectedUser.email}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    selectedUser.status
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {selectedUser.status ? (
                    <>
                      <CheckCircle2 size={13} /> Active
                    </>
                  ) : (
                    <>
                      <XCircle size={13} /> Inactive
                    </>
                  )}
                </span>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Role */}
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-slate-400 font-medium">Assigned Role</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-indigo-700">
                      {selectedUser.role}
                    </span>
                    <select
                      value={selectedUser.role}
                      disabled={actionLoading}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700"
                    >
                      <option value="student">student</option>
                      <option value="instructor">instructor</option>
                    </select>
                  </div>
                </div>

                {/* Registered Date */}
                <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                  <span className="text-slate-400 font-medium">Joined On</span>
                  <div className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800">
                    <Calendar size={13} className="text-slate-400" />
                    <span>
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Bio */}
              <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-2xs">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <FileText size={13} /> Bio / Statement
                </span>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-700 italic">
                  {selectedUser.bio || "No biography provided by this user."}
                </p>
              </div>

              {/* Instructor Request Information if any */}
              {selectedUser.instructorRequestStatus &&
                selectedUser.instructorRequestStatus !== "none" && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                        <GraduationCap size={15} className="text-indigo-600" />
                        Instructor Request
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                          selectedUser.instructorRequestStatus === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : selectedUser.instructorRequestStatus === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {selectedUser.instructorRequestStatus}
                      </span>
                    </div>

                    {selectedUser.instructorRequestReason && (
                      <p className="mt-2 text-slate-700">
                        <strong className="text-slate-900">Reason:</strong>{" "}
                        {selectedUser.instructorRequestReason}
                      </p>
                    )}

                    {selectedUser.instructorRequestFeedback && (
                      <p className="mt-1 text-slate-700">
                        <strong className="text-slate-900">Admin Note:</strong>{" "}
                        {selectedUser.instructorRequestFeedback}
                      </p>
                    )}
                  </div>
                )}

              {/* Status Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={actionLoading}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    selectedUser.status
                      ? "border border-red-200 text-red-600 hover:bg-red-50"
                      : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {selectedUser.status ? (
                    <>
                      <XCircle size={14} /> Deactivate Account
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Reactivate Account
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  BookOpen,
  Video,
  GraduationCap,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";
import AdminInstructorRequests from "../components/admin/AdminInstructorRequests";
import AdminUserDetailsModal from "../components/admin/AdminUserDetailsModal";
import {
  fetchAdminStatsStart,
  fetchAdminStatsSuccess,
  fetchAdminStatsFailure,
  fetchAdminUsersStart,
  fetchAdminUsersSuccess,
  fetchAdminUsersFailure,
  fetchSingleUserStart,
  fetchSingleUserSuccess,
  fetchSingleUserFailure,
  updateUserStatusStart,
  updateUserStatusSuccess,
  updateUserStatusFailure,
  updateUserRoleStart,
  updateUserRoleSuccess,
  updateUserRoleFailure,
} from "../store/slices/adminSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    stats,
    statsLoading,
    statsError,
    users,
    usersLoading,
    usersError,
    actionLoading,
  } = useSelector((state) => state.admin);

  const fetchData = useCallback(async () => {
    dispatch(fetchAdminStatsStart());
    dispatch(fetchAdminUsersStart());

    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
      ]);

      if (statsRes.data?.stats) {
        dispatch(fetchAdminStatsSuccess(statsRes.data.stats));
      }
      if (usersRes.data?.users) {
        dispatch(fetchAdminUsersSuccess(usersRes.data.users));
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to load admin dashboard data.";
      dispatch(fetchAdminStatsFailure(msg));
      dispatch(fetchAdminUsersFailure(msg));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusToggle = async (userId, currentStatus) => {
    dispatch(updateUserStatusStart());
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, {
        status: !currentStatus,
      });
      if (res.data?.success) {
        dispatch(
          updateUserStatusSuccess({
            _id: userId,
            status: !currentStatus,
          }),
        );
      }
    } catch (err) {
      dispatch(
        updateUserStatusFailure(
          err.response?.data?.message || "Failed to update user status.",
        ),
      );
      alert(err.response?.data?.message || "Failed to update user status.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    dispatch(updateUserRoleStart());
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        dispatch(
          updateUserRoleSuccess({
            _id: userId,
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
      alert(err.response?.data?.message || "Failed to update user role.");
    }
  };

  // View single user details via GET /api/admin/users/:id
  const handleViewUser = async (userId) => {
    dispatch(fetchSingleUserStart());
    try {
      const res = await api.get(`/admin/users/${userId}`);
      if (res.data?.success && res.data?.user) {
        dispatch(fetchSingleUserSuccess(res.data.user));
      }
    } catch (err) {
      dispatch(
        fetchSingleUserFailure(
          err.response?.data?.message || "Failed to fetch user details.",
        ),
      );
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      bg: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Lessons",
      value: stats.totalLessons,
      icon: Video,
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Enrollments",
      value: stats.totalEnrollments,
      icon: GraduationCap,
      bg: "bg-amber-50 text-amber-600",
    },
  ];

  const dashboardError = statsError || usersError;
  const loading = statsLoading || usersLoading;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              <Shield size={14} /> Admin Workspace
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name || "Administrator"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Monitor platform metrics, inspect user profiles, and manage system roles.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {dashboardError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {dashboardError}
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {statsLoading ? "..." : card.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${card.bg}`}>
                  <Icon size={24} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructor Requests Moderation Inbox */}
        <AdminInstructorRequests onUserRoleUpdated={fetchData} />

        {/* User Management Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">User Management</h2>
            <p className="text-xs text-slate-500">
              List of registered students and instructors. Click a user to view full profile details.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                      {usersLoading ? "Loading users..." : "No users found"}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleViewUser(u._id)}
                          className="text-left group cursor-pointer"
                        >
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <Eye size={13} className="opacity-0 group-hover:opacity-100 text-indigo-500 transition" />
                          </div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          disabled={actionLoading}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="student">student</option>
                          <option value="instructor">instructor</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.status
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {u.status ? (
                            <>
                              <CheckCircle2 size={12} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View details button (GET /api/admin/users/:id) */}
                          <button
                            type="button"
                            onClick={() => handleViewUser(u._id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            title="Inspect user details"
                          >
                            <Eye size={13} />
                            <span>Details</span>
                          </button>

                          {/* Toggle status button */}
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleStatusToggle(u._id, u.status)}
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                              u.status
                                ? "border border-red-200 text-red-600 hover:bg-red-50"
                                : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {u.status ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Single User Details Inspection Modal */}
        <AdminUserDetailsModal />
      </div>
    </div>
  );
}

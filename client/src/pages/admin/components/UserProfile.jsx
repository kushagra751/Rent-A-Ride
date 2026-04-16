import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FiGrid, FiLogOut, FiMail, FiShield, FiUser } from "react-icons/fi";
import { toggleNavbarPage } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";

const UserProfile = ({ currentUser, onSignout, onOpenDashboard }) => {
  const dispatch = useDispatch();

  return (
    <div className="absolute right-0 top-14 z-20 w-[340px] rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Account
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Admin profile</h3>
        </div>
        <button
          className="rounded-full px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-100"
          onClick={() => dispatch(toggleNavbarPage("userProfile"))}
          type="button"
        >
          x
        </button>
      </div>

      <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl">
            <FiShield />
          </div>
          <div>
            <p className="text-lg font-semibold">
              {currentUser?.username || "Admin user"}
            </p>
            <p className="text-sm text-slate-300">
              {currentUser?.email || "admin@demo.com"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <FiUser className="text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Role</p>
              <p className="text-sm text-slate-500">
                {currentUser?.isAdmin ? "Administrator" : "Account"}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <FiMail className="text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Email</p>
              <p className="break-all text-sm text-slate-500">
                {currentUser?.email || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <button
          className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-900 hover:bg-slate-50"
          onClick={onOpenDashboard}
          type="button"
        >
          <span className="flex items-center gap-3 font-semibold text-slate-900">
            <FiGrid />
            Go to dashboard
          </span>
        </button>
        <button
          className="flex items-center justify-between rounded-2xl bg-rose-50 px-4 py-3 text-left font-semibold text-rose-700 transition hover:bg-rose-100"
          onClick={onSignout}
          type="button"
        >
          <span className="flex items-center gap-3">
            <FiLogOut />
            Sign out
          </span>
        </button>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  currentUser: PropTypes.object,
  onSignout: PropTypes.func.isRequired,
  onOpenDashboard: PropTypes.func.isRequired,
};

export default UserProfile;

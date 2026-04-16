import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { FiArrowRight, FiClipboard, FiPackage, FiPlusCircle, FiShield } from "react-icons/fi";
import { toggleNavbarPage } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";

const Chat = ({ onAddVehicle, onOpenBookings, onOpenRequests }) => {
  const dispatch = useDispatch();

  const closePanel = () => dispatch(toggleNavbarPage("chat"));

  return (
    <div className="absolute right-0 top-14 z-20 w-[340px] rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Quick Tools
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Admin shortcuts</h3>
        </div>
        <button
          className="rounded-full px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-100"
          onClick={closePanel}
          type="button"
        >
          x
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-100">
          <FiShield />
          Admin workspace
        </div>
        <p className="mt-2 text-sm text-slate-200">
          Use these shortcuts to move quickly between the most used moderation and fleet actions.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <button
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-900 hover:bg-slate-50"
          onClick={() => {
            closePanel();
            onAddVehicle();
          }}
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <FiPlusCircle />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Add vehicle</p>
              <p className="text-sm text-slate-500">Create a new fleet listing</p>
            </div>
          </div>
          <FiArrowRight className="text-slate-400" />
        </button>

        <button
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-900 hover:bg-slate-50"
          onClick={() => {
            closePanel();
            onOpenRequests();
          }}
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <FiClipboard />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Review vendor requests</p>
              <p className="text-sm text-slate-500">Approve or reject pending submissions</p>
            </div>
          </div>
          <FiArrowRight className="text-slate-400" />
        </button>

        <button
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-900 hover:bg-slate-50"
          onClick={() => {
            closePanel();
            onOpenBookings();
          }}
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
              <FiPackage />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Manage bookings</p>
              <p className="text-sm text-slate-500">Update trip and order status</p>
            </div>
          </div>
          <FiArrowRight className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  onAddVehicle: PropTypes.func.isRequired,
  onOpenBookings: PropTypes.func.isRequired,
  onOpenRequests: PropTypes.func.isRequired,
};

export default Chat;

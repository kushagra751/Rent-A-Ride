import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { FaCarSide, FaHeadset, FaLocationDot } from "react-icons/fa6";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";

const CarNotFound = ({
  title = "No vehicles found",
  message = "We could not find a matching car for the selected route and dates.",
  compact = false,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-full px-4 ${compact ? "py-8" : "min-h-screen py-10"} flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50`}
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_.85fr]">
          <div className="bg-slate-950 px-6 py-10 text-white sm:px-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
              <FaCarSide className="text-emerald-300" />
              Vehicle Search
            </div>

            <h1 className="mt-6 max-w-xl text-3xl font-bold leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              {message}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <FaLocationDot className="text-lg text-emerald-300" />
                <p className="mt-3 text-sm font-semibold">Try nearby pickup spots</p>
                <p className="mt-1 text-xs text-slate-300">
                  Switch district or pickup point to see more inventory.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <HiArrowPathRoundedSquare className="text-lg text-emerald-300" />
                <p className="mt-3 text-sm font-semibold">Adjust filters</p>
                <p className="mt-1 text-xs text-slate-300">
                  Broaden fuel type, seats, or transmission for more matches.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <FaHeadset className="text-lg text-emerald-300" />
                <p className="mt-3 text-sm font-semibold">Need a quick option?</p>
                <p className="mt-1 text-xs text-slate-300">
                  Browse all listed vehicles and pick another route in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-8">
            <div className="rounded-[28px] bg-slate-100 p-6">
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-500 to-emerald-300 px-6 py-8 text-slate-950">
                <div className="absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full bg-white/20" />
                <div className="absolute bottom-[-55px] left-[-10px] h-32 w-32 rounded-full bg-slate-950/10" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.25em]">
                  Next Best Step
                </p>
                <h2 className="relative mt-3 text-2xl font-bold">
                  Continue your booking in one tap
                </h2>
                <p className="relative mt-3 text-sm leading-6">
                  Open the full vehicle catalog, change your route, or return home and search again.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => navigate("/vehicles")}
                >
                  Browse All Vehicles
                </button>
                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                  onClick={() => navigate(-1)}
                >
                  Change Search
                </button>
                <Link
                  to="/"
                  className="block w-full rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Back to Home
                </Link>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
                Tip: popular vehicles usually appear faster when you keep pickup and drop-off within the same city.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarNotFound;

CarNotFound.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  compact: PropTypes.bool,
};

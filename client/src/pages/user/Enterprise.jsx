import { Link } from "react-router-dom";
import { FaArrowRight, FaCarSide, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import Footers from "../../components/Footer";

const highlights = [
  {
    title: "Fast onboarding",
    description: "Create your vendor account, list vehicles, and start receiving booking visibility in one dashboard.",
    icon: <FaCarSide />,
  },
  {
    title: "Approval workflow",
    description: "Track pending, approved, and rejected listings clearly so vendors know the exact next step.",
    icon: <MdOutlinePendingActions />,
  },
  {
    title: "Booking insights",
    description: "Review requests, active trips, and order activity from one organized workspace.",
    icon: <FaChartLine />,
  },
  {
    title: "Trusted operations",
    description: "Keep listing details, pickup points, and pricing structured for cleaner fleet operations.",
    icon: <FaShieldAlt />,
  },
];

function Enterprise() {
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_40%),linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#ecfdf5_100%)] px-4 py-16 sm:px-8 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-green-700 shadow-sm">
              Enterprise Fleet
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Turn your vehicles into a managed rental fleet with a cleaner vendor workflow.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Rent a Ride helps vendors publish inventory, manage approval status, receive bookings, and keep vehicle operations organized across multiple pickup points.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/vendorSignin"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Vendor Sign In
                <FaArrowRight />
              </Link>
              <Link
                to="/vendorSignup"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-50"
              >
                Create Vendor Account
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.1)] backdrop-blur">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-green-300">Why vendors use it</p>
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Available vehicles</p>
                  <p className="mt-1 text-3xl font-semibold">Live inventory control</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Approvals</p>
                    <p className="mt-1 text-lg font-semibold">Track every listing state</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Trips</p>
                    <p className="mt-1 text-lg font-semibold">Monitor booking demand</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            >
              <div className="inline-flex rounded-2xl bg-green-100 p-3 text-xl text-green-700">
                {item.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Footers />
    </>
  );
}

export default Enterprise;

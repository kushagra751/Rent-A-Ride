import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { signOut } from "../redux/user/userSlice";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  //i should make a isUser field or this will become so messy in future
  const isUserOnly =
    currentUser && !currentUser.isAdmin && !currentUser.isVendor;
  return isUserOnly ? <Outlet /> : <Navigate to={"/signin"} />;
}

export const PrivateSignin = () => {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    //signin or signout available only if there is no current user
    return <Outlet />;
  }

  // Check the user's role and redirect accordingly
  if (currentUser.isAdmin) {

    return <Navigate to="/adminDashboard" />;

  } else if (currentUser.isVendor) {

    return <Navigate to="/vendorDashboard" />;

  } else {

    return <Navigate to="/" />;
    
  }
};

export const VendorAuthGate = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  if (!currentUser) {
    return <Outlet />;
  }

  if (currentUser.isVendor) {
    return <Navigate to="/vendorDashboard" />;
  }

  const roleLabel = currentUser.isAdmin ? "admin" : "user";

  const handleLogoutFirst = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(signOut());
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.15),_transparent_35%),linear-gradient(160deg,#f8fafc_0%,#ffffff_48%,#ecfdf5_100%)] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="inline-flex rounded-2xl bg-slate-950 p-4 text-xl text-white">
          <FaUserShield />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Switch Account
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          You are already signed in as a {roleLabel}.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          To continue to the vendor {location.pathname === "/vendorSignup" ? "sign up" : "sign in"} page, log out from the current account first. This keeps user and vendor sessions from mixing together.
        </p>

        <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Current account</p>
          <p className="mt-2 break-all">
            {currentUser.username || currentUser.email || "Signed-in account"}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={handleLogoutFirst}
          >
            <FaSignOutAlt />
            Logout And Continue
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-50"
          >
            Back To Home
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;

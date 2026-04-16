import { useDispatch, useSelector } from "react-redux";
import {
  openPages,
  setScreenSize,
  showSidebarOrNot,
  toggleSidebar,
  toggleNavbarPage,
} from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Chat, Notification, UserProfile } from ".";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../../redux/user/userSlice";
import { getApiUrl } from "../../../utils/api";

const NavButton = ({ title, customFunc, icon, color, dotColor, showDot = true }) => (
  <TooltipComponent content={title} position={"BottomCenter"}>
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative rounded-2xl border border-slate-200 bg-white p-3 text-xl shadow-sm transition hover:border-slate-900 hover:bg-slate-50"
    >
      {showDot ? (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full right-[10px] top-[10px] h-2.5 w-2.5"
        ></span>
      ) : null}
      {icon}
    </button>
  </TooltipComponent>
);

NavButton.propTypes = {
  title: PropTypes.string.isRequired,
  customFunc: PropTypes.func.isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  dotColor: PropTypes.string,
  showDot: PropTypes.bool,
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chat, notification, userProfile, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );
  const { currentUser } = useSelector((state) => state.user);
  const [summary, setSummary] = useState({
    stats: {},
    recentBookings: [],
    recentVendorRequests: [],
  });

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    if (screenSize <= 900) {
      dispatch(showSidebarOrNot(false));
    } else {
      dispatch(showSidebarOrNot(true));
    }
  }, [dispatch, screenSize]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(getApiUrl("/api/admin/summary"));
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        setSummary({
          stats: data?.stats || {},
          recentBookings: Array.isArray(data?.recentBookings) ? data.recentBookings : [],
          recentVendorRequests: Array.isArray(data?.recentVendorRequests)
            ? data.recentVendorRequests
            : [],
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchSummary();
  }, []);

  const handleAdminSignOut = async () => {
    try {
      await fetch(getApiUrl("/api/admin/signout"), {
        method: "GET",
      });
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(signOut());
      dispatch(toggleNavbarPage("userProfile"));
      navigate("/adminSignin");
    }
  };

  const pendingNotifications =
    Number(summary?.stats?.pendingVendorRequests || 0) +
    Number(summary?.recentBookings?.length || 0);

  return (
    <div className="relative flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-2 py-3 md:mx-6">
      <div className="flex items-center gap-3">
        <NavButton
          title="Menu"
          customFunc={() => dispatch(toggleSidebar())}
          color="#0f172a"
          showDot={false}
          icon={<AiOutlineMenu />}
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Admin Panel
          </p>
          <p className="text-lg font-bold text-slate-900">Operations</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NavButton
          title="Quick tools"
          customFunc={() => dispatch(openPages("chat"))}
          color="#0f172a"
          dotColor="#22c55e"
          icon={<BsChatLeft />}
        />

        <NavButton
          title="Notifications"
          customFunc={() => dispatch(openPages("notification"))}
          color="#0f172a"
          dotColor="#f59e0b"
          showDot={pendingNotifications > 0}
          icon={<RiNotification3Line />}
        />

        <TooltipComponent content="profile" position="BottomCenter">
          <button
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-900 hover:bg-slate-50"
            onClick={() => dispatch(openPages("userProfile"))}
            type="button"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
              {(currentUser?.username || currentUser?.email || "A").slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Signed in
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {currentUser?.username || "Admin"}
              </p>
            </div>
            <MdKeyboardArrowDown className="text-slate-500" />
          </button>
        </TooltipComponent>

        {chat ? (
          <Chat
            onAddVehicle={() => navigate("/adminDashboard/addProducts")}
            onOpenBookings={() => navigate("/adminDashboard/orders")}
            onOpenRequests={() => navigate("/adminDashboard/vendorVehicleRequests")}
          />
        ) : null}
        {notification ? <Notification summary={summary} /> : null}
        {userProfile ? (
          <UserProfile
            currentUser={currentUser}
            onOpenDashboard={() => {
              dispatch(toggleNavbarPage("userProfile"));
              navigate("/adminDashboard");
            }}
            onSignout={handleAdminSignOut}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;

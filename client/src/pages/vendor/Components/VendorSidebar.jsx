import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../../redux/user/userSlice.jsx";
import { showSidebarOrNot } from "../../../redux/adminSlices/adminDashboardSlice/DashboardSlice.jsx";
import { links } from "../data/vendorSidebarContents.jsx";
import { getApiUrl } from "../../../utils/api";

const VendorSidebar = () => {
  const { activeMenu, screenSize } = useSelector(
    (state) => state.adminDashboardSlice
  );
  const currentUser = useSelector((state) => state.user.currentUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg bg-blue-50 text-slate-950 text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-slate-100 m-2";

  const closeSidebar = () => {
    dispatch(showSidebarOrNot(false));
  };

  const handleSignout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    try {
      await fetch(getApiUrl("/api/vendor/vendorsignout"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refreshToken},${accessToken}`,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(signOut());
      navigate("/vendorSignin");
    }
  };

  return (
    <div className="ml-3 h-screen overflow-auto pb-10 md:overflow-hidden md:hover:overflow-auto">
      {activeMenu && (
        <>
          <div className="flex items-center justify-between">
            <Link
              to="/vendorDashboard"
              className="ml-3 mt-4 flex items-center gap-3 text-xl font-extrabold tracking-tight text-blue-600"
            >
              <SiShopware />
              Vendor Dashboard
            </Link>

            <TooltipComponent content="Close" position="BottomCenter">
              <button
                className="mt-4 block rounded-full p-3 text-xl hover:bg-gray-200"
                onClick={closeSidebar}
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          <div className="mt-10">
            <div className="mx-3 mb-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Logged In
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                {currentUser?.username || "Vendor"}
              </p>
              <p className="text-sm text-slate-500">{currentUser?.email || "-"}</p>
            </div>

            {links.map((section) => (
              <div key={section.title}>
                <p className="m-3 mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  {section.title}
                </p>

                {section.links.map((link) => (
                  <NavLink
                    to={`/vendorDashboard/${link.name}`}
                    key={link.name}
                    onClick={() => {
                      if (screenSize <= 900 && activeMenu) {
                        closeSidebar();
                      }
                    }}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="text-gray-700">{link.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}

            <div className="mt-10 flex items-center gap-2">
              <button
                type="button"
                className="ml-4 text-red-500"
                onClick={handleSignout}
              >
                Sign out
              </button>
              <CiLogout />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorSidebar;

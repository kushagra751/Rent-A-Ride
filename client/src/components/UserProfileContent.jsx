import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import ProfileEdit from "../pages/user/ProfileEdit";
import { setUpdated } from "../redux/user/userSlice";

const infoCardClass =
  "rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md";

export default function UserProfileContent() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isUpdated = useSelector((state) => state.user.isUpdated);

  const profileSummary = useMemo(
    () => [
      {
        icon: <FiUser />,
        label: "Display Name",
        value: currentUser?.username || "Not added",
      },
      {
        icon: <FiMail />,
        label: "Email Address",
        value: currentUser?.email || "Not added",
      },
      {
        icon: <FiPhone />,
        label: "Phone Number",
        value: currentUser?.phoneNumber || "Not added",
      },
      {
        icon: <FiMapPin />,
        label: "Address",
        value: currentUser?.adress || "Not added",
      },
    ],
    [currentUser]
  );

  useEffect(() => {
    if (!isUpdated) return;

    toast.success("Profile updated successfully");
    dispatch(setUpdated(false));
  }, [dispatch, isUpdated]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Toaster />

      <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/25 bg-white/10 shadow-lg">
              <img
                src={currentUser?.profilePicture}
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                Account Overview
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                {currentUser?.username || "Your profile"}
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Manage your personal details and keep your trip information accurate.
              </p>
            </div>
          </div>

          <ProfileEdit />
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className={infoCardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
            Personal Details
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Your account information
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {profileSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="rounded-full bg-white p-2 text-slate-700 shadow-sm">
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                    {item.label}
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium leading-6 text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={infoCardClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
            Profile Tips
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Keep your account ready
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              Use the same phone number you want for booking confirmations and trip contact.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Keep your email current so ride receipts and booking details reach you.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Update your address when needed to keep your account details complete.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

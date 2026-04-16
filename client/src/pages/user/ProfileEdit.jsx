import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit3, FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import Modal from "../../components/CustomModal";
import { editUserProfile, setUpdated } from "../../redux/user/userSlice";
import { getApiUrl } from "../../utils/api";

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-200";
const errorClass = "mt-2 text-xs font-medium text-rose-500";

export default function ProfileEdit() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      phoneNumber: currentUser?.phoneNumber || "",
      adress: currentUser?.adress || "",
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      reset({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        phoneNumber: currentUser?.phoneNumber || "",
        adress: currentUser?.adress || "",
      });
    }
  }, [currentUser, isModalOpen, reset]);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (formData) => {
    try {
      setIsSaving(true);

      const res = await fetch(getApiUrl(`/api/user/editUserProfile/${currentUser._id}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Could not update profile");
      }

      dispatch(editUserProfile(data));
      dispatch(setUpdated(true));
      handleClose();
    } catch (error) {
      dispatch(setUpdated(false));
      toast.error(error.message || "Could not update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <FiEdit3 />
        Edit Profile
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        className="mx-4 w-full max-w-3xl rounded-[32px] bg-white shadow-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-t-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-8 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">
              Account Settings
            </p>
            <h2 className="mt-3 text-3xl font-bold">Update your profile</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Keep your contact details fresh so bookings and trip updates stay accurate.
            </p>
          </div>

          <div className="grid gap-6 px-8 py-8 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="username">
                Name
              </label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-5 text-slate-400" />
                <input
                  id="username"
                  className={`${inputClass} pl-11`}
                  {...register("username", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name should be at least 2 characters",
                    },
                  })}
                />
              </div>
              {errors.username && <p className={errorClass}>{errors.username.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  className={`${inputClass} pl-11`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="phoneNumber">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="pointer-events-none absolute left-4 top-5 text-slate-400" />
                <input
                  id="phoneNumber"
                  className={`${inputClass} pl-11`}
                  placeholder="9876543210"
                  {...register("phoneNumber", {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                />
              </div>
              {errors.phoneNumber && (
                <p className={errorClass}>{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="adress">
                Address
              </label>
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute left-4 top-5 text-slate-400" />
                <textarea
                  id="adress"
                  rows={4}
                  className={`${inputClass} resize-none pl-11`}
                  placeholder="Add your current address"
                  {...register("adress")}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Your profile updates are reflected across your bookings and account screens.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

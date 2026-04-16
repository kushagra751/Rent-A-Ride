import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "../../../index";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../../redux/user/userSlice";
import { getApiUrl } from "../../../utils/api";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "password required" }),
});

function AdminSignin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData, event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());

      const res = await fetch(getApiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      if (data?.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      if (!res.ok || !data?.isAdmin) {
        dispatch(loadingEnd());
        dispatch(signInFailure(data));
        return;
      }

      dispatch(signInSuccess(data));
      dispatch(loadingEnd());
      navigate("/adminDashboard");
    } catch (error) {
      dispatch(loadingEnd());
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(155deg,#eff6ff_0%,#ffffff_42%,#e2e8f0_100%)] px-4 py-16">
      <div className="mx-auto max-w-md overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
        <div className="bg-slate-950 px-7 py-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            Admin Access
          </p>
          <h1 className="mt-3 text-3xl font-bold">Sign in to admin panel</h1>
          <p className="mt-3 text-sm text-slate-300">
            Use the admin account to open the dashboard directly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-7 py-8">
          <div>
            <input
              type="text"
              id="email"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-black outline-none transition focus:border-slate-950"
              placeholder="Admin email"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              id="password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-black outline-none transition focus:border-slate-950"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            className={`${styles.button} w-full disabled:bg-slate-500 disabled:text-white`}
            disabled={isLoading}
          >
            {isLoading ? "Loading ..." : "Open Admin Panel"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/signin" className="text-blue-600">
              User sign in
            </Link>
            <p className="text-red-600">
              {isError ? isError.message || "something went wrong" : " "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSignin;

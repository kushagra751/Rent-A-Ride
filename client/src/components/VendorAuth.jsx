import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { app } from "../firebase";
import { loadingEnd, signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { getApiUrl } from "../utils/api";

const isFirebaseConfigured = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

export default function VendorOAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVendorGoogleClick = async () => {
    if (!isFirebaseConfigured) {
      const message =
        "Google sign-in is not configured yet. Add VITE_FIREBASE_API_KEY in client/.env.";
      dispatch(signInFailure({ message }));
      toast.error(message);
      return;
    }

    try {
      dispatch(signInStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch(getApiUrl("/api/vendor/vendorgoogle"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.isVendor) {
        dispatch(signInFailure(data));
        toast.error(data?.message || "Could not continue with Google");
        navigate("/vendorSignin");
        return;
      }

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data?.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      dispatch(signInSuccess(data));
      toast.success("Signed in with Google");
      navigate("/vendorDashboard");
    } catch (error) {
      const message = error?.message || "Could not login with Google";
      dispatch(signInFailure({ message }));
      toast.error(message);
    } finally {
      dispatch(loadingEnd());
    }
  };

  return (
    <div className="px-5">
      <button
        className="mb-4 flex w-full items-center justify-center gap-3 rounded-md border border-black py-3"
        type="button"
        onClick={handleVendorGoogleClick}
      >
        <span className="icon-[devicon--google]"></span>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

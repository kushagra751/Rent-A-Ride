import { toast } from "sonner";
import {
  setLatestBooking,
  setisPaymentDone,
} from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert } from "../../redux/user/userSlice";
import { getApiUrl } from "../../utils/api";

export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export const fetchLatestBooking = async (user_id, dispatch) => {
  try {
    const response = await fetch(getApiUrl("/api/user/latestbookings"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch latest booking");
    }

    const data = await response.json();
    dispatch(setLatestBooking(data));
    dispatch(setisPaymentDone(true));
    return data;
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    return null;
  }
};

export async function displayRazorpay(values, navigate, dispatch) {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    const viteKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const hasRazorpayKey = Boolean(viteKey);

    if (!hasRazorpayKey) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const dbData = {
        ...values,
        razorpayPaymentId: `mock_pay_${Date.now()}`,
        razorpayOrderId: `mock_order_${Date.now()}`,
        razorpaySignature: "mock_signature",
      };
      let bookedRes;
      try {
        bookedRes = await fetch(getApiUrl("/api/user/bookCar"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dbData),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
      const bookedJson = await bookedRes.json().catch(() => ({}));
      if (!bookedRes.ok) {
        return { ok: false, message: bookedJson?.message || "Booking failed" };
      }
      await fetchLatestBooking(values.user_id, dispatch);
      return {
        ok: true,
        mode: "mock",
        message: "Payment successful.",
      };
    }

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return { ok: false, message: "Razorpay SDK failed to load" };
    }

    const result = await fetch(getApiUrl("/api/user/razorpay"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken},${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await result.json().catch(() => ({}));

    if (!result.ok) {
      toast.error(data?.message || "Payment init failed");
      return { ok: false, message: data?.message || "Payment init failed" };
    }

    const { amount, id, currency } = data;

    if (!amount || !id || !currency) {
      return { ok: false, message: "Incomplete payment order received" };
    }

    const options = {
      key: viteKey,
      amount: amount.toString(),
      currency,
      name: "Rent a Ride",
      description: "Test Transaction",
      order_id: id,
      handler: async function (response) {
        const data = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const dbData = { ...values, ...data };
        const result = await fetch(getApiUrl("/api/user/bookCar"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dbData),
        });
        const successStatus = await result.json().catch(() => ({}));
        if (!result.ok) {
          toast.error(successStatus?.message || "Booking failed after payment");
          return;
        }

        dispatch(setIsSweetAlert(true));
        await fetchLatestBooking(values.user_id, dispatch);
        navigate("/");
      },
      prefill: {
        name: "Kushagra Patidar",
        email: "patidarkush751@gmail.com",
        contact: "7073554489",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    return { ok: true, mode: "razorpay" };
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    return { ok: false, message: error?.message || "Payment failed" };
  }
}

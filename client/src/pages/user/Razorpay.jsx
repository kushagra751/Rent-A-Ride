import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { Toaster, toast } from "sonner";
import { displayRazorpay } from "./razorpayActions";
import { setPageLoading } from "../../redux/user/userSlice";

const Razorpay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const orderData = state?.orderData;
  const paymentMode = state?.paymentMode || "test";
  const totalPrice = orderData?.totalPrice || 0;

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-xl text-center">
          <p className="text-xl font-semibold text-gray-900">Payment session expired</p>
          <p className="mt-3 text-sm text-gray-600">
            Start again from checkout to continue with payment.
          </p>
          <Link
            to="/checkoutPage"
            className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
          >
            Back to Checkout
          </Link>
        </div>
      </div>
    );
  }

  const handlePayNow = async () => {
    dispatch(setPageLoading(true));
    try {
      const response = await displayRazorpay(orderData, navigate, dispatch);

      if (!response?.ok) {
        toast.error(response?.message || "Payment failed");
        return;
      }

      if (response.mode === "mock") {
        toast.success("Payment successful.");
        navigate("/profile/orders", {
          state: {
            refreshOrders: Date.now(),
          },
        });
      }
    } catch (error) {
      toast.error(error?.message || "Payment failed");
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-green-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow"
            onClick={() => navigate("/checkoutPage")}
          >
            <FaArrowLeft />
            Back to Checkout
          </button>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                  <MdOutlinePayments className="text-2xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {paymentMode === "test" ? "Payment Method" : "Razorpay Payment"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {paymentMode === "test"
                      ? "Select a payment method and continue."
                      : "Continue with Razorpay payment."}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-gray-900">
                    <FaCreditCard />
                    <p className="font-semibold">Test Card</p>
                  </div>
                  <p className="mt-4 text-lg font-semibold tracking-wide">
                    4111 1111 1111 1111
                  </p>
                  <p className="mt-3 text-sm text-gray-600">Expiry: any future date</p>
                  <p className="text-sm text-gray-600">CVV: any 3 digits</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-gray-900">
                    <FaShieldAlt />
                    <p className="font-semibold">Test UPI</p>
                  </div>
                  <p className="mt-4 text-lg font-semibold">success@razorpay</p>
                  <p className="mt-3 text-sm text-gray-600">UPI payment option</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-orange-300 bg-orange-50 p-5">
                <p className="font-semibold text-gray-900">Available Methods</p>
                <p className="mt-2 text-sm text-gray-700">Card Payment</p>
                <p className="text-sm text-gray-700">UPI Payment</p>
                <p className="text-sm text-gray-700">Secure checkout flow</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-green-300">Order Summary</p>
              <p className="mt-4 text-3xl font-semibold">Rs. {totalPrice}</p>
              <div className="mt-8 space-y-4 text-sm text-slate-200">
                <div>
                  <p className="text-slate-400">Pickup</p>
                  <p>{orderData.pickup_location}</p>
                  <p>{new Date(orderData.pickupDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400">Dropoff</p>
                  <p>{orderData.dropoff_location}</p>
                  <p>{new Date(orderData.dropoffDate).toLocaleString()}</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-10 w-full rounded-2xl bg-green-400 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-green-300"
                onClick={handlePayNow}
              >
                {paymentMode === "test" ? "Pay Now" : "Continue to Pay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Razorpay;

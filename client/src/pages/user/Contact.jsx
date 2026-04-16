import { FaEnvelope, FaHeadset, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import Footers from "../../components/Footer";

const contactCards = [
  {
    title: "Customer Support",
    value: "support@rentaride.in",
    helper: "Bookings, reschedules, payment and order help.",
    href: "mailto:support@rentaride.in",
    icon: <FaEnvelope />,
  },
  {
    title: "Quick Call",
    value: "+91 90990 11223",
    helper: "Mon to Sat, 9:00 AM to 8:00 PM",
    href: "tel:+919099011223",
    icon: <FaPhoneAlt />,
  },
  {
    title: "Operations Desk",
    value: "Vendor and fleet assistance",
    helper: "Vehicle approvals, listing updates and account help.",
    href: "mailto:fleet@rentaride.in",
    icon: <FaHeadset />,
  },
];

function Contact() {
  return (
    <>
      <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-16 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                  Contact Us
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Reach the team behind bookings, support and fleet operations.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Whether you need help with a booking, want to onboard as a vendor, or need operational support, the right team is easy to reach from here.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {contactCards.map((card) => (
                    <a
                      key={card.title}
                      href={card.href}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-md"
                    >
                      <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                        {card.icon}
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-slate-950">{card.title}</h2>
                      <p className="mt-2 text-sm font-medium text-slate-700">{card.value}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{card.helper}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-slate-950 p-8 text-white">
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-lg text-green-300">
                  <FaMapMarkerAlt />
                </div>
                <h2 className="mt-5 text-2xl font-semibold">Visit our operations office</h2>
                <p className="mt-4 text-sm uppercase tracking-[0.28em] text-slate-400">Head Office</p>
                <div className="mt-3 space-y-1 text-base text-slate-200">
                  <p>Rent a Ride Mobility Services</p>
                  <p>3rd Floor, Alkapuri Business Hub</p>
                  <p>RC Dutt Road, Vadodara, Gujarat 390007</p>
                </div>

                <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Service Hours</p>
                  <p className="mt-3 text-lg font-semibold">Mon to Sat</p>
                  <p className="text-slate-300">9:00 AM to 8:00 PM</p>
                  <p className="mt-4 text-sm text-slate-400">
                    Sundays are reserved for scheduled callbacks and booking escalations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footers />
    </>
  );
}

export default Contact;

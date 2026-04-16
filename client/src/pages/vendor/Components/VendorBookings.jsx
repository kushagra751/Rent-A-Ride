import VendorBookingsTable from "./VendorBookingTable";
import VendorHeader from "./VendorHeader";

const VendorBookings = () => {
  return (
    <div className="rounded-2xl bg-slate-100 p-6">
      <VendorHeader category="Vendor Workspace" title="Bookings" />
      <VendorBookingsTable />
    </div>
  );
};

export default VendorBookings;

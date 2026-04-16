import bookingAlto from "../Assets/booking-alto.png";
import bookingIgnis from "../Assets/booking ignis.png";
import bookingSwift from "../Assets/booking swift lxi.jpeg";
import bookingWagonR from "../Assets/booking waganor.png";
import bookingWagonRBlue from "../Assets/booking waganor blue.png";
import vehicleModel1 from "../Assets/vehicleModel1.png";
import vehicleModel2 from "../Assets/vehicleModel2.png";
import vehicleModel3 from "../Assets/vehicleModel3.png";
import vehicleModel4 from "../Assets/vehicleModel4.png";
import vehicleModel5 from "../Assets/vehicleModel5.png";
import vehicleModel6 from "../Assets/vehicleModel6.png";

type VehicleLike = {
  image?: string[];
  model?: string;
  company?: string;
  name?: string;
};

function isRenderableImageUrl(url: string) {
  if (!url) return false;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return true;
  if (url.startsWith("/cars/") && url.endsWith(".svg")) return false;
  return /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(url);
}

export function getVehicleImage(v: VehicleLike | null | undefined): string {
  const first = v?.image?.[0];
  if (first && isRenderableImageUrl(first)) return first;

  const model = (v?.model || v?.name || "").toLowerCase();
  const company = (v?.company || "").toLowerCase();

  // Prefer the repo's car photos (Assets) so UI matches GitHub demo look.
  if (model.includes("swift")) return bookingSwift;
  if (model.includes("alto")) return bookingAlto;
  if (model.includes("ignis")) return bookingIgnis;
  if (model.includes("baleno")) return vehicleModel1;
  if (model.includes("creta")) return vehicleModel3;
  if (model.includes("venue")) return vehicleModel2;
  if (model.includes("nexon")) return vehicleModel5;
  if (model.includes("punch")) return vehicleModel6;
  if (model.includes("xuv300")) return vehicleModel4;
  if (model.includes("scorpio")) return vehicleModel3;
  if (model.includes("sonet")) return vehicleModel6;
  if (model.includes("seltos")) return vehicleModel2;
  if (model.includes("innova")) return vehicleModel4;
  if (model.includes("city")) return vehicleModel1;
  if (model.includes("wagon") || model.includes("waganor")) {
    return model.includes("blue") ? bookingWagonRBlue : bookingWagonR;
  }

  // Fallback by brand
  if (company.includes("skoda")) return vehicleModel4;
  if (company.includes("volkswagen") || company === "vw") return vehicleModel2;
  if (company.includes("maruti") || company.includes("maruthi")) return bookingSwift;
  if (company.includes("hyundai")) return "/cars/hyundai.svg";
  if (company.includes("tata")) return "/cars/tata.svg";
  if (company.includes("mahindra")) return "/cars/mahindra.svg";
  if (company.includes("kia")) return "/cars/kia.svg";
  if (company.includes("toyota")) return "/cars/toyota.svg";
  if (company.includes("honda")) return "/cars/honda.svg";

  // Last resort rotate through included images
  const pool = [vehicleModel1, vehicleModel2, vehicleModel3, vehicleModel4, vehicleModel5, vehicleModel6];
  return pool[0];
}


import bcryptjs from "bcryptjs";
import MasterData from "../models/masterDataModel.js";
import User from "../models/userModel.js";
import Vehicle from "../models/vehicleModel.js";
import Booking from "../models/BookingModel.js";
import { v4 as uuidv4 } from "uuid";

const vadodaraLocations = [
  { district: "Vadodara", location: "Alkapuri : Vadodara Junction", type: "location" },
  { district: "Vadodara", location: "Sayajigunj : Central Bus Depot", type: "location" },
  { district: "Vadodara", location: "Akota : Dmart Circle", type: "location" },
  { district: "Vadodara", location: "Gotri : Sevasi Road", type: "location" },
  { district: "Vadodara", location: "Manjalpur : Eva Mall", type: "location" },
  { district: "Vadodara", location: "Karelibaug : Amit Nagar Circle", type: "location" },
  { district: "Ahmedabad", location: "Kalupur : Ahmedabad Junction", type: "location" },
  { district: "Ahmedabad", location: "Navrangpura : CG Road", type: "location" },
  { district: "Ahmedabad", location: "SG Highway : Iskcon Cross Road", type: "location" },
  { district: "Surat", location: "Railway Station : Surat Junction", type: "location" },
  { district: "Surat", location: "Vesu : VR Mall", type: "location" },
  { district: "Surat", location: "Adajan : Pal RTO Circle", type: "location" },
  { district: "Anand", location: "Anand : Railway Station", type: "location" },
  { district: "Anand", location: "Vallabh Vidyanagar : H M Patel Circle", type: "location" },
  { district: "Anand", location: "Karamsad : Amul Dairy Road", type: "location" },
];

const masterCarEntries = [
  { model: "MARUTI SWIFT VXI AT", variant: "automatic", type: "car", brand: "maruti suzuki" },
  { model: "MARUTI BALENO ZETA MT", variant: "manual", type: "car", brand: "maruti suzuki" },
  { model: "HYUNDAI CRETA SX IVT", variant: "automatic", type: "car", brand: "hyundai" },
  { model: "HYUNDAI VENUE S(O) TURBO", variant: "manual", type: "car", brand: "hyundai" },
  { model: "TATA NEXON CREATIVE PLUS AMT", variant: "automatic", type: "car", brand: "tata" },
  { model: "TATA PUNCH ACCOMPLISHED MT", variant: "manual", type: "car", brand: "tata" },
  { model: "MAHINDRA XUV300 W8 DIESEL AMT", variant: "automatic", type: "car", brand: "mahindra" },
  { model: "MAHINDRA SCORPIO N Z8 AT", variant: "automatic", type: "car", brand: "mahindra" },
  { model: "KIA SONET HTX DCT", variant: "automatic", type: "car", brand: "kia" },
  { model: "KIA SELTOS HTK PLUS IVT", variant: "automatic", type: "car", brand: "kia" },
  { model: "TOYOTA INNOVA CRYSTA GX 7 STR", variant: "manual", type: "car", brand: "toyota" },
  { model: "HONDA CITY VX CVT", variant: "automatic", type: "car", brand: "honda" },
];

function buildMasterData() {
  return [
    ...vadodaraLocations.map((item) => ({ id: uuidv4(), ...item })),
    ...masterCarEntries.map((item) => ({ id: uuidv4(), ...item })),
  ];
}

function brandImage(brand) {
  const b = String(brand || "").toLowerCase();
  if (b.includes("maruti") || b.includes("maruthi")) return "/cars/maruthi.svg";
  if (b.includes("hyundai")) return "/cars/hyundai.svg";
  if (b.includes("tata")) return "/cars/tata.svg";
  if (b.includes("mahindra")) return "/cars/mahindra.svg";
  if (b.includes("kia")) return "/cars/kia.svg";
  if (b.includes("toyota")) return "/cars/toyota.svg";
  if (b.includes("honda")) return "/cars/honda.svg";
  if (b.includes("skoda")) return "/cars/skoda.svg";
  if (b.includes("volkswagen") || b === "vw") return "/cars/volkswagen.svg";
  return "/car-placeholder.svg";
}

function registration(prefix, index) {
  return `GJ-06-${prefix}${String(index + 1).padStart(4, "0")}`;
}

function demoVehiclesFromLocations(locations) {
  const picks = locations.length > 0 ? locations : vadodaraLocations;
  const specs = [
    {
      registeration_number: registration("AA", 0),
      name: "Swift",
      model: "MARUTI SWIFT VXI AT",
      company: "maruti suzuki",
      year_made: 2023,
      fuel_type: "petrol",
      seats: 5,
      transmition: "automatic",
      price: 2199,
      base_package: "8 Hours / 80 km",
      car_type: "hatchback",
      car_title: "Maruti Suzuki Swift automatic for city drives",
      car_description:
        "Compact premium hatchback with automatic transmission, rear camera, touchscreen infotainment and excellent fuel efficiency for urban travel in Vadodara.",
      locationIndex: 0,
    },
    {
      registeration_number: registration("AB", 1),
      name: "Baleno",
      model: "MARUTI BALENO ZETA MT",
      company: "maruti suzuki",
      year_made: 2024,
      fuel_type: "petrol",
      seats: 5,
      transmition: "manual",
      price: 2399,
      base_package: "12 Hours / 120 km",
      car_type: "hatchback",
      car_title: "Maruti Baleno premium hatchback",
      car_description:
        "Spacious premium hatchback with a large boot, smooth manual gearbox and a comfortable cabin for daily use and weekend trips.",
      locationIndex: 1,
    },
    {
      registeration_number: registration("AC", 2),
      name: "Creta",
      model: "HYUNDAI CRETA SX IVT",
      company: "hyundai",
      year_made: 2024,
      fuel_type: "petrol",
      seats: 5,
      transmition: "automatic",
      price: 3499,
      base_package: "24 Hours / 200 km",
      car_type: "suv",
      car_title: "Hyundai Creta automatic SUV",
      car_description:
        "Popular midsize SUV with automatic transmission, panoramic comfort, premium interior and strong highway manners.",
      locationIndex: 2,
    },
    {
      registeration_number: registration("AD", 3),
      name: "Venue",
      model: "HYUNDAI VENUE S(O) TURBO",
      company: "hyundai",
      year_made: 2023,
      fuel_type: "petrol",
      seats: 5,
      transmition: "manual",
      price: 2799,
      base_package: "12 Hours / 120 km",
      car_type: "suv",
      car_title: "Hyundai Venue turbo petrol",
      car_description:
        "Smart compact SUV with responsive turbo petrol engine, connected features and easy city maneuverability.",
      locationIndex: 3,
    },
    {
      registeration_number: registration("AE", 4),
      name: "Nexon",
      model: "TATA NEXON CREATIVE PLUS AMT",
      company: "tata",
      year_made: 2024,
      fuel_type: "petrol",
      seats: 5,
      transmition: "automatic",
      price: 3099,
      base_package: "24 Hours / 200 km",
      car_type: "suv",
      car_title: "Tata Nexon automatic SUV",
      car_description:
        "Five-star safety focused compact SUV with AMT convenience, modern dashboard and comfortable suspension setup.",
      locationIndex: 4,
    },
    {
      registeration_number: registration("AF", 5),
      name: "Punch",
      model: "TATA PUNCH ACCOMPLISHED MT",
      company: "tata",
      year_made: 2023,
      fuel_type: "petrol",
      seats: 5,
      transmition: "manual",
      price: 2599,
      base_package: "12 Hours / 120 km",
      car_type: "suv",
      car_title: "Tata Punch compact SUV",
      car_description:
        "Compact SUV ideal for city commutes with commanding seating position, practical cabin space and light steering.",
      locationIndex: 5,
    },
    {
      registeration_number: registration("AG", 6),
      name: "XUV300",
      model: "MAHINDRA XUV300 W8 DIESEL AMT",
      company: "mahindra",
      year_made: 2022,
      fuel_type: "diesel",
      seats: 5,
      transmition: "automatic",
      price: 3299,
      base_package: "24 Hours / 200 km",
      car_type: "suv",
      car_title: "Mahindra XUV300 diesel automatic",
      car_description:
        "Torquey diesel compact SUV with strong mid-range performance, spacious cabin and stable highway ride quality.",
      locationIndex: 0,
    },
    {
      registeration_number: registration("AH", 7),
      name: "Scorpio N",
      model: "MAHINDRA SCORPIO N Z8 AT",
      company: "mahindra",
      year_made: 2024,
      fuel_type: "petrol",
      seats: 7,
      transmition: "automatic",
      price: 4699,
      base_package: "24 Hours / 220 km",
      car_type: "suv",
      car_title: "Mahindra Scorpio N seven-seater",
      car_description:
        "Large body-on-frame SUV with commanding road presence, comfortable seating for seven and premium automatic convenience.",
      locationIndex: 1,
    },
    {
      registeration_number: registration("AJ", 8),
      name: "Sonet",
      model: "KIA SONET HTX DCT",
      company: "kia",
      year_made: 2024,
      fuel_type: "petrol",
      seats: 5,
      transmition: "automatic",
      price: 3199,
      base_package: "12 Hours / 120 km",
      car_type: "suv",
      car_title: "Kia Sonet DCT urban SUV",
      car_description:
        "Feature-rich compact SUV with quick DCT gearbox, ventilated comfort and an upscale interior layout.",
      locationIndex: 2,
    },
    {
      registeration_number: registration("AK", 9),
      name: "Seltos",
      model: "KIA SELTOS HTK PLUS IVT",
      company: "kia",
      year_made: 2023,
      fuel_type: "petrol",
      seats: 5,
      transmition: "automatic",
      price: 3899,
      base_package: "24 Hours / 220 km",
      car_type: "suv",
      car_title: "Kia Seltos automatic SUV",
      car_description:
        "Premium midsize SUV with roomy cabin, smooth IVT automatic and excellent ride comfort for long drives.",
      locationIndex: 3,
    },
    {
      registeration_number: registration("AL", 10),
      name: "Innova Crysta",
      model: "TOYOTA INNOVA CRYSTA GX 7 STR",
      company: "toyota",
      year_made: 2022,
      fuel_type: "diesel",
      seats: 7,
      transmition: "manual",
      price: 4999,
      base_package: "24 Hours / 250 km",
      car_type: "suv",
      car_title: "Toyota Innova Crysta for family travel",
      car_description:
        "Trusted MPV with seven seats, reliable diesel engine and a spacious cabin ideal for airport and family travel.",
      locationIndex: 4,
    },
    {
      registeration_number: registration("AM", 11),
      name: "City",
      model: "HONDA CITY VX CVT",
      company: "honda",
      year_made: 2024,
      fuel_type: "petrol",
      seats: 5,
      transmition: "automatic",
      price: 3599,
      base_package: "24 Hours / 200 km",
      car_type: "sedan",
      car_title: "Honda City CVT executive sedan",
      car_description:
        "Refined sedan with spacious rear seat comfort, smooth CVT transmission and premium interior finish.",
      locationIndex: 5,
    },
  ];

  const generatedFleet = [];
  const waveCount = 2;

  for (let wave = 0; wave < waveCount; wave += 1) {
    picks.forEach((pickedLocation, locationIndex) => {
      const spec = specs[(locationIndex + wave * 5) % specs.length];
      const inventoryIndex = wave * picks.length + locationIndex;

      generatedFleet.push({
        ...spec,
        registeration_number: registration("RA", inventoryIndex),
        with_or_without_fuel: true,
        image: [brandImage(spec.company)],
        isDeleted: "false",
        isBooked: false,
        isAdminApproved: true,
        isAdminAdded: true,
        addedBy: "admin",
        location: pickedLocation.location,
        district: pickedLocation.district,
      });
    });
  }

  return generatedFleet;
}

function looksLikeLegacyMasterData(locations) {
  const text = locations.map((item) => `${item.district} ${item.location}`).join(" ").toLowerCase();
  return (
    /kochi|kottayam|trivandrum|thrissur|calicut/.test(text) ||
    !text.includes("vadodara") ||
    !text.includes("ahmedabad") ||
    !text.includes("surat") ||
    !text.includes("anand")
  );
}

async function ensureVadodaraMasterData() {
  const locations = await MasterData.find({ type: "location" }).lean();
  if (locations.length === 0 || looksLikeLegacyMasterData(locations)) {
    await MasterData.deleteMany({});
    await MasterData.insertMany(buildMasterData());
    return buildMasterData().filter((item) => item.type === "location");
  }
  return locations;
}

function looksLikeLegacyVehicleSeed(vehicles) {
  if (vehicles.length === 0) return true;
  if (vehicles.length < 10) return true;
  return vehicles.every(
    (vehicle) =>
      ["Kochi", "Kottayam", "Thrissur", "Trivandrum", "Calicut"].includes(vehicle.district) ||
      /^KL-|^VN-/.test(vehicle.registeration_number || "")
  );
}

export async function ensureLocalSeed() {
  let seeded = false;
  const isProduction = process.env.NODE_ENV === "production";
  const existingVehicleCount = await Vehicle.countDocuments();
  const existingMasterDataCount = await MasterData.countDocuments();

  if (isProduction && existingVehicleCount > 0 && existingMasterDataCount > 0) {
    return { seeded: false };
  }

  const locations = await ensureVadodaraMasterData();
  const targetAdminFleet = demoVehiclesFromLocations(locations);

  const userCount = await User.countDocuments({ isVendor: true });

  if (existingVehicleCount === 0) {
    await Vehicle.insertMany(targetAdminFleet);
    seeded = true;
  } else {
    const adminVehicles = await Vehicle.find({ addedBy: "admin" }).lean();
    if (adminVehicles.length > 0 && looksLikeLegacyVehicleSeed(adminVehicles)) {
      await Vehicle.deleteMany({ addedBy: "admin" });
      await Vehicle.insertMany(targetAdminFleet);
      seeded = true;
    } else {
      const districtCoverage = new Set(adminVehicles.map((vehicle) => vehicle.district));
      const allDistrictsCovered = ["Vadodara", "Ahmedabad", "Surat", "Anand"].every(
        (district) => districtCoverage.has(district)
      );
      const existingRegistrations = new Set(
        adminVehicles.map((vehicle) => vehicle.registeration_number)
      );
      const missingVehicles = targetAdminFleet.filter(
        (vehicle) => !existingRegistrations.has(vehicle.registeration_number)
      );

      if (!allDistrictsCovered || adminVehicles.length < targetAdminFleet.length) {
        if (missingVehicles.length > 0) {
          await Vehicle.insertMany(missingVehicles);
          seeded = true;
        }
      }
    }
  }

  await Vehicle.updateMany(
    {
      $or: [{ image: { $size: 0 } }, { image: { $elemMatch: { $regex: "car-placeholder\\.svg" } } }],
    },
    [
      {
        $set: {
          image: [
            {
              $switch: {
                branches: [
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "maruti|maruthi" } }, then: "/cars/maruthi.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "hyundai" } }, then: "/cars/hyundai.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "tata" } }, then: "/cars/tata.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "mahindra" } }, then: "/cars/mahindra.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "kia" } }, then: "/cars/kia.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "toyota" } }, then: "/cars/toyota.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "honda" } }, then: "/cars/honda.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "skoda" } }, then: "/cars/skoda.svg" },
                  { case: { $regexMatch: { input: { $toLower: "$company" }, regex: "volkswagen|\\bvw\\b" } }, then: "/cars/volkswagen.svg" },
                ],
                default: "/car-placeholder.svg",
              },
            },
          ],
        },
      },
    ]
  );

  if (userCount === 0) {
    const hadshedPassword = bcryptjs.hashSync("vendor123", 10);
    await User.create({
      username: "demo_vendor",
      email: "vendor@demo.com",
      phoneNumber: "9999999999",
      password: hadshedPassword,
      isVendor: true,
    });
    seeded = true;
  }

  const demoVendor = await User.findOne({ email: "vendor@demo.com", isVendor: true }).lean();
  if (demoVendor) {
    const vendorVehicleCount = await Vehicle.countDocuments({
      addedBy: String(demoVendor._id),
      isDeleted: "false",
      isAdminAdded: { $in: [false, "false"] },
    });
    if (vendorVehicleCount === 0) {
      const loc = locations[0] ?? vadodaraLocations[0];
      const now = Date.now();
      const v = await Vehicle.create({
        registeration_number: `GJ-06-VD${String(now % 10000).padStart(4, "0")}`,
        company: "hyundai",
        name: "Creta (Vendor)",
        model: "HYUNDAI CRETA SX IVT",
        year_made: 2023,
        fuel_type: "petrol",
        seats: 5,
        transmition: "automatic",
        price: 3399,
        base_package: "Vendor",
        with_or_without_fuel: true,
        car_type: "suv",
        car_title: "Hyundai Creta vendor listing",
        car_description: "Approved vendor SUV listing for local development flows.",
        image: [brandImage("hyundai")],
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: false,
        addedBy: String(demoVendor._id),
        isAdminApproved: true,
        isRejected: false,
        location: loc.location,
        district: loc.district,
      });
      await Booking.create({
        vehicleId: v._id,
        pickupDate: new Date(),
        dropOffDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        userId: demoVendor._id,
        pickUpLocation: v.location,
        dropOffLocation: v.location,
        totalPrice: 6798,
        razorpayOrderId: `mock_order_${Date.now()}`,
        razorpayPaymentId: `mock_pay_${Date.now()}`,
        status: "booked",
      });
      seeded = true;
    }
  }

  return { seeded };
}

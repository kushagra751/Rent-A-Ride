import mongoose from "mongoose";
import MasterData from "../../models/masterDataModel.js";
import { v4 as uuidv4 } from "uuid";
import { errorHandler } from "../../utils/error.js";

const dummyData = [
  { id: uuidv4(), district: "Vadodara", location: "Alkapuri : Vadodara Junction", type: "location" },
  { id: uuidv4(), district: "Vadodara", location: "Sayajigunj : Central Bus Depot", type: "location" },
  { id: uuidv4(), district: "Vadodara", location: "Akota : Dmart Circle", type: "location" },
  { id: uuidv4(), district: "Vadodara", location: "Gotri : Sevasi Road", type: "location" },
  { id: uuidv4(), district: "Vadodara", location: "Manjalpur : Eva Mall", type: "location" },
  { id: uuidv4(), district: "Vadodara", location: "Karelibaug : Amit Nagar Circle", type: "location" },
  { id: uuidv4(), district: "Ahmedabad", location: "Kalupur : Ahmedabad Junction", type: "location" },
  { id: uuidv4(), district: "Ahmedabad", location: "Navrangpura : CG Road", type: "location" },
  { id: uuidv4(), district: "Ahmedabad", location: "SG Highway : Iskcon Cross Road", type: "location" },
  { id: uuidv4(), district: "Surat", location: "Railway Station : Surat Junction", type: "location" },
  { id: uuidv4(), district: "Surat", location: "Vesu : VR Mall", type: "location" },
  { id: uuidv4(), district: "Surat", location: "Adajan : Pal RTO Circle", type: "location" },
  { id: uuidv4(), district: "Anand", location: "Anand : Railway Station", type: "location" },
  { id: uuidv4(), district: "Anand", location: "Vallabh Vidyanagar : H M Patel Circle", type: "location" },
  { id: uuidv4(), district: "Anand", location: "Karamsad : Amul Dairy Road", type: "location" },

  { id: uuidv4(), model: "MARUTI SWIFT VXI AT", variant: "automatic", type: "car", brand: "maruti suzuki" },
  { id: uuidv4(), model: "MARUTI BALENO ZETA MT", variant: "manual", type: "car", brand: "maruti suzuki" },
  { id: uuidv4(), model: "HYUNDAI CRETA SX IVT", variant: "automatic", type: "car", brand: "hyundai" },
  { id: uuidv4(), model: "HYUNDAI VENUE S(O) TURBO", variant: "manual", type: "car", brand: "hyundai" },
  { id: uuidv4(), model: "TATA NEXON CREATIVE PLUS AMT", variant: "automatic", type: "car", brand: "tata" },
  { id: uuidv4(), model: "TATA PUNCH ACCOMPLISHED MT", variant: "manual", type: "car", brand: "tata" },
  { id: uuidv4(), model: "MAHINDRA XUV300 W8 DIESEL AMT", variant: "automatic", type: "car", brand: "mahindra" },
  { id: uuidv4(), model: "MAHINDRA SCORPIO N Z8 AT", variant: "automatic", type: "car", brand: "mahindra" },
  { id: uuidv4(), model: "KIA SONET HTX DCT", variant: "automatic", type: "car", brand: "kia" },
  { id: uuidv4(), model: "KIA SELTOS HTK PLUS IVT", variant: "automatic", type: "car", brand: "kia" },
  { id: uuidv4(), model: "TOYOTA INNOVA CRYSTA GX 7 STR", variant: "manual", type: "car", brand: "toyota" },
  { id: uuidv4(), model: "HONDA CITY VX CVT", variant: "automatic", type: "car", brand: "honda" },
];

function shouldResetMasterData(existingItems) {
  const locations = existingItems.filter((item) => item.type === "location");
  const text = locations.map((item) => `${item.district} ${item.location}`).join(" ").toLowerCase();
  return (
    locations.length === 0 ||
    /kochi|kottayam|trivandrum|thrissur|calicut/.test(text) ||
    !text.includes("vadodara") ||
    !text.includes("ahmedabad") ||
    !text.includes("surat") ||
    !text.includes("anand")
  );
}

export async function insertDummyData() {
  try {
    await MasterData.deleteMany({});
    await MasterData.insertMany(dummyData);
    console.log("Dummy data inserted successfully.");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  } finally {
    mongoose.disconnect();
  }
}

export const getCarModelData = async (req, res, next) => {
  try {
    const existingItems = await MasterData.find().lean();
    if (shouldResetMasterData(existingItems)) {
      await MasterData.deleteMany({});
      await MasterData.insertMany(dummyData);
    }

    const availableVehicleModels = await MasterData.find();
    res.status(200).json(availableVehicleModels);
  } catch (error) {
    next(errorHandler(500, { "could not get model Data": error }));
  }
};

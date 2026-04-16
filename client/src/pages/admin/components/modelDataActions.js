import {
  setCompanyData,
  setDistrictData,
  setLocationData,
  setModelData,
} from "../../../redux/adminSlices/adminDashboardSlice/CarModelDataSlice";
import { setWholeData } from "../../../redux/user/selectRideSlice";
import { getApiUrl } from "../../../utils/api";

export const fetchModelData = async (dispatch) => {
  try {
    const res = await fetch(getApiUrl("/api/admin/getVehicleModels"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();

      const models = data.filter((cur) => cur.type === "car").map((cur) => cur.model);
      dispatch(setModelData(models));

      const brand = data.filter((cur) => cur.type === "car").map((cur) => cur.brand);
      const uniqueBrand = brand.filter((cur, index) => {
        return brand.indexOf(cur) === index;
      });
      dispatch(setCompanyData(uniqueBrand));

      const locations = data.filter((cur) => cur.type === "location").map((cur) => cur.location);
      dispatch(setLocationData(locations));

      const districts = data.filter((cur) => cur.type === "location").map((cur) => cur.district);
      const uniqueDistricts = districts.filter((cur, idx) => {
        return districts.indexOf(cur) === idx;
      });
      dispatch(setDistrictData(uniqueDistricts));

      const wholeData = data.filter((cur) => cur.type === "location");
      dispatch(setWholeData(wholeData));
    } else {
      return "no data found";
    }
  } catch (error) {
    console.log(error);
  }
};

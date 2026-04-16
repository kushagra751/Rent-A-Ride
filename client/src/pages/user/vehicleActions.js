import { signOut } from "../../redux/user/userSlice";
import { setVehicleDetail } from "../../redux/user/listAllVehicleSlice";
import { getApiUrl } from "../../utils/api";

export const onVehicleDetail = async (id, dispatch, navigate) => {
  try {
    const res = await fetch(getApiUrl("/api/user/showVehicleDetails"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (data.statusCode == 401 || data.statusCode == 403) {
      dispatch(signOut());
      return;
    }

    dispatch(setVehicleDetail(data));
    navigate("/vehicleDetails");
  } catch (error) {
    console.log(error);
  }
};

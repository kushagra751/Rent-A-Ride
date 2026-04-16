import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaFilter } from "react-icons/fa";
import { FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { setFilteredData } from "../redux/user/sortfilterSlice";

const baseSections = [
  {
    title: "Body Type",
    key: "car_type",
    options: ["suv", "sedan", "hatchback", "mpv"],
  },
  {
    title: "Transmission",
    key: "transmition",
    options: ["automatic", "manual"],
  },
  {
    title: "Fuel",
    key: "fuel_type",
    options: ["petrol", "diesel", "hybrid"],
  },
  {
    title: "Seats",
    key: "seats",
    options: ["5", "7"],
  },
];

const titleCase = (value) =>
  String(value || "")
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const normalize = (value) => String(value ?? "").trim().toLowerCase();

const getOptionCount = (vehicles, key, option) =>
  vehicles.filter((vehicle) => normalize(vehicle?.[key]) === normalize(option)).length;

const Filter = () => {
  const { userAllVehicles, allVariants } = useSelector((state) => state.userListVehicles);
  const { variantMode } = useSelector((state) => state.sortfilterSlice);
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [openSections, setOpenSections] = useState({
    car_type: true,
    transmition: true,
    fuel_type: true,
    seats: true,
    company: true,
    district: true,
  });

  const sourceVehicles = useMemo(() => {
    const base = variantMode && Array.isArray(allVariants) ? allVariants : userAllVehicles;
    return Array.isArray(base) ? base : [];
  }, [allVariants, userAllVehicles, variantMode]);

  const sections = useMemo(() => {
    const companies = [...new Set(sourceVehicles.map((vehicle) => vehicle.company).filter(Boolean))].sort();
    const districts = [...new Set(sourceVehicles.map((vehicle) => vehicle.district).filter(Boolean))].sort();

    return [
      ...baseSections,
      { title: "Brand", key: "company", options: companies },
      { title: "District", key: "district", options: districts },
    ].filter((section) => section.options.length > 0);
  }, [sourceVehicles]);

  const activeFilterCount = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (total, values) => total + (Array.isArray(values) ? values.length : 0),
        0
      ),
    [selectedFilters]
  );

  useEffect(() => {
    setSelectedFilters({});
    dispatch(setFilteredData(sourceVehicles));
  }, [dispatch, sourceVehicles]);

  useEffect(() => {
    if (!activeFilterCount) {
      dispatch(setFilteredData(sourceVehicles));
      return;
    }

    const filteredVehicles = sourceVehicles.filter((vehicle) =>
      Object.entries(selectedFilters).every(([key, values]) => {
        if (!values?.length) return true;
        const fieldValue = normalize(vehicle?.[key]);
        return values.some((value) => fieldValue === normalize(value));
      })
    );

    dispatch(setFilteredData(filteredVehicles));
  }, [activeFilterCount, dispatch, selectedFilters, sourceVehicles]);

  const toggleFilterValue = (key, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[key] || [];
      const alreadySelected = currentValues.includes(value);
      const nextValues = alreadySelected
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      if (nextValues.length === 0) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }

      return {
        ...prev,
        [key]: nextValues,
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
    dispatch(setFilteredData(sourceVehicles));
  };

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <aside className="sticky top-5 scroll-m-9">
      <div className="mx-auto flex max-w-[320px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:max-w-[350px]">
        <div className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-green-700 px-5 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-green-200">
                <FaFilter />
                Filter Cars
              </div>
              <h2 className="mt-2 text-xl font-semibold">Refine your shortlist</h2>
              <p className="mt-2 text-sm text-slate-200">
                Narrow the catalog by body type, fuel, seats, brand and district.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <FiChevronDown
                className={`transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Active Filters</p>
              <p className="mt-1 text-2xl font-semibold">{activeFilterCount}</p>
            </div>
            {activeFilterCount > 0 ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900"
                onClick={clearFilters}
              >
                <FiRefreshCw />
                Clear All
              </button>
            ) : (
              <div className="rounded-full border border-white/15 px-4 py-2 text-xs text-slate-200">
                All vehicles visible
              </div>
            )}
          </div>
        </div>

        <div className={`${mobileOpen ? "block" : "hidden"} lg:block`}>
          <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
            {sections.map((section) => (
              <div key={section.key} className="border-b border-slate-100 py-3 last:border-b-0">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 py-1 text-left"
                  onClick={() => toggleSection(section.key)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                    <p className="text-xs text-slate-500">
                      {selectedFilters[section.key]?.length || 0} selected
                    </p>
                  </div>
                  <FiChevronDown
                    className={`text-slate-500 transition-transform duration-200 ${
                      openSections[section.key] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openSections[section.key] && (
                  <div className="mt-3 space-y-2">
                    {section.options.map((option) => {
                      const optionCount = getOptionCount(sourceVehicles, section.key, option);
                      const checked = selectedFilters[section.key]?.includes(option) ?? false;

                      return (
                        <label
                          key={`${section.key}-${option}`}
                          className={`flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-3 text-sm transition ${
                            checked
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                                checked
                                  ? "border-white bg-white text-slate-900"
                                  : "border-slate-300 bg-white text-transparent"
                              }`}
                            >
                              <FaCheckCircle />
                            </span>
                            <span>{titleCase(option)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs ${checked ? "text-slate-200" : "text-slate-400"}`}>
                              {optionCount}
                            </span>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={checked}
                              onChange={() => toggleFilterValue(section.key, option)}
                            />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Filter;

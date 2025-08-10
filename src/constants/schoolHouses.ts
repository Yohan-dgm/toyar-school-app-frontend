export interface SchoolHouse {
  id: string;
  name: string;
  description: string;
  element: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: [string, string];
    background: string;
  };
  icon: string;
  motto: string;
}

export const SCHOOL_HOUSES: SchoolHouse[] = [
  {
    id: "vulcan",
    name: "Vulcan",
    description: "House of Fire and Passion",
    element: "Fire",
    colors: {
      primary: "#E53E3E",
      secondary: "#FC8181",
      accent: "#FEB2B2",
      gradient: ["#E53E3E", "#FC8181"],
      background: "#FFF5F5",
    },
    icon: "local-fire-department",
    motto: "Through flame, we forge strength",
  },
  {
    id: "tellus",
    name: "Tellus",
    description: "House of Earth and Growth",
    element: "Earth",
    colors: {
      primary: "#38A169",
      secondary: "#68D391",
      accent: "#9AE6B4",
      gradient: ["#38A169", "#68D391"],
      background: "#F0FFF4",
    },
    icon: "nature",
    motto: "Rooted in wisdom, growing in knowledge",
  },
  {
    id: "eurus",
    name: "Eurus",
    description: "House of Air and Freedom",
    element: "Air",
    colors: {
      primary: "#3182CE",
      secondary: "#63B3ED",
      accent: "#90CDF4",
      gradient: ["#3182CE", "#63B3ED"],
      background: "#EBF8FF",
    },
    icon: "air",
    motto: "Like wind, we rise above all challenges",
  },
  {
    id: "calypso",
    name: "Calypso",
    description: "House of Water and Adaptability",
    element: "Water",
    colors: {
      primary: "#00B5D8",
      secondary: "#00D9F5",
      accent: "#9DECF9",
      gradient: ["#00B5D8", "#00D9F5"],
      background: "#E6FFFA",
    },
    icon: "waves",
    motto: "Flow with grace, adapt with wisdom",
  },
];

export const getHouseById = (id: string): SchoolHouse | undefined => {
  return SCHOOL_HOUSES.find((house) => house.id === id);
};

export const getHouseByName = (name: string): SchoolHouse | undefined => {
  return SCHOOL_HOUSES.find(
    (house) => house.name.toLowerCase() === name.toLowerCase(),
  );
};

export const HOUSE_COLORS = {
  vulcan: "#E53E3E",
  tellus: "#38A169",
  eurus: "#3182CE",
  calypso: "#00B5D8",
};

// Profile border colors as requested by user
export const HOUSE_PROFILE_COLORS = {
  vulcan: "#FF8C00", // Orange
  tellus: "#FFD700", // Yellow
  eurus: "#1E90FF", // Blue
  calypso: "#32CD32", // Green
};

// Utility function to get house profile border color by house name
export const getHouseProfileColor = (houseData: string | { name?: string } | null | undefined): string => {
  if (!houseData) return "#E5E7EB"; // Default gray if no house data
  
  let houseName: string;
  
  // Handle both string and object formats
  if (typeof houseData === 'string') {
    houseName = houseData;
  } else if (typeof houseData === 'object' && houseData.name) {
    houseName = houseData.name;
  } else {
    return "#E5E7EB"; // Default gray for invalid data
  }
  
  const normalizedName = houseName.toLowerCase().trim();
  
  switch (normalizedName) {
    case "vulcan":
      return HOUSE_PROFILE_COLORS.vulcan;
    case "tellus":
      return HOUSE_PROFILE_COLORS.tellus;
    case "eurus":
      return HOUSE_PROFILE_COLORS.eurus;
    case "calypso":
      return HOUSE_PROFILE_COLORS.calypso;
    default:
      return "#E5E7EB"; // Default gray for unknown houses
  }
};

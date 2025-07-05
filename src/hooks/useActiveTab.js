import { usePathname } from "expo-router";

export const useActiveTab = () => {
  const pathname = usePathname();

  // Map routes to tab IDs
  const routeToTab = {
    "/authenticated/parent": "schoolLife", // Default route shows School Life
    "/authenticated/parent/school-life": "schoolLife",
    "/authenticated/parent/educator-feedback": "feedback",
    "/authenticated/parent/calendar": "calendar",
    "/authenticated/parent/academic": "academic",
    "/authenticated/parent/performance": "performance",
  };

  return routeToTab[pathname] || "schoolLife";
};

export default useActiveTab;

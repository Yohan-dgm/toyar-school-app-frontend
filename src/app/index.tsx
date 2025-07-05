import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/state-store/store";

export default function IndexScreen() {
  const { isAuthenticated, sessionData } = useSelector(
    (state: RootState) => state.app
  );

  // If authenticated, redirect to appropriate role-based screen
  if (isAuthenticated && sessionData) {
    const userRole =
      (sessionData as any)?.user_role || (sessionData as any)?.role;
    switch (userRole) {
      case "parent":
        return <Redirect href="/authenticated/parent" />;
      case "educator":
        return <Redirect href="/authenticated/educator" />;
      case "student":
        return <Redirect href="/authenticated/student" />;
      default:
        return <Redirect href="/authenticated/parent" />;
    }
  }

  // If not authenticated, redirect to public area
  return <Redirect href="/public" />;
}

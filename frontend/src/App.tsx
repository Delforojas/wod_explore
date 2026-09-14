import { useEffect, useState } from "react";

import { parseRoute, type Route } from "./app/router";
import { useAuth } from "./auth/useAuth";
import { Layout } from "./components/Layout";
import { LoadingMessage } from "./components/StateMessage";
import { AuthPage } from "./pages/AuthPage";
import { ExerciseDetailPage } from "./pages/ExerciseDetailPage";
import { ExercisesPage } from "./pages/ExercisesPage";
import { CreateWodPage } from "./pages/CreateWodPage";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { EditWodPage } from "./pages/EditWodPage";
import { MyWodDetailPage } from "./pages/MyWodDetailPage";
import { MyWodsPage } from "./pages/MyWodsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { WodDetailPage } from "./pages/WodDetailPage";
import { WodsPage } from "./pages/WodsPage";

function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));
  const { isLoading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (isLoading) return <LoadingMessage />;

  function renderPage() {
    switch (route.page) {
      case "home": return <HomePage />;
      case "login": return <AuthPage mode="login" />;
      case "register": return <AuthPage mode="register" />;
      case "wods": return <WodsPage />;
      case "create-wod": return <CreateWodPage />;
      case "my-wods": return <MyWodsPage deletionFeedback={route.feedback === "deleted"} />;
      case "my-wod-detail": return <MyWodDetailPage id={route.id} />;
      case "my-wod-edit": return <EditWodPage id={route.id} />;
      case "wod-detail": return <WodDetailPage id={route.id} />;
      case "exercises": return <ExercisesPage />;
      case "exercise-detail": return <ExerciseDetailPage id={route.id} />;
      case "history": return <HistoryPage />;
      case "profile": return <ProfilePage />;
      case "statistics": return <StatisticsPage />;
    }
  }

  return <Layout currentPage={route.page}>{renderPage()}</Layout>;
}

export default App;

import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { QueuePage } from "./pages/QueuePage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuditPage } from "./pages/AuditPage";
import { PolicyRulesPage } from "./pages/PolicyRulesPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/app", element: <QueuePage /> },
  { path: "/app/applications/:id", element: <ProfilePage /> },
  { path: "/app/applications/:id/audit", element: <AuditPage /> },
  { path: "/app/policy-rules", element: <PolicyRulesPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

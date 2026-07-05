import { createBrowserRouter } from "react-router-dom";
import { QueuePage } from "./pages/QueuePage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuditPage } from "./pages/AuditPage";
import { PolicyRulesPage } from "./pages/PolicyRulesPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <QueuePage /> },
  { path: "/applications/:id", element: <ProfilePage /> },
  { path: "/applications/:id/audit", element: <AuditPage /> },
  { path: "/policy-rules", element: <PolicyRulesPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

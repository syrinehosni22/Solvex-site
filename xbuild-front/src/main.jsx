import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import "./i18n/index.js";

import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import Login from "./admin/Login.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import InfoEditor from "./admin/InfoEditor.jsx";
import AboutEditor from "./admin/AboutEditor.jsx";
import ServicesEditor from "./admin/ServicesEditor.jsx";
import ProjectsEditor from "./admin/ProjectsEditor.jsx";
import ProcessEditor from "./admin/ProcessEditor.jsx";
import TestimonialsEditor from "./admin/TestimonialsEditor.jsx";
import BlogEditor from "./admin/BlogEditor.jsx";
import DevisManager from "./admin/DevisManager.jsx";
import StatsEditor from "./admin/StatsEditor.jsx";
import BlogPostPage from "./features/xbuild/BlogPostPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Site public */}
          <Route path="/" element={<App />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />

          {/* Page de connexion — accessible sans auth */}
          <Route path="/admin/login" element={<Login />} />

          {/* Zone admin — protégée par RequireAuth */}
          <Route path="/admin" element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="info" element={<InfoEditor />} />
              <Route path="about" element={<AboutEditor />} />
              <Route path="services" element={<ServicesEditor />} />
              <Route path="projects" element={<ProjectsEditor />} />
              <Route path="process" element={<ProcessEditor />} />
              {/* <Route path="testimonials" element={<TestimonialsEditor />} /> */}
              {/* <Route path="blog" element={<BlogEditor />} /> */}
              <Route path="stats" element={<StatsEditor />} />
              <Route path="devis" element={<DevisManager />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
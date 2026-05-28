// ─────────────────────────────────────────────────────────────
//  services/projectService.js
//  Path: frontend/src/services/projectService.js
//
//  WHY A SERVICE LAYER?
//  ─────────────────────
//  Instead of writing API calls directly inside components, we put
//  them here. This keeps components clean and lets us change the
//  API URL or structure in one place without touching every component.
//
//  USAGE IN COMPONENTS:
//    import { fetchProjects, fetchProject } from "../services/projectService";
//    const projects = await fetchProjects();         // all projects
//    const project  = await fetchProject("someId");  // one project
// ─────────────────────────────────────────────────────────────

import axiosInstance from "../api/axiosInstance";

// Get all projects — supports ?featured=true, ?tag=React
export const fetchProjects = async (params = {}) => {
  const res = await axiosInstance.get("/projects", { params });
  return res.data?.data ?? [];
};

// Get a single project by its MongoDB _id
export const fetchProject = async (id) => {
  const res = await axiosInstance.get(`/projects/${id}`);
  return res.data?.data ?? null;
};

import express from "express";
import { isAuthenticated, isAdmin } from "../controllers/authController.js";
const router = express.Router();

// For /

router.get("/user", isAuthenticated, (req, res) => {
  res.render("user", { name: req.session.user.name });
});

router.get("/admin", isAdmin, (req, res) => {
  res.render("admin");
});

router.get("/adminusers", isAdmin, (req, res) => {
  res.render("adminusers");
});

router.get("/adminforms", isAdmin, (req, res) => {
  res.render("adminform");
});

export default router;

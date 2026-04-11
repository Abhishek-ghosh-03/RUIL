import Component from "../models/component.model.js";
import { slugify } from "../utils/slugify.js";

// 🔍 SEARCH COMPONENTS
export const searchComponents = async (req, res) => {
  try {
    const { q, category, framework, library } = req.query;

    let filter = {};

    // 🔥 Filters
    if (category) filter.category = category;
    if (framework) filter.framework = framework;
    if (library) filter.library = library;

    // 🔍 Text Search
    if (q) {
      filter.$text = { $search: q };
    }

    const components = await Component.find(filter)
      .limit(50)
      .sort({ createdAt: -1 });

    res.json(components);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📄 GET SINGLE COMPONENT (optional)
export const getComponent = async (req, res) => {
  try {
    const component = await Component.findOne({
      slug: req.params.slug
    });

    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(component);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ CREATE COMPONENT (used for seeding / Postman)
export const createComponent = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 Generate slug
    data.slug = slugify(data.name);

    const component = await Component.create(data);

    res.status(201).json(component);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE COMPONENT (optional cleanup)
export const deleteComponent = async (req, res) => {
  try {
    await Component.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  
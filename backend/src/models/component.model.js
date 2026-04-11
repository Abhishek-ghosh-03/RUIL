import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },

    description: String,
    category: String,
    framework: { type: String, default: "react" },

    library: String, // mui, shadcn, etc.

    // 🔥 IMPORTANT
    type: {
      type: String,
      enum: ["package", "cli"],
      required: true
    },

    tags: [String],

    previewHtml: String,

    // For CLI (shadcn)
    installCommand: String,

    // For package-based (MUI)
    importCode: String
  },
  { timestamps: true }
);

componentSchema.index({
  name: "text",
  description: "text",
  tags: "text"
});

export default mongoose.model("Component", componentSchema);
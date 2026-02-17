import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "WHOAMIII Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [deskTool()],
  schema: {
    types: schemaTypes
  }
});

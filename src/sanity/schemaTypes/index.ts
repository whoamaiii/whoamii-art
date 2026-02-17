import type { SchemaTypeDefinition } from "sanity";
import { processBlockTypes } from "./processBlocks";
import { projectSchema } from "./project";
import { projectCategorySchema } from "./projectCategory";
import { siteSettingsSchema } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  ...processBlockTypes,
  projectCategorySchema,
  projectSchema,
  siteSettingsSchema
];

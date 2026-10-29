import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const SINGLETONS = ["siteSettings", "homePage"];
const BLOCKED_ACTIONS = ["delete", "duplicate", "unpublish"];

export default defineConfig({
  name: "default",
  title: "Arjun T.R — Site",
  basePath: "/studio",
  // Sanity requires a non-empty id; a placeholder lets builds pass when Sanity isn't configured yet.
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? prev.filter((item) => !SINGLETONS.includes(item.templateId)) : prev,
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType) ? prev.filter(({ action }) => !(action && BLOCKED_ACTIONS.includes(action))) : prev,
  },
});

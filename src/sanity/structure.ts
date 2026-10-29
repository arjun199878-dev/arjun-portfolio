import type { StructureResolver } from "sanity/structure";

const list = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(S.documentTypeList(type).title(title).defaultOrdering([{ field: "order", direction: "asc" }]));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Site settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Home page").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      list(S, "caseStudy", "Case studies"),
      list(S, "role", "Experience"),
      list(S, "toolGroup", "Toolkit"),
      list(S, "education", "Education"),
    ]);

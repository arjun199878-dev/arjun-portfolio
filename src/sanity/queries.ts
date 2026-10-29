const image = `{ "url": asset->url, "alt": alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

export const siteContentQuery = `{
  "settings": *[_id == "siteSettings"][0]{ ..., "ogImageUrl": ogImage.asset->url },
  "home": *[_id == "homePage"][0],
  "caseStudies": *[_type == "caseStudy" && visible != false] | order(order asc){
    ..., "visual": visual{ ..., "image": image${image} }
  },
  "roles": *[_type == "role"] | order(order asc),
  "toolGroups": *[_type == "toolGroup"] | order(order asc),
  "education": *[_type == "education"] | order(order asc)
}`;

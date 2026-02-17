import { defineArrayMember, defineField, defineType } from "sanity";
import { processBlockTypeNames } from "./processBlocks";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "main", title: "Main" },
    { name: "media", title: "Media" },
    { name: "story", title: "Story" },
    { name: "seo", title: "SEO" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "main",
      validation: (rule) => rule.required().min(3)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "main",
      options: {
        source: "title",
        maxLength: 120
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" }
        ],
        layout: "radio"
      },
      initialValue: "draft",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "main",
      initialValue: false
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "main",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "projectCategory" }]
        })
      ]
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "main",
      validation: (rule) => rule.required().integer().min(2000).max(2100)
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "main",
      description: "Optional format: 00:12"
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      group: "story",
      rows: 3,
      validation: (rule) => rule.required().min(20)
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "text",
      group: "story",
      rows: 4
    }),
    defineField({
      name: "solution",
      title: "Solution",
      type: "text",
      group: "story",
      rows: 4
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "text",
      group: "story",
      rows: 4
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "media",
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string"
        })
      ]
    }),
    defineField({
      name: "coverVideo",
      title: "Cover Video (Cloudinary URL)",
      type: "url",
      group: "media",
      validation: (rule) => rule.uri({ scheme: ["https"] })
    }),
    defineField({
      name: "processBlocks",
      title: "Process Blocks",
      type: "array",
      group: "story",
      of: processBlockTypeNames.map((name) => defineArrayMember({ type: name })),
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "url"
            })
          ]
        })
      ]
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo"
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      rows: 3
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      group: "seo",
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string"
        })
      ]
    })
  ]
});

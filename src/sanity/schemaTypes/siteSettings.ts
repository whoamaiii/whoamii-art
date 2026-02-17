import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "manifestoKicker",
      title: "Manifesto Kicker",
      type: "string"
    }),
    defineField({
      name: "manifestoTitle",
      title: "Manifesto Title",
      type: "string"
    }),
    defineField({
      name: "manifestoBody",
      title: "Manifesto Body",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "manifestoSubline",
      title: "Manifesto Subline",
      type: "string"
    }),
    defineField({
      name: "aboutHeading",
      title: "About Heading",
      type: "string"
    }),
    defineField({
      name: "aboutBody",
      title: "About Body",
      type: "text",
      rows: 5
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string"
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url"
    })
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings"
      };
    }
  }
});

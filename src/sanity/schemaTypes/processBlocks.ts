import { defineArrayMember, defineField, defineType } from "sanity";

export const processBlockTypeNames = [
  "richTextBlock",
  "imageBlock",
  "videoBlock",
  "galleryBlock",
  "milestoneBlock",
  "quoteBlock"
] as const;

export const processBlockTypes = [
  defineType({
    name: "richTextBlock",
    title: "Rich Text Block",
    type: "object",
    fields: [
      defineField({
        name: "heading",
        title: "Heading",
        type: "string"
      }),
      defineField({
        name: "content",
        title: "Content",
        type: "array",
        of: [defineArrayMember({ type: "block" })],
        validation: (rule) => rule.required().min(1)
      })
    ]
  }),
  defineType({
    name: "imageBlock",
    title: "Image Block",
    type: "object",
    fields: [
      defineField({
        name: "caption",
        title: "Caption",
        type: "string"
      }),
      defineField({
        name: "alt",
        title: "Alt Text",
        type: "string",
        description: "Required when image content is meaningful."
      }),
      defineField({
        name: "image",
        title: "Image",
        type: "image",
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
        name: "beforeImage",
        title: "Before Image",
        type: "image",
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
        name: "afterImage",
        title: "After Image",
        type: "image",
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
  }),
  defineType({
    name: "videoBlock",
    title: "Video Block",
    type: "object",
    fields: [
      defineField({
        name: "caption",
        title: "Caption",
        type: "string"
      }),
      defineField({
        name: "cloudinaryUrl",
        title: "Cloudinary URL",
        type: "url",
        validation: (rule) => rule.required().uri({ scheme: ["https"] })
      }),
      defineField({
        name: "posterImage",
        title: "Poster Image",
        type: "image",
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
  }),
  defineType({
    name: "galleryBlock",
    title: "Gallery Block",
    type: "object",
    fields: [
      defineField({
        name: "caption",
        title: "Caption",
        type: "string"
      }),
      defineField({
        name: "images",
        title: "Images",
        type: "array",
        of: [
          defineArrayMember({
            type: "image",
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
        ],
        validation: (rule) => rule.required().min(2).max(8)
      })
    ]
  }),
  defineType({
    name: "milestoneBlock",
    title: "Milestone Block",
    type: "object",
    fields: [
      defineField({
        name: "stepTitle",
        title: "Step Title",
        type: "string",
        validation: (rule) => rule.required()
      }),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        rows: 4,
        validation: (rule) => rule.required()
      }),
      defineField({
        name: "tools",
        title: "Tools",
        type: "array",
        of: [defineArrayMember({ type: "string" })]
      }),
      defineField({
        name: "timestamp",
        title: "Timestamp",
        type: "string",
        description: "Example: Week 2, v3 pass"
      })
    ]
  }),
  defineType({
    name: "quoteBlock",
    title: "Quote Block",
    type: "object",
    fields: [
      defineField({
        name: "quote",
        title: "Quote",
        type: "text",
        rows: 3,
        validation: (rule) => rule.required()
      }),
      defineField({
        name: "attribution",
        title: "Attribution",
        type: "string"
      })
    ]
  })
];

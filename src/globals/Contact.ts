import type { GlobalConfig } from "payload"

export const Contact: GlobalConfig = {
  slug: "contact",
  label: "Contact Info",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
    },
  ],
}

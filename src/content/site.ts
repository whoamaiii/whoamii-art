export const siteConfig = {
  instagramUrl: "https://www.instagram.com/quentin_qmann/",
  // Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local for production mail CTA.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  resendEnabled: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_TO_EMAIL)
};

export const contactMailHref = siteConfig.contactEmail
  ? `mailto:${siteConfig.contactEmail}?subject=Commission%20Inquiry`
  : null;

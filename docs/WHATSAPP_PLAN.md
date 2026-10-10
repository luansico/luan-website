# WhatsApp and practical lead capture

## Active first step

Use official click-to-chat links to the owner-confirmed public number. Visitors can start directly from the hero/contact buttons or prepare a structured request with name, service, area and issue. Email is optional. The draft includes a website source label; it opens in WhatsApp, and the visitor presses Send. Photos/videos can be added in the chat. No API key, payment plan, chatbot or backend is needed for these links. [Official click-to-chat guide](https://faq.whatsapp.com/5913398998672934)

A button click or opened draft is not a sent enquiry or confirmed lead. The static site cannot see whether a visitor sends the message. No enquiry or visitor statistics are currently collected.

## Recommended everyday workflow

Use the official WhatsApp Business app if it suits Luan's existing account, with an accurate profile, agreed hours, short saved replies and a small set of lead labels: New enquiry, Visit planned, Quote sent, Booked, Completed. Keep follow-up personal. Confirm account migration/backups before changing the existing WhatsApp setup; no migration is part of this website work.

After a completed job: obtain permission, save selected photos/videos locally, upload approved images through CMS and add public video links. Client WhatsApp media should not automatically become public portfolio content.

## Later, if volume justifies automation

A server-side service can use the **official WhatsApp Business Platform / Cloud API** with registered business assets, secure server-held credentials and webhooks. A small webhook service could classify incoming enquiries, record minimal consented lead information and send approved notifications or a weekly digest to a verified owner number. Delivery rules, current pricing, template approval, recipient opt-in and number/coexistence support must be checked during implementation. Do not use unofficial WhatsApp Web scraping or put tokens in GitHub Pages.

Website visit statistics need a separate analytics provider. Start with aggregate visits and WhatsApp button clicks only if Luan needs them; never include message text, names, phone numbers or form field contents in analytics events. A weekly digest should distinguish visits, clicks and actual messages received. Automatic WhatsApp summaries need the backend and messaging setup above; click-to-chat cannot provide them.

Useful simple additions after real content exists: approved before/after project photos, service area and opening hours confirmed by Luan, a verified business profile/review link and a concise reply-time expectation. Avoid inventing response guarantees or certifications. Add tracking or bookings only when it solves an observed problem.

Official implementation references: [Meta developer portal](https://developers.facebook.com/docs/whatsapp/) and [WhatsApp Business](https://business.whatsapp.com/). Exact API setup and costs have not been configured or verified in this release.

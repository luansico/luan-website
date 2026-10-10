# Publication and CMS validation

Verified 10 October 2026. The website is published from the dedicated public repository `luansico/luan-website`; the wider local workspace and original profile attachments were never uploaded.

## Completed checks

- Node syntax, static build and **10 grouped checks pass**, including bilingual content, approval requirements, unsafe links, contacts and enquiries. CI runs both build and checks before publishing `_site/`.
- GitHub Pages HTTPS test address returned HTTP 200 and rendered all five page images without captured application errors or warnings. Files and fonts use relative paths and work under `/luan-website/`.
- Pages CMS authenticated as **luansico**. A page-copy save created commit `9f29c1e`, preserved every required hidden/system copy field, and deployed successfully in run `38047586669`. An existing approved stock camera photo was uploaded through the media library to `assets/uploads/camera.jpg`; this remains illustrative material.
- Portfolio and contact saves were also exercised in the hosted CMS. Empty optional list fields are omitted by Pages CMS; the application accepts that omission and still rejects malformed values. A regression check validates the raw editable JSON as well as generated content. The initial rejected portfolio build preserved the last working deployment.
- CMS access uses owner GitHub sign-in only. The owner declined an email collaborator invitation; none was sent.
- Chrome checks used measured **320 and 390 CSS-pixel widths**, with no horizontal overflow. The earlier layout baseline also passed 768/1024/1440 checks in the in-app browser.
- Short WhatsApp drafts retain Albanian characters, newlines and `& # + ?`, address the confirmed public number, and permit an empty email. Long encoded drafts above 2,000 URL characters fall back to copy/paste into WhatsApp. Preparing a message focuses the result title and places actions above the preview.
- Test fields were cleared after QA. Fresh visitors receive an empty form and hidden result panel. No WhatsApp message was sent or delivery claimed.
- Claude Code performed a second **static source review** with tools disabled. Applied its practical findings: long-draft fallback, result focus, clearer optional-email fallback, larger footer targets, label-in-name fixes, safer image types, CSP, translation fallback, asset checks, build-versioned script/style URLs and serialized deployments. Claude did not independently execute browser tests.
- Public `/admin/` is a launcher for authenticated Pages CMS. No password, access token or private invitation address is embedded in public source.

## Domain and HTTPS verified

GitHub Pages custom domain is set to `luan.si`. Dynadot saved four GitHub apex A records, `www` CNAME to `luansico.github.io`, and the GitHub ownership-verification TXT record. Dynadot's saved form was reopened and inspected. GitHub confirmed ownership verification for `luan.si`. Both Dynadot nameservers and a public resolver returned the four GitHub A records. At 13:09 UTC on 10 October 2026, certificate validation passed for both `luan.si` and `www.luan.si`. GitHub Pages DNS check succeeded and Enforce HTTPS was enabled. `https://luan.si/` and `/admin/` returned HTTP 200; the www HTTPS address and both HTTP addresses redirect to `https://luan.si/`. Live browser checks confirmed all five images load, the refreshed enquiry form is empty, a synthetic draft preserves accented characters and punctuation, and the admin launcher points to the owner CMS. No external message was sent. The temporary HTTPS follow-up was paused after verification. Preserve the verification TXT record.

## Practical limits

WhatsApp on real iOS/Android devices and actual delivery, Safari, screen-reader announcements, 200% zoom and OS reduced-motion behavior remain unverified. There is no analytics, automated digest, message backend or lead database. The WhatsApp guide separates the working client-controlled chat flow from possible future automation. Current portfolio examples use stock imagery and do not claim completed client work.

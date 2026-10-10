# Luan Sinani — website

Bilingual Albanian/English electrical and technical services website, with WhatsApp enquiries and a Pages CMS content editor.

- Repository: https://github.com/luansico/luan-website
- GitHub Pages test URL: https://luansico.github.io/luan-website/
- Planned custom domain: https://luan.si
- Editor entry: append `admin/` to the website address. Authentication and editing happen in Pages CMS.

## Edit content

Use Pages CMS to edit contact details, page text, services, portfolio projects and approved client references. The editable source is in `data/*.json`; `.pages.yml` defines the forms. Do not edit the generated `content.js` directly.

Each CMS save creates a Git commit. GitHub Actions validates content, runs checks, builds only public website files and publishes the result. A failed validation leaves the last successful deployment live. Check Actions for a failed update and correct the entry before saving again. Do not put private approval messages or client documents into this public repository.

## Preview / verify

```sh
node tools/build.mjs
node tools/check.mjs
python3 -m http.server 8788 --bind 127.0.0.1 --directory _site
```

Visit http://127.0.0.1:8788. Stop with Ctrl+C. Node 24 and Python 3 are sufficient; there are no package dependencies. The generated site uses local fonts/images and no runtime content service.

## Enquiries

WhatsApp opens a prepared message addressed to the confirmed number. The visitor reviews it and presses Send in WhatsApp; the website cannot confirm delivery. Name, area, service and issue are required; email and phone are optional. Photos/videos can be added inside the chat. There is no lead database, tracking or automated messaging.

Portfolio entries currently marked **illustrative examples** are stock illustrations, not completed work. Publish real projects and client references only with permission. Original profile documents and reference screenshots are excluded.

## Owner guides

- [Content and media editing](docs/CONTENT_GUIDE.md)
- [CMS setup and recovery](docs/EDITING_OPTIONS.md)
- [GitHub Pages and Dynadot domain setup](docs/DEPLOYMENT.md)
- [Simple WhatsApp and lead plan](docs/WHATSAPP_PLAN.md)
- [Asset credits and content facts](docs/CONTENT_NOTES.md)
- [Verification record](docs/VALIDATION.md)

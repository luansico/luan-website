# Local verification

Verified 10 October 2026. This is a local review build, not a live deployment.

## Baseline and scope

Workspace HEAD before this task: `0f57779`. Existing tracked files were clean; pre-existing untracked applications and archives were left untouched. The change adds `luan-si/` and appends the task record to `docs/CURRENT_STATE.md` at workspace root. No original user attachment was edited. No push, external registration, private upload, publication, DNS change or outgoing message was performed.

Acceptance criteria were recorded in the workspace state file before evaluation: responsive layout, keyboard-operable interactions, honest content and enquiry handling, GitHub subpath compatibility, local assets, documentation and a local commit.

## Checks completed

- `node --check app.js` and `node --check content.js`: pass.
- `node tools/check.mjs`: **8 grouped checks passed** covering both language dictionaries, current configuration, illustrative-content classification, missing language/duplicate record rejection, media/contact validation, approved-reference requirements, invalid enquiry inputs and local asset existence.
- `python3 tools/package.py`: **14 public source/asset files packaged**, with each zip entry checked against its exact source SHA-256. Manifest: `tools/manifest.json`.
- Local preview at loopback port 8788 returned HTTP 200. The Codex in-app browser rendered the actual site; all observed photos/fonts loaded, with no captured application warnings or errors in the final check.
- Both Albanian and English layouts: **320, 390, 768, 1024 and 1440 CSS-pixel widths**, no document horizontal overflow. Full desktop/mobile screenshots are in `docs/screenshots/`. Desktop full-page content and mobile hero/services/dialog views were visually inspected.
- Mobile menu opens, closes after navigation and closes with Escape. Language controls update copy, labels, metadata and document language. Existing form values survive language changes.
- Portfolio category filtering shows the appropriate example and count. Project dialogs render matching detail copy. Escape closes them and restores the launching button's focus. Forward/backward keyboard focus cycles inside the project dialog; the privacy dialog also retains focus.
- A native browser difference let Tab leave the project dialog at its last control. Added explicit boundary handling; the forward and backward cycle and privacy focus checks then passed.
- Empty form is blocked. Whitespace-only name is rejected. A valid synthetic enquiry is prepared with all expected fields, an explicit **not sent** explanation and the correct LinkedIn handoff URL. Copy confirmation appeared. Editing a field clears the old result. Language switching preserves fields and rebuilds the prepared message in the selected language.
- An isolated fixture under `/private/tmp/luan-site-qa/project/luan-website/` verified a repository subpath, configured email/phone/social links, an approved project with video URL, and an approved review replacing the reference placeholder. Fixture contacts used reserved `example.invalid` addresses and synthetic text; they are excluded from the source/package.
- The email draft URL correctly percent-encodes newlines, markup characters, `&`, `+` and `?`. A synthetic HTML-like payload remains literal textarea content, producing **zero injected images**. No email app, LinkedIn profile, YouTube channel or message-sending action was invoked in the tests.
- Source inspection confirms no remote script/font/image loads, fetch-based form submission or automatic media embeds. No consent or approval reference exposes private correspondence.

## Limits and pending owner decisions

- Only the Codex in-app browser was used for automated interaction/visual QA. A live GitHub Pages deployment, DNS/HTTPS, independent Safari/Chrome/Firefox checks and screen-reader testing have not been performed.
- Direct `file:` navigation is blocked by the testing browser's URL policy, so browser QA used HTTP. Manual local-file opening is available to the user; it was not independently browser-tested here. Clipboard fallback is implemented but was not forced in the browser, which allowed copying.
- Reduced-motion CSS is included and inspected; the OS reduced-motion preference was not changed for a live check.
- The real contact route is LinkedIn only. Delivery has not been confirmed with Luan. There is no automatic submission, lead storage or spam-handling service; a real inbox and optional provider would be a later setup.
- Real portfolio media, client references, current service coverage, pricing/process copy and a replacement portrait need owner review. The supplied profile is a snapshot, not independently verified employment or licensing evidence.
- Pages CMS is a documented recommendation. No login/dashboard, JSON migration, CMS schema, account invite, repository permission or authenticated editing/deployment flow is active.
- Stock images illustrate services and do not establish Luan's workmanship. No customer statistics, certification, warranty, response-time or numerical performance claim is made.

## Artifacts

- `docs/screenshots/preview-en.png`: desktop hero review image.
- `docs/screenshots/desktop-sq.png`, `desktop-en.png`: full desktop page.
- `docs/screenshots/mobile-sq.png`, `mobile-en.png`: full 390 px mobile page.
- `dist/luan-si-github-pages.zip`: upload-ready public site files; excluded from Git because it is reproducible.
- `tools/manifest.json`: fixed synthetic-demo metadata and SHA-256 hashes of the 14 public source/assets.

Temporary preview servers were stopped after checks. To reopen an interactive review, use the short local-server command in `README.md`.

# Updating Luan's website

Open the website's **Edit website** footer link, or `/admin/`. Choose **Open Pages CMS**, sign in, then select **luansico / luan-website** on branch **main**. Owner connection is required once; an invited editor can sign in by email without using GitHub directly.

1. **Contact and settings:** update the confirmed public WhatsApp/call numbers, optional enquiries email and social profile links. International numbers include `+` and country code without spaces. Blank email is allowed.
2. **Page text:** edit Albanian and English marketing copy, professional background, FAQs and coverage. Layout and functional interface labels remain protected in the CMS.
3. **Services:** keep the four service categories and edit their descriptions/scope in both languages.
4. **Projects and portfolio:** expand an entry or add one with a unique lowercase hyphenated ID, category, image, title/summary/detail and scope points in both languages. Select **Real completed project** only for Luan's actual work. Check publication permission and add a short public-safe approval note. These notes are public, so do not paste client conversations or emails.
5. **Client references:** add only real approved quotes. Use the client's approved display name, both language versions, service context, permission checkbox and a public-safe approval note.
6. **Media:** upload JPG/JPEG, PNG or WebP under `assets/uploads`, maximum 5 MB each. Prefer compressed images under 500 KB. No private client documents or WhatsApp conversation exports. Videos stay on YouTube or an appropriate public social profile; add their HTTPS links to the project.

Save, then allow GitHub Actions to validate and publish. A green deployment run confirms publication; refresh the live page afterward. A red run means the edit needs correction; the previous working page stays live.

Each save has a Git history entry. For recovery, the repository owner can revert the content commit through GitHub, or use a local checkout. Reverting must be followed by a successful deployment. Avoid editing generated `content.js`: it is rebuilt from the five JSON files each deployment.

The repository is public. Crop identifying client information from media and obtain permission before uploading. Record detailed private approvals outside the public repository.

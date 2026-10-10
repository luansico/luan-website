# Pages CMS setup and recovery

The website contains a working schema `.pages.yml`, five editable JSON files, media upload configuration, a public `/admin/` entry and a checked GitHub Actions deployment workflow. `/admin/` opens the hosted editor; it does not contain a local password form. Authentication and write access are handled by Pages CMS.

## One-time owner setup

1. Sign in at https://app.pagescms.org with the owner account **luansico**.
2. Authorize the hosted CMS login and install its official GitHub App for **only `luan-website`**, preserving access to other repositories.
3. Open the repository and branch `main`. The existing schema supplies Contact and settings, Projects and portfolio, Client references, Services and Page text.
4. If another person needs editor access, invite their confirmed email through the repository's CMS collaborators settings. Keep the invitation address out of public source. Collaborator access is configured in the CMS, not `.pages.yml`.
5. Test an innocuous text edit, save, check the new Git commit and successful deployment, then verify the live page.

Pages CMS lets invited collaborators edit content/media without a GitHub account. They cannot manage the schema or invitations. [Official collaborator guide](https://pagescms.org/docs/configuration/collaborators/)

Do not share passwords or put tokens in website JavaScript. Review app access in GitHub Settings → Applications; retain repository and domain ownership. If CMS becomes unavailable, the published site stays live and the owner can edit JSON through GitHub or a local checkout.

## Validation and rollback

`node tools/build.mjs` rejects malformed contacts, unsafe media links, missing languages, invalid categories, missing images and unapproved real projects/references. `node tools/check.mjs` checks behavior with separate synthetic fixtures. Deployment happens only after both succeed.

Correct a rejected content edit in CMS and save again. To undo a valid but unwanted edit, revert its Git commit; GitHub Actions rebuilds the previous content. Uploaded but unused media remain public in Git history until deliberately removed; never upload private material.

The hosted CMS is a third-party editing dependency. The static website, public repository, local source and deployment pipeline do not require its runtime service.

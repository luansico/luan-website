# GitHub Pages and luan.si at Dynadot

Owner: **luansico**. Repository: https://github.com/luansico/luan-website. Initial test URL: https://luansico.github.io/luan-website/.

## GitHub Pages

In repository Settings → Pages, choose **GitHub Actions** as the source. The supplied workflow builds and checks editable content before publishing only `_site/`. CMS saves on main automatically run it; it can also be run manually from Actions. Successful deployment returns the website URL. Invalid content must be corrected before publication.

Use the GitHub test URL first. Do not set the custom domain until ready for the DNS switch, because the GitHub URL may then redirect to the domain.

## Verify domain ownership first

In the **luansico account** Settings → Pages, add and verify `luan.si`. GitHub supplies a unique TXT record. Add that exact record at Dynadot (usually subdomain `_github-pages-challenge-luansico`, value supplied by GitHub), then verify it in GitHub. Preserve the TXT record afterward. It is a public verification record, not a website password.

## Point luan.si to GitHub

1. Confirm which nameservers are authoritative. If Dynadot DNS is in use, open Dynadot → My Domains → Manage Domains → select **luan.si** → DNS Settings. If another DNS provider is authoritative, make the changes there instead.
2. Record existing settings and preserve mail-related MX/TXT/SPF/DKIM/DMARC records. Replace only conflicting website/parking records for the root domain and www.
3. In repository Settings → Pages → Custom domain, save **luan.si**.
4. In Dynadot DNS, add the following. Root records go into **Domain Record**; do not type `@` into Dynadot's subdomain field.

| Dynadot section | Type | Destination |
| --- | --- | --- |
| Domain Record (root) | A | 185.199.108.153 |
| Domain Record (root) | A | 185.199.109.153 |
| Domain Record (root) | A | 185.199.110.153 |
| Domain Record (root) | A | 185.199.111.153 |
| Subdomain: www | CNAME | luansico.github.io |

The www target is the account hostname, without `https://` or the repository name. Avoid wildcard records. Remove stale root AAAA records only if they conflict with the chosen website configuration; preserve unrelated records.

5. Save DNS. Allow propagation and GitHub certificate provisioning; changes can take up to 24 hours. Enable **Enforce HTTPS** when available.
6. Test https://luan.si, https://www.luan.si and https://luan.si/admin/. Test both languages, mobile rendering, portfolio details and the WhatsApp link. A DNS check passing alone does not verify TLS or application behavior.

With an Actions publishing source, a CNAME file does not configure the custom domain by itself; use repository Pages settings. Once the domain is working, add domain-specific canonical/social preview metadata and update public links where useful.

## Current transition status (10 October 2026)

The repository Pages setting uses `luan.si` and ownership is verified in the **luansico** account. Four apex A records and `www` CNAME are saved at Dynadot. Do not add duplicate records. The verification TXT record is `_github-pages-challenge-luansico` with value `396e83140d19173cd6dc5b5624e9e0`; preserve it.

Older DNS caches may still show the Dynadot parking page. GitHub is provisioning the HTTPS certificate. In Settings → Pages, **Enforce HTTPS** is disabled while provisioning is pending; enable it once available, then verify both HTTPS hostnames without bypassing any browser warning. GitHub says HTTPS can take up to an hour after domain configuration; DNS caches can take longer. No paid certificate or extra hosting service is needed.

If HTTPS remains unavailable after DNS has settled, inspect A/AAAA/CAA records and the `www` CNAME. Current checks found no conflicting apex AAAA or CAA record. GitHub's documented recovery is to remove and re-add the same custom domain to trigger provisioning; this was done once after the DNS update. Avoid repeating it while a certificate is already pending.

Reference: [GitHub HTTPS troubleshooting](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages#https-errors).

## Recovery

If publication fails, inspect Actions and fix the data or workflow. The last successful deployment stays live. Revert a mistaken content commit to restore earlier content. To undo a domain switch, restore the recorded DNS configuration and remove the custom domain in Pages settings. Do not remove mail records or verification TXT records as part of routine website updates.

Primary references: [GitHub custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [GitHub domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), [Dynadot DNS settings](https://www.dynadot.com/help/question/set-up-DNS).

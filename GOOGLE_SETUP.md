# Google setup, Search Console, and GA4 guide

This file contains concise steps to: set up `gcloud` for your project, verify the site in Google Search Console, and add Google Analytics 4 (GA4) tracking.

1) Google Cloud / `gcloud` quick setup
- Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
- Authenticate locally:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

- Create a project (if needed):

```bash
gcloud projects create YOUR_PROJECT_ID --name="My Project"
gcloud config set project YOUR_PROJECT_ID
```

- Enable APIs you may need (example: Cloud Storage or other APIs your site uses):

```bash
gcloud services enable storage.googleapis.com
gcloud services enable iam.googleapis.com
```

- Create a service account (optional, for automation):

```bash
gcloud iam service-accounts create deploy-bot --display-name="Deploy Bot"
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:deploy-bot@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"
gcloud iam service-accounts keys create key.json \
  --iam-account=deploy-bot@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

2) Verify site in Google Search Console
- Open https://search.google.com/search-console
- Add property: choose "URL prefix" and enter the full site URL (e.g. `https://www.your-domain.com`)
- Choose verification method: HTML file upload or HTML meta tag.
  - We added a placeholder meta tag to `index.html`:
    - Open [index.html](index.html) and replace the content of the `google-site-verification` meta tag with your code.
  - Alternatively upload the verification HTML file to your site root.
- After placing the verification code, click "Verify" in Search Console.

3) Sitemap submission
- Update `sitemap.xml` with your real domain (replace `https://example.com/`), then deploy it to your site root.
- Submit the sitemap in Search Console: "Sitemaps" → enter `/sitemap.xml` → Submit.

4) Add Google Analytics 4 (GA4)
- Create a GA4 property at https://analytics.google.com/ and get your measurement ID (format `G-XXXXXXXX`).
- In `index.html` we added a GA4 placeholder. Replace both occurrences of `G-REPLACE_ME` with your measurement ID.
- To validate tracking, open the site and use GA4 DebugView or the browser extension "Tag Assistant".

5) Notes and checklist
- Files added: [sitemap.xml](sitemap.xml), [robots.txt](robots.txt), updated [index.html](index.html).
- Replace placeholder values: `REPLACE_WITH_VERIFICATION_TOKEN`, `G-REPLACE_ME`, and `https://example.com/`.
- If you host on Vercel or Netlify, ensure files are deployed to the site root so Search Console can access them.

If you'd like, I can:
- Insert your real GA4 measurement ID and Search Console token into `index.html` (you can paste them here), or
- Walk through `gcloud` commands interactively and help create service accounts and enable specific APIs.

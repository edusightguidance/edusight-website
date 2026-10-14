# EDUSIGHT website — go-live checklist

About 30–40 minutes. Do the steps in order. Each account is free to open.

## 1. GitHub (stores the code)
1. Sign up at github.com with edusightguidance@gmail.com.
2. Create a **private** repository called `edusight-website`.
3. Tell Claude the repository name. Claude will connect it and upload the code.

## 2. Neon (the database)
1. Sign up at neon.com with Google (edusightguidance@gmail.com).
2. Create a project called `edusight`. Choose the region **AWS Europe (Frankfurt)**, which is closest to the UAE.
3. Copy the **connection string**. It starts with `postgresql://`. This is your `DATABASE_URL`.

## 3. Cloudflare R2 (images, eBooks and reports)
1. Log in to Cloudflare. Your domain should already be there; if not, add it.
2. Open **R2**, then **Create bucket**, and name it `edusight-files`.
3. Go to **R2 → Manage API tokens → Create token** with *Object Read & Write* permission.
4. Note these four values:
   - Access Key ID
   - Secret Access Key
   - The endpoint (`https://<account-id>.r2.cloudflarestorage.com`)
   - The bucket name

## 4. Resend (sends emails: consent, reports, password resets)
1. Sign up at resend.com.
2. Add the domain `edusightconsulting.com`, then add the DNS records it shows you in Cloudflare.
3. Create an API key.

## 5. Stripe (payments in AED)
1. Sign up at stripe.com and select **United Arab Emirates**. Complete the business verification using your DED trade licence.
2. Go to **Developers → API keys** and copy the **Secret key** (`sk_live_…`). Use `sk_test_…` for a trial run first.
3. Go to **Developers → Webhooks → Add endpoint**:
   - URL: `https://www.edusightconsulting.com/x/stripe-webhook`
   - Event: `checkout.session.completed`
   - Copy the **Signing secret** (`whsec_…`).

## 6. Vercel (runs the website)
1. Sign up at vercel.com with your GitHub account, then upgrade to **Pro** (about USD 20/month; required for business sites).
2. Click **Add New → Project** and import `edusight-website`.
3. Under **Environment Variables**, add the following:

| Name | Value |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `PAYLOAD_SECRET` | any long random text (40+ characters) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.edusightconsulting.com` |
| `SEED_ADMIN_PASSWORD` | the password you want for the admin login |
| `ADMIN_EMAIL` | `edusightguidance@gmail.com` |
| `RESEND_API_KEY` | from Resend |
| `EMAIL_FROM` | `hello@edusightconsulting.com` |
| `STRIPE_SECRET_KEY` | from Stripe |
| `STRIPE_WEBHOOK_SECRET` | from Stripe |
| `S3_BUCKET` | `edusight-files` |
| `S3_ENDPOINT` | R2 endpoint |
| `S3_ACCESS_KEY_ID` | R2 access key |
| `S3_SECRET_ACCESS_KEY` | R2 secret |
| `S3_REGION` | `auto` |

**Never** set `PAYMENTS_TEST_BYPASS` on Vercel. It is only for testing on a local computer.

4. Click **Deploy**. When it finishes, open `https://<your-project>.vercel.app/x/setup` **once**. This loads all the content and creates your admin login.
5. Log in at `/admin` with edusightguidance@gmail.com and your `SEED_ADMIN_PASSWORD`.

## 7. Switch the domain (last step)
1. In Vercel, go to **Project → Settings → Domains** and add `www.edusightconsulting.com` and `edusightconsulting.com`.
2. Vercel shows the DNS records to use. Update them where your domain is managed (Squarespace or Cloudflare).
3. Once the new site is live, cancel the Squarespace plan.

---

## Before you announce it — please check
- **Prices.** These are placeholders: Complete Assessment AED 699, Interest Test AED 299, Explorer AED 149, books AED 79. Change them in **Admin → Products & prices** and **Admin → Books**.
- **Your photo.** Go to **Admin → About Bhavana → Photo**.
- **Book PDFs.** Upload each one in **Admin → Private files**. Then open the book, choose the file under *eBook file*, untick *Coming soon*, and Save.
- **Privacy policy.** The current text is a draft. Review it in **Admin → Extra pages**.
- **Testimonials.** Only add real ones, with permission, in **Admin → Testimonials**. The section stays hidden until at least one is added.
- **Social links and booking link** (e.g. Calendly): go to **Admin → Site settings**.

## Everyday use
- **Review a test.** Go to **Admin → Test results & reviews**, open a result, and edit *Recommendations*. Then set Status to **Approved – send report** and click Save. The PDF is emailed to the student, and to the parent if the student is under 18.
- **Change website text.** Use **Homepage**, **About Bhavana**, **Services & Specializations**, **Career Library**, **Articles** and **Books**. Edit the text and Save.
- **Add an editor** (content only). Go to **Admin → Users**, create a user, and set the role to **Editor**.

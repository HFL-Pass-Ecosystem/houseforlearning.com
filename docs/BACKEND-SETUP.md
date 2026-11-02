# House for Learning: how the site works, and how to switch on the backend

All of these are free.

| Part | What it is | Free service |
|---|---|---|
| Frontend | The pages people see (`site/` folder) | Netlify |
| Middleware | Small pieces of server code at `/api/...` (`netlify/functions/`) | Netlify Functions |
| Backend / database | Where messages, ratings and members are kept | Supabase (Postgres) |
| Email alerts (optional) | An email to you for each new message | Resend |

Until steps 2 and 3 are done, the site still works: forms open the visitor's own email app instead.

## Step 1: let GitHub send the site to Netlify (one time, free)
Netlify's free plan cannot read a private organisation repository by itself (it asks for Pro at $20/month).
So GitHub sends the site to the existing Netlify project **houseforlearning** instead. That is free.
1. In Netlify, click your round profile picture (bottom left), then **User settings**, then **Applications**.
2. Under **Personal access tokens**, click **New access token**. Name it `github-deploy`, set expiry to the longest option, click **Generate token**, and copy it. (Netlify shows it only once.)
3. In GitHub, open https://github.com/HFL-Pass-Ecosystem/houseforlearning.com/settings/secrets/actions
4. Click **New repository secret**. Name: `NETLIFY_AUTH_TOKEN`. Secret: paste the token. Click **Add secret**.
5. From now on, every change is sent to Netlify by itself. The `main` branch is the production version; any other branch gets its own preview link (shown in GitHub under **Actions**).

## Step 2: create the database (one time)
1. Go to https://supabase.com, sign in, click **New project**. Name it `house-for-learning`. Pick the region nearest to you. Save the database password somewhere safe.
2. In the project, open **SQL Editor**, click **New query**.
3. Open `supabase/schema.sql` from this repository, copy everything, paste it in, click **Run**. You should see "Success".
4. Open **Project Settings**, then **API**. Copy three things:
   - **Project URL**
   - **anon** (public) key, used for member Log In
   - **service_role** key (secret: never put it in a page or send it by chat or email)

## Step 3: connect Netlify to the database (one time)
1. In Netlify, open the **houseforlearning** project, then **Project configuration**, then **Environment variables**.
2. Add `SUPABASE_URL` = the Project URL.
3. Add `SUPABASE_SERVICE_KEY` = the service_role key.
4. Add `SUPABASE_ANON_KEY` = the anon key (this switches on member Log In).
5. Add `SITE_ORIGIN` = `https://houseforlearning.com` (only after the domain points to Netlify; leave it out while testing).
6. Optional email alerts: make a free account at https://resend.com, create an API key, then add `RESEND_API_KEY` and `NOTIFY_TO` = the address that should get alerts.
7. In GitHub, open **Actions**, click **Deploy to Netlify**, then **Run workflow** to send the site again with the new settings.

## Step 3b: member sign-up emails (Supabase)
1. In Supabase open **Authentication**, then **URL Configuration**. Set **Site URL** to the Netlify preview link (later `https://houseforlearning.com`).
2. Open **Authentication**, then **Providers**, then **Email**. Keep **Confirm email** on.

## Step 4: test
1. Open the Contact page on the preview link, fill in the form, press Send.
2. You should see "Thank you. Your message has been sent (reference MSG-...)".
3. In Supabase, open **Table Editor**, then **messages**. Your message is there.
4. Open **Members login**, sign up, open the email Supabase sends, click the link, then log in. You land on **My page**.

## Step 5: point the domain (only when you are happy)
1. In Netlify: **Domain management**, then **Add a domain**, type `houseforlearning.com`.
2. Netlify shows the DNS records to set. Set them where the domain is managed (today it points to Wix).
3. Wait up to a day. Then retire the Wix site.

## What each address does
- `POST /api/messages`: contact form and "write to us" box. Saved in the `messages` table.
- `POST /api/opinions`: "Was this page useful?" ratings. Saved in the `opinions` table.
- `POST /api/auth`: member sign up, log in, log out, password reset and My page, using Supabase Auth. Needs `SUPABASE_ANON_KEY`. The session is kept in a secure cookie the page scripts cannot read.
- `members` table: one row per member, created automatically at sign-up.

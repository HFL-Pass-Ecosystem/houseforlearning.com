# House for Learning: how the site works, and how to switch on the backend

All of these are free.

| Part | What it is | Free service |
|---|---|---|
| Frontend | The pages people see (`site/` folder) | Netlify |
| Middleware | Small pieces of server code at `/api/...` (`netlify/functions/`) | Netlify Functions |
| Backend / database | Where messages, ratings and members are kept | Supabase (Postgres) |
| Email alerts (optional) | An email to you for each new message | Resend |

Until steps 2 and 3 are done, the site still works: forms open the visitor's own email app instead.

## Step 1: put the site on Netlify (one time)
1. Go to https://app.netlify.com and sign in with GitHub.
2. Click **Add new site**, then **Import an existing project**, then **GitHub**.
3. Pick **HFL-Pass-Ecosystem/houseforlearning.com**. Leave the settings as they are (they come from `netlify.toml`). Click **Deploy**.
4. Netlify gives you a test address like `something.netlify.app`. Open it and check the site.

## Step 2: create the database (one time)
1. Go to https://supabase.com, sign in, click **New project**. Name it `house-for-learning`. Pick the region nearest to you. Save the database password somewhere safe.
2. In the project, open **SQL Editor**, click **New query**.
3. Open `supabase/schema.sql` from this repository, copy everything, paste it in, click **Run**. You should see "Success".
4. Open **Project Settings**, then **API**. Copy two things:
   - **Project URL**
   - **service_role** key (secret: never put it in a page or send it by chat or email)

## Step 3: connect Netlify to the database (one time)
1. In Netlify, open your site, then **Site configuration**, then **Environment variables**.
2. Add `SUPABASE_URL` = the Project URL.
3. Add `SUPABASE_SERVICE_KEY` = the service_role key.
4. Add `SITE_ORIGIN` = `https://houseforlearning.com` (only after the domain points to Netlify; leave it out while testing).
5. Optional email alerts: make a free account at https://resend.com, create an API key, then add `RESEND_API_KEY` and `NOTIFY_TO` = the address that should get alerts.
6. Click **Deploys**, then **Trigger deploy**.

## Step 4: test
1. Open the Contact page on the Netlify address, fill in the form, press Send.
2. You should see "Thank you. Your message has been sent (reference MSG-...)".
3. In Supabase, open **Table Editor**, then **messages**. Your message is there.

## Step 5: point the domain (only when you are happy)
1. In Netlify: **Domain management**, then **Add a domain**, type `houseforlearning.com`.
2. Netlify shows the DNS records to set. Set them where the domain is managed (today it points to Wix).
3. Wait up to a day. Then retire the Wix site.

## What each address does
- `POST /api/messages`: contact form and "write to us" box. Saved in the `messages` table.
- `POST /api/opinions`: "Was this page useful?" ratings. Saved in the `opinions` table.
- `members` table: ready for member Log In (next phase, using Supabase Auth).

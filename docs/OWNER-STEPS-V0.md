# HFL v0: owner steps, one click at a time (basic words)

Do them in this order. Tell me "done" after each. Nothing here touches the real domain.

## Step 1. Open the preview for everyone (Netlify)
1. Open Netlify, then your HFL site.
2. Click Site configuration, then Access and security.
3. Find Visitor access. Click Off (no password). Save.
Ready to ask: YES.

## Step 2. Make the database tables (Supabase)
1. Open Supabase, then your HFL project, then SQL editor.
2. Open the file supabase/schema.sql from our repo. Copy all. Paste. Click Run.
3. New query. Do the same with supabase/handoff.sql. Click Run.
Ready to ask: YES (both files are in the repo).

## Step 3. Give the site its values (Netlify)
Netlify, Site configuration, Environment variables, Add a variable. One at a time:
| Name | Value |
|---|---|
| NOTIFY_TO | contact@hfl-pass.com |
| SITE_ORIGIN | the preview address (https://rebrand-wix-look--houseforlearning.netlify.app) |
| SUPABASE_URL | from Supabase, Project settings, API, Project URL |
| SUPABASE_ANON_KEY | same page, the anon public key |
| SUPABASE_SERVICE_KEY | same page, the service role key (secret, paste only into Netlify) |
| AUTH_PROVIDERS | email |
| NOTIFY_FROM | a sender on a mail domain you verified with the mail service (see note) |
| RESEND_API_KEY | from your Resend account (secret, paste only into Netlify) |
Ready to ask: Supabase values YES. NOTIFY_FROM and RESEND_API_KEY need a Resend account with a verified sender. Without them the site still saves every message in the database, but no email is sent.
Google and Microsoft sign-in can be added later (AUTH_PROVIDERS = email,google,azure) after each provider is set up.

## Step 4. Rebuild
Netlify, Deploys, Trigger deploy, Deploy site. Tell me "done".
Ready to ask: YES.

## Step 5. I test (not you)
When the preview is open, I send one test of each form, one sign-in, and check the data saved, then report Done / Not done.

# Deploying TradeDictatorCapital

Static site, no build step. Plain HTML/CSS/JS.

## Local preview

```bash
cd /home/patiencebuildskindness/Desktop/websites
python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080> in a browser.

## File map

| File | Purpose |
|---|---|
| `index.html` | Home — hero + gallery slideshow + about teaser + services preview + CTA |
| `about.html` | Full About + Mission |
| `services.html` | All 6 services (click for full details modal) |
| `faq.html` | 10 FAQs in accordion |
| `contact.html` | Inquiry form (mailto for now) + email + terms links |
| `risk-disclaimer.html`, `copy-trading-disclaimer.html`, `privacy-policy.html` | Legal pages, linked from every footer |
| `styles.css` | Shared stylesheet |
| `scripts.js` | Shared JS (page-aware: only runs hooks present on current page) |
| `content.txt` | Source content from FX Project (reference) |
| `v1.html`, `v2.html`, `v3.html` | Original mockups (kept as archive, not used by site) |

## Deploying to GitHub Pages — step by step

### 1. Create a GitHub repo

```bash
cd /home/patiencebuildskindness/Desktop/websites
git init
git add index.html about.html services.html faq.html contact.html \
        risk-disclaimer.html copy-trading-disclaimer.html privacy-policy.html \
        styles.css scripts.js
git commit -m "Initial site"
```

Don't commit `v1.html`, `v2.html`, `v3.html`, `content.txt`, the `message*.txt` files, or `DEPLOY.md` unless you want them public — they're working files.

Create a new repo on GitHub (e.g. `tradedictatorcapital-site`), then:

```bash
git remote add origin https://github.com/<your-user>/tradedictatorcapital-site.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `/ (root)`**.

Within ~1 minute the site is live at `https://<your-user>.github.io/tradedictatorcapital-site/`.

### 3. Buy the domain

When you have funds, buy `tradedictatorcapital.com` from a registrar (Namecheap, Cloudflare Registrar, Google Domains successor, etc.). Cloudflare Registrar is the cheapest with no markup.

### 4. Connect the custom domain to GitHub Pages

**a.** In your repo, create a file named exactly `CNAME` (no extension) at the root, containing one line:

```
tradedictatorcapital.com
```

Commit and push. GitHub will pick it up automatically.

**b.** At your registrar's DNS panel, add records:

For **apex domain** `tradedictatorcapital.com`, add four A records pointing at GitHub:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

(These are GitHub Pages' anycast IPs — same for everyone.)

For the `www.` subdomain, add a CNAME:

```
CNAME    www    <your-user>.github.io.
```

**c.** Back in **GitHub → Settings → Pages**, enter `tradedictatorcapital.com` in the Custom domain field and tick **Enforce HTTPS** once the cert provisions (usually within an hour).

DNS can take up to 24h to fully propagate but usually resolves in minutes.

## Future enhancements (when needed)

- **Real contact form** — the current form opens the user's mail client via `mailto:`. To accept submissions on the site itself, add a service like Formspree (free tier), Netlify Forms (if you switch hosts), or a tiny backend endpoint.
- **Slide images** — the 7 chart screenshots are inlined as base64 in `index.html` (~1.5 MB). If load time becomes a concern, extract them to `/img/slide-01.png` etc. and update the `<img src>` tags.
- **Analytics** — add a snippet for Plausible, Fathom, or GA in the `<head>` of each page.
- **Open Graph / Twitter cards** — for richer link previews on social, add `<meta property="og:*">` tags.

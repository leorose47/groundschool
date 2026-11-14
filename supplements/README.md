# Baseline: men's supplement storefront

Static site with no build step. Open `index.html` in a browser, or serve the folder:

```
cd supplements && python3 -m http.server 8000
```

- `index.html`: page structure (hero, quiz, shop, stacks, subscriptions, labels, FAQ)
- `styles.css`: all styling, mobile-first breakpoints
- `app.js`: product catalog, quiz scoring, cart and product modal

Product data (doses, prices, label facts) lives at the top of `app.js` in `PRODUCTS` and `STACKS`.
Checkout is a placeholder. Hook `#checkoutBtn` up to Shopify, Stripe or similar.

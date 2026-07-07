# TODO - Fix gallery categories and image labels

- [ ] Inspect current gallery usage in `index.html`, `salon.html`, and `portfolio.html` to identify miscategorized images/labels.
- [ ] Fix category labels so:
  - SALON images (braids/hair, haircuts, nails, makeup, salon work) appear under SALON only.
  - EVENT images (weddings, parties, birthdays, decorations) appear under EVENTS only.
- [ ] Fix any inconsistent/incorrect `alt` text and visible category text (`<span>EVENT</span>` / `<span>SALON</span>`) for each gallery tile.
- [ ] Fix broken images so they load:
  - Ensure all referenced images exist under `assets/site-images/`.
  - Use existing JS fallback in `script.js` if needed.
- [ ] Run a quick local check by grepping for `assets/site-images/` references and verifying filenames exist.
- [ ] Final verification: ensure all pages render without missing image URLs and categories are separated accurately.


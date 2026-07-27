# Icons Asset Directory

This directory is reserved for custom vector icons, SVGs, or logomark files.

## Font Icons System

By default, this project leverages the **Lucide Icons** framework via a fast CDN:
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

To use any icon, simply place a tag with the `data-lucide` attribute containing the icon name from the Lucide icon library (e.g. https://lucide.dev/icons):
```html
<i data-lucide="phone"></i>
<i data-lucide="message-square"></i>
```

## Local Custom SVGs

If you want to use local SVG files, place them in this folder (e.g. `assets/icons/custom-logo.svg`) and reference them in `index.html` using an `<img>` tag:
```html
<img src="assets/icons/custom-logo.svg" alt="Icon Description">
```

# 🚀 Gulp 2025 – Frontend Build System

A modern Gulp-based frontend build pipeline for HTML, SCSS, JavaScript, images, SVG sprites, favicons, and deployment workflows.

Author: Arsen Parfinovich  
Version: 3.2.0  
License: ISC

## 🧰 Requirements

- Node.js 20.18.0 or newer
- npm 10.8.2 or newer

Use nvm if needed:

```bash
nvm install 20
nvm use 20
```

## 📦 Installation

```bash
npm install
```

## ⚙️ Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development workflow with BrowserSync and file watchers |
| `npm run build` | Production build for `dist/` |
| `npm run zip` | Build and create a ZIP archive |
| `npm run deploy` | Build and deploy via FTP |
| `npm run svgSprive` | Generate SVG sprite from source icons |
| `npm run preview` | Preview the built project in browser-sync |
| `npm run lint` | Run SCSS and HTML validation |
| `npm run clean` | Remove build output |

## ✨ Included Features

- SCSS compilation with Autoprefixer and media-query grouping
- HTML templating with `gulp-file-include`
- Image optimization and WebP generation
- SVG sprite generation
- Responsive image processing
- Favicon generation and injection
- Live reload with BrowserSync
- Deployment via FTP and ZIP
- Stylelint + HTML validation
- Webpack bundling for JS

## 📁 Project Structure

```text
gulp-2025/
├── src/
│   ├── html/
│   ├── scss/
│   ├── js/
│   ├── img/
│   ├── fonts/
│   └── svgicons/
├── dist/
├── gulp/
│   ├── config/
│   ├── tasks/
│   └── tools/
├── gulpfile.mjs
├── package.json
├── README.MD
├── .nvmrc
└── faviconData.json
```

## 💡 Notes

- The project uses ESM (`type: "module"`).
- FTP credentials are read from environment variables in [gulp/config/ftp.js](gulp/config/ftp.js).
- Favicon settings are configured in the generator task and JSON output.
- This setup is suitable for landing pages, portfolio sites, and CMS-integrated frontend builds.

## 🔗 Credits

This project is maintained by Arsen Parfinovich.  
Website: https://parfinovich.dev/

Feel free to fork and adapt it for your own build workflows.

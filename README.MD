🚀 Gulp 2025 – Frontend Build System
A modern, customizable Gulp setup for frontend development. Includes SCSS, HTML templating, image optimization, SVG sprite generation, WebP support, FTP/ZIP deployment, and live-reload.

Author: Arsen Parfinovich
Version: 3.1.0
License: ISC

📦 Installation
npm install

⚙️ Available Scripts

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Start development server with BrowserSync (`dist/`) |
| `npm run build`     | Build the project for production (`dist/`)          |
| `npm run zip`       | Build and archive the project as `.zip`             |
| `npm run deploy`    | Build and deploy via FTP (see `gulp/config/ftp.js`) |
| `npm run svgSprive` | Generate SVG sprite from icons                      |
| `npm run preview`   | Preview production build with `browser-sync`        |


🧰 Features

✅ SCSS with Autoprefixer and media query grouping

✅ HTML templating via gulp-file-include

✅ Image optimization + automatic WebP generation

✅ Style and markup validation (Stylelint, HTMLHint)

✅ Error handling via gulp-plumber

✅ JavaScript bundling with Webpack and Babel

✅ SVG sprite generation

✅ Responsive image handling

✅ Custom favicon generation

✅ Live-reload with browser-sync

✅ Deployment via FTP or ZIP


📁 Project Structure
gulp-2025/
│
├── src/           # Source files
│   ├── html/      # HTML files with includes
│   ├── scss/      # SCSS modules, variables, mixins
│   ├── js/        # JavaScript modules
│   ├── img/       # Raw images
│   ├── fonts/     # Fonts (used with fontmin)
│   └── svgicons/  # Icons for SVG sprite
│
├── dist/          # Compiled project (auto-generated)
├── gulp/          # Gulp tasks and config
│
└── gulpfile.js    # Main Gulp entry file

💡 Notes
Uses type: "module" — ensure Node.js v14+

FTP credentials should be configured in gulp/config/ftp.js

Customize favicon settings in gulp/config/favicon.js

This setup is ideal for landing pages, HTML templates, or integrating with CMS like WordPress

🔗 Credits & Contributions
This is a personal setup built and maintained by Arsen Parfinovich. (https://parfinovich.dev/)
Feel free to fork, adapt, or contribute!
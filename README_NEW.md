# 🏛️ My Temple - Modern Gulp Build v3.5 (2025)

## ✨ Описание
Современная Gulp сборка 2025 года с поддержкой последних технологий и полной модернизацией архитектуры.

## 🚀 Основные возможности
- **Современный SCSS** с Dart Sass 1.93.2 и module system
- **TypeScript** поддержка из коробки
- **Webpack 5** для JavaScript с оптимизацией
- **Vite** как альтернативный быстрый бандлер
- **WebP + Responsive Images** автоматическая генерация
- **Live Server** с hot reload и синхронизацией
- **CSS Grid + Flexbox** современные layout системы
- **Автопрефиксы** для всех браузеров
- **Линтинг** CSS, HTML, JavaScript
- **Деплой** FTP и ZIP упаковка

## 📦 Технологический стек
- **Gulp 5.0.1** - система сборки
- **Sass 1.93.2** - CSS препроцессор  
- **PostCSS** - современная обработка CSS
- **Webpack 5.99.9** - JavaScript бандлер
- **Vite 6.0.7** - альтернативный dev сервер
- **TypeScript 5.7.4** - типизированный JavaScript
- **Stylelint 16.24.0** - линтер для CSS
- **Lightning CSS** - быстрая обработка стилей

## 🎯 Быстрый старт
```bash
# Установка зависимостей
npm install

# Разработка с live reload
npm run dev

# Продакшен сборка
npm run build
```

## 📋 Доступные команды

### Основные команды
```bash
npm run dev          # Режим разработки
npm run build        # Продакшен сборка
npm run vite:dev     # Vite dev сервер (быстрее)
npm run vite:build   # Vite сборка
```

### Линтинг и проверки
```bash
npm run lint:css     # Проверка SCSS/CSS
npm run lint:html    # Проверка HTML
npm run validate:html # Валидация HTML
```

### Деплой
```bash
npm run deploy:ftp   # FTP деплой
npm run deploy:zip   # ZIP архив
```

## 📁 Структура проекта
```
src/
├── html/              # HTML части и компоненты
│   ├── head.html      # Мета-теги и подключения
│   ├── header.html    # Шапка сайта
│   ├── hero.html      # Главный экран
│   └── footer.html    # Подвал
├── scss/              # SCSS стили
│   ├── base/          # Базовые стили
│   │   ├── _variables.scss  # Переменные
│   │   ├── _mixins.scss     # Миксины
│   │   └── _main.scss       # Основные стили
│   ├── blocks/        # Блоки/компоненты
│   ├── utils/         # Утилиты и хелперы
│   └── style.scss     # Главный файл стилей
├── js/                # JavaScript модули
│   ├── modules/       # JS модули
│   └── app.js         # Точка входа
├── img/               # Изображения
│   ├── icons/         # Иконки SVG
│   ├── logos/         # Логотипы
│   └── svg/           # SVG спрайты
└── fonts/             # Шрифты (TTF → WOFF2)

dist/                  # Собранные файлы
├── css/               # Стили (+ minified)
├── js/                # Скрипты (+ sourcemaps)
├── img/               # Оптимизированные картинки
├── fonts/             # Конвертированные шрифты
└── favicon/           # Фавиконки всех размеров

gulp/                  # Конфигурация Gulp
├── config/            # Настройки
├── tasks/             # Задачи сборки
└── tools/             # Вспомогательные утилиты
```

## 🎨 SCSS Архитектура

### Современные миксины
```scss
// Responsive breakpoints
@include respond-to('md') {
  // Стили для планшетов
}

// Aspect ratio
@include aspect-ratio(16, 9);

// Legacy compatibility (старые миксины работают)
@include respond(lg) {
  // Обратная совместимость
}
```

### Переменные
```scss
// Цветовая палитра
$primary-color: map.get($colors, 'primary');
$secondary-color: map.get($colors, 'secondary');

// Брейкпоинты
$breakpoints: (
  'xs': 320px,
  'sm': 768px,
  'md': 1024px,
  'lg': 1440px,
  'xl': 1920px,
  'xxl': 2560px
);
```

## 🖼️ Работа с изображениями

### Автогенерация responsive images
- Создание WebP версий
- Адаптивные размеры (320px, 768px, 1024px, 1440px)
- Retina версии (@2x)
- Оптимизация размера файлов

### Использование в HTML
```html
<picture>
  <source srcset="img/photo-320.webp 320w" type="image/webp">
  <img src="img/photo-320.jpg" alt="Description" loading="lazy">
</picture>
```

## ⚡ Производительность
- **Параллельная обработка** задач Gulp
- **Code splitting** в Webpack
- **Tree shaking** неиспользуемого кода  
- **CSS минификация** с оптимизацией
- **Gzip сжатие** статики
- **Кеширование** сборки

## 🌐 Поддержка браузеров
- **Modern browsers**: последние 2 версии
- **IE 11+** с полифилами
- **Mobile Safari**: iOS 12+
- **Chrome Android**: версия 88+

## 📱 Responsive Design
```scss
// Mobile First подход
.component {
  // Базовые стили для мобильных
  
  @include respond-to('md') {
    // Стили для планшетов
  }
  
  @include respond-to('lg') {  
    // Стили для десктопов
  }
}
```

## 🔧 Настройка и кастомизация

### Добавление новых задач
```javascript
// gulp/tasks/custom.js
export const customTask = () => {
  return app.gulp.src('src/custom/**/*')
    .pipe(/* обработка */)
    .pipe(app.gulp.dest('dist/custom/'));
};
```

### Конфигурация путей
```javascript
// gulp/config/path.js
export const path = {
  build: {
    custom: `${buildFolder}/custom/`
  },
  src: {
    custom: `${srcFolder}/custom/**/*`
  }
};
```

## 📚 Полезные ссылки
- [Sass документация](https://sass-lang.com/)
- [Gulp документация](https://gulpjs.com/)
- [Webpack Guide](https://webpack.js.org/)
- [PostCSS плагины](https://postcss.org/)

## 🤝 Поддержка
- **Node.js**: 18+ LTS
- **npm**: 9+
- **Git**: для клонирования

## 📄 Лицензия
MIT License - используйте свободно в любых проектах

---

## 🎉 Готово к использованию!

Современная, быстрая и надежная сборка для профессиональной веб-разработки в 2025 году.

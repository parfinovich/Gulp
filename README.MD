# Gulp 2025: Nunjucks Starter

Frontend-сборка на Gulp 5 с Nunjucks для HTML, Sass, Webpack, оптимизацией изображений и BrowserSync. Nunjucks отвечает только за шаблоны; стили, JavaScript и изображения продолжают собираться существующими Gulp-задачами.

## Требования

- Node.js 20.18.0 или новее
- npm 10.8.2 или новее

```bash
nvm install 20
nvm use 20
npm install
```

## Быстрый старт

```bash
npm run dev
```

Dev-режим запускает BrowserSync и следит за `.html`, `.njk`, `.json`, SCSS, JavaScript и изображениями. Изменение любого шаблона или файла данных автоматически пересобирает страницу.

```bash
npm run build
npm run lint
npm run validate:html
```

`build` создаёт готовый сайт в `dist/`. `lint` проверяет SCSS и исходные страницы `.html`. `validate:html` проверяет итоговые HTML-файлы после рендеринга Nunjucks.

## Команды

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Разработка с watcher и BrowserSync |
| `npm run build` | Production-сборка в `dist/` |
| `npm run build:clean` | Очистка `dist/` и новая сборка |
| `npm run lint` | Stylelint и проверка исходных HTML-страниц |
| `npm run lint:scss` | Проверка и автоисправление SCSS |
| `npm run lint:html` | Проверка входных `.html`-страниц |
| `npm run validate:html` | Проверка HTML в `dist/` |
| `npm run preview` | Просмотр готовой папки `dist/` |
| `npm run zip` | Сборка и ZIP-архив |
| `npm run deploy` | Сборка и FTP-деплой |
| `npm run clean` | Удаление `dist/` |

## Структура

```text
src/
├── index.html                 # Страница: объявляет page и extends layout
├── data/
│   ├── site.json              # Общие данные сайта
│   └── home.json              # Данные главной страницы
├── templates/
│   ├── layouts/
│   │   └── base.njk           # Каркас документа и block content
│   ├── partials/
│   │   ├── header.njk         # Общая шапка
│   │   └── footer.njk         # Общий подвал
│   ├── components/
│   │   ├── button.njk         # Переиспользуемый macro
│   │   └── feature-card.njk
│   └── sections/
│       ├── hero.njk
│       ├── features.njk
│       └── about.njk
├── scss/
│   ├── base/                  # Reset, токены, глобальные правила
│   ├── layout/                # Container, header, footer
│   ├── components/            # Button, card, navigation
│   ├── sections/              # Стили конкретных секций
│   └── utilities/             # Адаптивные и служебные правила
├── js/
│   ├── core/                  # Bootstrap приложения
│   └── components/            # Переиспользуемые DOM-модули
├── img/
├── fonts/
└── files/
```

Входные страницы находятся непосредственно в `src/`: `src/index.html` превращается в `dist/index.html`, а `src/about.html` — в `dist/about.html`. Файлы из `src/templates/` не копируются в `dist/`; они используются только как шаблоны.

## SCSS

[style.scss](src/scss/style.scss) — единственная входная точка стилей. Она подключает partial-файлы через `@use` в предсказуемом порядке: base, layout, components, sections, utilities.

- Новую CSS-переменную добавляйте в `base/_tokens.scss`.
- Общий элемент интерфейса помещайте в `components/`.
- Стили, используемые только одной Nunjucks-секцией, помещайте в `sections/` с тем же именем: `sections/hero.njk` и `scss/sections/_hero.scss`.
- После создания partial-файла добавьте `@use` в `style.scss`.
- Адаптивные правила храните рядом с компонентом, если они относятся только к нему; общие правила — в `utilities/_media.scss`.

Пример новой секции:

```scss
// src/scss/sections/_pricing.scss
.pricing {
	padding: 4rem 0;
}
```

```scss
// src/scss/style.scss
@use 'sections/pricing';
```

## JavaScript

[app.js](src/js/app.js) — единственная entry-точка Webpack. Он собирает массив initializers и передаёт его в [initialize.js](src/js/core/initialize.js). Каждый модуль получает `document` или переданный root и не ищет элементы до вызова initializer.

```js
// src/js/components/modal.js
export const initModal = (root) => {
	const modal = root.querySelector('[data-modal]');

	if (!modal) {
		return;
	}

	// Event listeners for this component.
};
```

Подключите модуль в `app.js`:

```js
import { initModal } from './components/modal.js';

initialize([initAnchorLinks, initModal]);
```

Такая схема не выполняет код для отсутствующих на странице элементов и одинаково подходит для одной или нескольких страниц.

## Как устроен рендеринг

Задача [gulp/tasks/html.js](gulp/tasks/html.js) загружает два объекта:

```js
data: {
	site: fsExtra.readJsonSync('src/data/site.json'),
	home: fsExtra.readJsonSync('src/data/home.json')
}
```

В любом `.njk` и входном `.html` доступны `site` и `home`. Например:

```njk
<a href="#top">{{ site.brand }}</a>
<h1>{{ home.hero.title }}</h1>
```

Nunjucks экранирует вывод в `{{ ... }}`. Не используйте фильтр `safe` для значений из CMS, форм или других недоверенных источников.

## Страница и layout

Каждая страница задаёт метаданные, наследует layout и определяет содержимое блока:

```njk
{% set page = {
	title: "About",
	description: "About our company",
	slug: "about",
	bodyId: "top"
} %}
{% extends "layouts/base.njk" %}

{% block content %}
	{% include "sections/about.njk" %}
{% endblock %}
```

`base.njk` содержит `doctype`, `<head>`, header, `<main>`, footer и подключение JavaScript. В layout можно добавлять новые блоки для специальных страниц:

```njk
<head>
	{% block head %}{% endblock %}
</head>
```

А в странице переопределять их:

```njk
{% block head %}
	<meta property="og:title" content="{{ page.title }}" />
{% endblock %}
```

## Include и секции

`include` вставляет другой шаблон в текущем контексте:

```njk
{% include "sections/hero.njk" %}
```

Секции хранят крупные самостоятельные части страницы. Создавайте новую секцию в `src/templates/sections/`, затем подключайте её в нужной странице. Общие header и footer остаются в `partials/` и подключаются из layout, поэтому не нужно дублировать их в каждой странице.

## Данные JSON

Общие данные находятся в `src/data/site.json`, а контент главной — в `src/data/home.json`.

```json
{
	"features": {
		"title": "Features",
		"items": [
			{ "title": "Fast", "description": "Optimized workflow." }
		]
	}
}
```

В шаблоне используйте поле напрямую или перебирайте массив:

```njk
<h2>{{ home.features.title }}</h2>
{% for item in home.features.items %}
	<h3>{{ item.title }}</h3>
	<p>{{ item.description }}</p>
{% endfor %}
```

Для новой группы данных создайте JSON, например `src/data/pricing.json`, и добавьте его в `data` в [gulp/tasks/html.js](gulp/tasks/html.js):

```js
data: {
	site: fsExtra.readJsonSync('src/data/site.json'),
	home: fsExtra.readJsonSync('src/data/home.json'),
	pricing: fsExtra.readJsonSync('src/data/pricing.json')
}
```

После этого в шаблонах доступен объект `pricing`. Не помещайте секреты, токены или приватные настройки в `src/data`: эти данные рендерятся в публичный HTML.

## Macros: переиспользуемая разметка

Macro — функция шаблона. Его удобно применять для карточек, кнопок, бейджей и других повторяющихся элементов. Пример [button.njk](src/templates/components/button.njk):

```njk
{% macro button(action) -%}
<a class="button button--{{ action.variant }}" href="{{ action.href }}">{{ action.label }}</a>
{%- endmacro %}
```

Импорт и вызов:

```njk
{% from "components/button.njk" import button %}

{% for action in home.hero.actions %}
	{{ button(action) }}
{% endfor %}
```

Передавайте в macro объект, если у компонента несколько параметров. Это проще расширять, чем длинный список аргументов.

## Условия, переменные и фильтры

```njk
{% set hasItems = home.features.items.length > 0 %}

{% if hasItems %}
	{% for item in home.features.items %}
		{{ item.title | upper }}
	{% endfor %}
{% else %}
	<p>No features yet.</p>
{% endif %}
```

Часто используемые фильтры: `default`, `lower`, `upper`, `capitalize`, `replace`, `join`, `length`. Для запасного значения:

```njk
{{ page.description | default("Project description") }}
```

## Многостраничный сайт

1. Создайте `src/about.html`.
2. Задайте `page` и расширьте `layouts/base.njk`.
3. Подключите уникальные секции в блок `content`.
4. Добавьте данные в существующий JSON или зарегистрируйте новый файл в `gulp/tasks/html.js`.
5. Добавьте ссылку в `site.navigation`, если она нужна в header.
6. Запустите `npm run build` и `npm run validate:html`.

Для ссылок между страницами используйте `href="./about.html"`. Активный пункт навигации сравнивается с `page.slug` в [header.njk](src/templates/partials/header.njk).

## Изображения и ассеты

- Путь `@img/example.jpg` в шаблоне преобразуется в `img/example.jpg` HTML-задачей.
- Исходные изображения размещайте в `src/img/`.
- Стили подключает layout: `./css/style.css`.
- JavaScript подключает layout: `./js/app.min.js`.
- В production к CSS и JS добавляется параметр версии для сброса кэша.

## Проверка и диагностика

Полная проверка перед отправкой изменений:

```bash
npm run build && npm run lint && npm run validate:html
```

Если Nunjucks сообщает об ошибке:

- проверьте путь в `extends`, `include` или `from`: он считается относительно `src/templates/`;
- убедитесь, что JSON валиден и зарегистрирован в `gulp/tasks/html.js`;
- проверьте точное имя поля и область видимости: `site`, `home`, `page`;
- пересоберите проект, а не редактируйте `dist/` вручную.

`dist/` — результат сборки и всегда перезаписывается. Редактируйте только `src/` и Gulp-конфигурацию.

## Ограничения текущей схемы

- Данные загружаются явно из `site.json` и `home.json`; новые JSON-файлы нужно добавить в HTML-задачу.
- Валидация Nunjucks-шаблонов выполняется косвенно через успешный рендер и `npm run validate:html` для `dist/`.
- Для секретов используйте переменные окружения, а не JSON-данные шаблонов.

## Лицензия

ISC. Автор: Arsen Parfinovich.

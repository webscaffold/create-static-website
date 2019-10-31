```
npm i
npm run build # (node 12+ required)
```

The `src` folder uses [11ty](https://www.11ty.io).

# Configs

`/site.config.js` allows you to configure the website.

# Data

All templates have access to the following:

- `conf.origin` - Origin of the website, for creating absolute URLs.
- `conf.path` - Path of the site. / if it's top-level.
- `conf.websiteName` - Name of the website.

# Helpers

## `{% className cssPath, class %}`

CSS files are processed as [CSS Modules](https://github.com/css-modules/css-modules). Within a template, reference classnames like this:

```njk
{% className cssPath, class %}
```

…and it will output the transformed class name. Eg:

```njk
{% set css = "/_includes/comp/style.css" %}
<h2 class="{% className css, 'comp-header' %}">Building offline-first apps</h2>
<div class="{% className css, 'comp-description' %}">
  …
</div>
```

In the example above, `set` is used to avoid repeating the path to the CSS.

## `{% css page, cssURL %}`

This will output a `<link>` pointing to the `cssURL` unless it's been included already for the current page. This means you can use an include multiple times without loading the CSS multiple times.

- `page` - This is the page object available in every template.
- `cssURL` - CSS url.

Example:

```njk
{% set css = "/_includes/comp/style.css" %}
{% css page, css %}
```

## `siteAsset(url)`

In templates and CSS, references assets via `siteAsset('/path/to/asset.jpg')`. This will be replaced with the hashed name of the asset.

```njk
<link rel="stylesheet" href="siteAsset('/_includes/comp/style.css')">
```

```css
.whatever {
  background: url('siteAsset(asset.jpg)');
}
```

Assets ending `.js` will be bundled together using Rollup.

Copy pasted and streamlined from here https://github.com/GoogleChrome/devsummit Thank you all for sharing this.

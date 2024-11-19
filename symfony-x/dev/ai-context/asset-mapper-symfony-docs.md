# AssetMapper: Simple, Modern CSS & JS Management

The AssetMapper component lets you write modern JavaScript and CSS without the complexity of using a bundler. Browsers already support many modern JavaScript features like the `import` statement and ES6 classes. And the HTTP/2 protocol means that combining your assets to reduce HTTP connections is no longer urgent. This component is a light layer that helps serve your files directly to the browser.

## The component has two main features:

1. **Mapping & Versioning Assets:**  
   All files inside of `assets/` are made available publicly and versioned. You can reference the file `assets/images/product.jpg` in a Twig template with `{{ asset('images/product.jpg') }}`. The final URL will include a version hash, like `/assets/images/product-3c16d9220694c0e56d8648f25e6035e9.jpg`.

2. **Importmaps:**  
   A native browser feature that makes it easier to use the JavaScript `import` statement (e.g., `import { Modal } from 'bootstrap'`) without a build system. It's supported in all browsers (thanks to a shim) and is part of the HTML standard.

## Installation

To install the AssetMapper component, run:

```bash
composer require symfony/asset-mapper symfony/asset symfony/twig-pack
```

In addition to `symfony/asset-mapper`, this also makes sure that you have the Asset Component and Twig available.

### If you're using Symfony Flex, you're done!

The recipe just added a number of files:

- `assets/app.js`  
  Your main JavaScript file;
  
- `assets/styles/app.css`  
  Your main CSS file;
  
- `config/packages/asset_mapper.yaml`  
  Where you define your asset "paths";
  
- `importmap.php`  
  Your importmap config file.

It also updated the `templates/base.html.twig` file:

```twig
{% block javascripts %}
    {% block importmap %}{{ importmap('app') }}{% endblock %}
{% endblock %}
```

If you're not using Flex, you'll need to create & update these files manually. See the latest asset-mapper recipe for the exact content of these files.

## Mapping and Referencing Assets

The AssetMapper component works by defining directories/paths of assets that you want to expose publicly. These assets are then versioned and easy to reference. Thanks to the `asset_mapper.yaml` file, your app starts with one mapped path: the `assets/` directory.

If you create an `assets/images/duck.png` file, you can reference it in a template with:

```twig
<img src="{{ asset('images/duck.png') }}">
```

The path `images/duck.png` is relative to your mapped directory (`assets/`). This is known as the **logical path** to your asset.

If you look at the HTML in your page, the URL will be something like: `/assets/images/duck-3c16d9220694c0e56d8648f25e6035e9.png`. If you change the file, the version part of the URL will also change automatically.

## Serving Assets in Development vs Production

- **Development Environment:**  
  In the dev environment, the URL `/assets/images/duck-3c16d9220694c0e56d8648f25e6035e9.png` is handled and returned by your Symfony app.

- **Production Environment:**  
  Before deploy, you should run:

  ```bash
  php bin/console asset-map:compile
  ```

  This will physically copy all the files from your mapped directories to `public/assets/` so that they're served directly by your web server. See [Deployment](#deploying-with-the-assetmapper-component) for more details.

  If you run the `asset-map:compile` command on your development machine, you won't see any changes made to your assets when reloading the page. To resolve this, delete the contents of the `public/assets/` directory. This will allow your Symfony application to serve those assets dynamically again.

### Customizing Asset Compilation Location

If you need to copy the compiled assets to a different location (e.g., upload them to S3), create a service that implements `Symfony\Component\AssetMapper\Path\PublicAssetsFilesystemInterface` and set its service ID (or an alias) to `asset_mapper.local_public_assets_filesystem` to replace the built-in service.

## Debugging: Seeing All Mapped Assets

To see all of the mapped assets in your app, run:

```bash
php bin/console debug:asset-map
```

This will show you all the mapped paths and the assets inside of each:

### AssetMapper Paths

| Path   | Namespace Prefix |
|--------|-------------------|
| assets |                   |

### Mapped Assets

| Logical Path      | Filesystem Path               |
|-------------------|-------------------------------|
| app.js            | assets/app.js                 |
| styles/app.css    | assets/styles/app.css         |
| images/duck.png   | assets/images/duck.png        |

The **Logical Path** is the path to use when referencing the asset, like from a template.

## Importmaps & Writing JavaScript

All modern browsers support the JavaScript `import` statement and modern ES6 features like classes. So this code "just works":

```javascript
// assets/app.js
import Duck from './duck.js';

const duck = new Duck('Waddles');
duck.quack();
```

```javascript
// assets/duck.js
export default class {
    constructor(name) {
        this.name = name;
    }
    quack() {
        console.log(`${this.name} says: Quack!`);
    }
}
```

Thanks to the `{{ importmap('app') }}` Twig function call, which you'll learn about in this section, the `assets/app.js` file is loaded & executed by the browser.

### Importing Relative Files

When importing relative files, be sure to include the `.js` filename extension. Unlike in Node.js, this extension is required in the browser environment.

### Importing 3rd Party JavaScript Packages

Suppose you want to use an npm package, like Bootstrap. Technically, this can be done by importing its full URL, like from a CDN:

```javascript
import { Alert } from 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/+esm';
```

But yikes! Needing to include that URL is a pain! Instead, we can add this package to our "importmap" via the `importmap:require` command. This command can be used to add any npm package:

```bash
php bin/console importmap:require bootstrap
```

This adds the Bootstrap package to your `importmap.php` file:

```php
// importmap.php
return [
    'app' => [
        'path' => './assets/app.js',
        'entrypoint' => true,
    ],
    'bootstrap' => [
        'version' => '5.3.0',
    ],
];
```

Sometimes, a package—like Bootstrap—will have one or more dependencies, such as `@popperjs/core`. The `importmap:require` command will add both the main package and its dependencies. If a package includes a main CSS file, that will also be added (see [Handling 3rd-Party CSS](#handling-3rd-party-css)).

If you get a 404 error, there might be some issue with the JavaScript package that prevents it from being served by the jsDelivr CDN. For example, the package might be missing properties like `main` or `module` in its `package.json` configuration file. Try to contact the package maintainer to ask them to fix those issues.

Now you can import the Bootstrap package like usual:

```javascript
import { Alert } from 'bootstrap';
// ...
```

All packages in `importmap.php` are downloaded into an `assets/vendor/` directory, which should be ignored by git (the Flex recipe adds it to `.gitignore` for you). You'll need to run the following command to download the files on other computers if some are missing:

```bash
php bin/console importmap:install
```

You can update your third-party packages to their current versions by running:

```bash
php bin/console importmap:outdated

php bin/console importmap:update

php bin/console importmap:update bootstrap lodash
php bin/console importmap:outdated bootstrap lodash
```

### How Does the Importmap Work?

How does this `importmap.php` file allow you to import Bootstrap? That's thanks to the `{{ importmap() }}` Twig function in `base.html.twig`, which outputs an importmap:

```html
<script type="importmap">{
    "imports": {
        "app": "/assets/app-4e986c1a2318dd050b1d47db8d856278.js",
        "/assets/duck.js": "/assets/duck-1b7a64b3b3d31219c262cf72521a5267.js",
        "bootstrap": "/assets/vendor/bootstrap/bootstrap.index-f0935445d9c6022100863214b519a1f2.js"
    }
}</script>
```

Import maps are a native browser feature. When you import Bootstrap from JavaScript, the browser will look at the importmap and see that it should fetch the package from the associated path.

But where did the `/assets/duck.js` import entry come from? That doesn't live in `importmap.php`. Great question!

The `assets/app.js` file above imports `./duck.js`. When you import a file using a relative path, your browser looks for that file relative to the one importing it. So, it would look for `/assets/duck.js`. That URL would be correct, except that the `duck.js` file is versioned. Fortunately, the AssetMapper component sees the import and adds a mapping from `/assets/duck.js` to the correct, versioned filename. The result: importing `./duck.js` just works!

The `importmap()` function also outputs an ES module shim so that older browsers understand import maps (see the polyfill config).

### The "app" Entrypoint & Preloading

An "entrypoint" is the main JavaScript file that the browser loads, and your app starts with one by default:

```php
// importmap.php
return [
    'app' => [
        'path' => './assets/app.js',
        'entrypoint' => true,
    ],
    // ...
];
```

In addition to the importmap, the `{{ importmap('app') }}` in `base.html.twig` outputs a few other things, including:

```html
<script type="module">import 'app';</script>
```

This line tells the browser to load the app importmap entry, which causes the code in `assets/app.js` to be executed.

The `importmap()` function also outputs a set of "preloads":

```html
<link rel="modulepreload" href="/assets/app-4e986c1a2318dd050b1d47db8d856278.js">
<link rel="modulepreload" href="/assets/duck-1b7a64b3b3d31219c262cf72521a5267.js">
```

This is a performance optimization and you can learn more about below in [Performance: Add Preloading](#performance-understanding-preloading).

### Importing Specific Files From a 3rd Party Package

Sometimes you'll need to import a specific file from a package. For example, suppose you're integrating Highlight.js and want to import just the core and a specific language:

```javascript
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);
hljs.highlightAll();
```

In this case, adding the `highlight.js` package to your `importmap.php` file won't work: whatever you import—e.g., `highlight.js/lib/core`—needs to exactly match an entry in the `importmap.php` file.

Instead, use `importmap:require` and pass it the exact paths you need. This also shows how you can require multiple packages at once:

```bash
php bin/console importmap:require highlight.js/lib/core highlight.js/lib/languages/javascript
```

## Global Variables like jQuery

You might be accustomed to relying on global variables—like jQuery's `$` variable:

```javascript
// assets/app.js
import 'jquery';

// app.js or any other file
$('.something').hide(); // WILL NOT WORK!
```

But in a module environment (like with AssetMapper), when you import a library like jQuery, it does not create a global variable. Instead, you should import it and set it to a variable in every file you need it:

```javascript
import $ from 'jquery';
$('.something').hide();
```

You can even do this from an inline script tag:

```html
<script type="module">
    import $ from 'jquery';
    $('.something').hide();
</script>
```

### Setting Global Variables Manually

If you do need something to become a global variable, you do it manually from inside `app.js`:

```javascript
import $ from 'jquery';
// things on "window" become global variables
window.$ = $;
```

## Handling CSS

CSS can be added to your page by importing it from a JavaScript file. The default `assets/app.js` already imports `assets/styles/app.css`:

```javascript
// assets/app.js
import '../styles/app.css';

// ...
```

When you call `importmap('app')` in `base.html.twig`, AssetMapper parses `assets/app.js` (and any JavaScript files that it imports) looking for import statements for CSS files. The final collection of CSS files is rendered onto the page as `<link>` tags in the order they were imported.

Importing a CSS file is not something that is natively supported by JavaScript modules. AssetMapper makes this work by adding a special importmap entry for each CSS file. These special entries are valid but do nothing. AssetMapper adds a `<link>` tag for each CSS file, but when JavaScript executes the import statement, nothing additional happens.

### Handling 3rd-Party CSS

Sometimes a JavaScript package will contain one or more CSS files. For example, the Bootstrap package has a `dist/css/bootstrap.min.css` file.

You can require CSS files in the same way as JavaScript files:

```bash
php bin/console importmap:require bootstrap/dist/css/bootstrap.min.css
```

To include it on the page, import it from a JavaScript file:

```javascript
// assets/app.js
import 'bootstrap/dist/css/bootstrap.min.css';

// ...
```

Some packages—like Bootstrap—advertise that they contain a CSS file. In those cases, when you `importmap:require bootstrap`, the CSS file is also added to `importmap.php` for convenience. If some package doesn't advertise its CSS file in the `style` property of the `package.json` configuration file, try to contact the package maintainer to ask them to add that.

### Paths Inside of CSS Files

From inside CSS, you can reference other files using the normal CSS `url()` function and a relative path to the target file:

```css
/* assets/styles/app.css */
.quack {
    /* file lives at assets/images/duck.png */
    background-image: url('../images/duck.png');
}
```

The path in the final `app.css` file will automatically include the versioned URL for `duck.png`:

```css
/* public/assets/styles/app-3c16d9220694c0e56d8648f25e6035e9.css */
.quack {
    background-image: url('../images/duck-3c16d9220694c0e56d8648f25e6035e9.png');
}
```

## Using Tailwind CSS

To use the Tailwind CSS framework with the AssetMapper component, check out [symfonycasts/tailwind-bundle](https://symfonycasts.com/screencast/tailwind-bundle).

## Using Sass

To use Sass with the AssetMapper component, check out [symfonycasts/sass-bundle](https://symfonycasts.com/screencast/sass-bundle).

## Lazily Importing CSS from a JavaScript File

If you have some CSS that you want to load lazily, you can do that via the normal, "dynamic" import syntax:

```javascript
// assets/any-file.js
import('./lazy.css');

// ...
```

In this case, `lazy.css` will be downloaded asynchronously and then added to the page. If you use a dynamic import to lazily-load a JavaScript file and that file imports a CSS file (using the non-dynamic import syntax), that CSS file will also be downloaded asynchronously.

## Issues and Debugging

There are a few common errors and problems you might run into.

### Missing importmap Entry

One of the most common errors will come from your browser's console and will look something like this:

```
Failed to resolve module specifier "bootstrap". Relative references must start with either "/", "./", or "../".
```

Or:

```
The specifier "bootstrap" was a bare specifier, but was not remapped to anything. Relative module specifiers must start with "./", "../" or "/".
```

This means that, somewhere in your JavaScript, you're importing a 3rd party package—e.g., `import 'bootstrap'`. The browser tries to find this package in your importmap file, but it's not there.

**The fix is almost always to add it to your importmap:**

```bash
php bin/console importmap:require bootstrap
```

Some browsers, like Firefox, show where this "import" code lives, while others like Chrome currently do not.

### 404 Not Found for a JavaScript, CSS, or Image File

Sometimes a JavaScript file you're importing (e.g., `import './duck.js'`), or a CSS/image file you're referencing won't be found, and you'll see a 404 error in your browser's console. You'll also notice that the 404 URL is missing the version hash in the filename (e.g., a 404 to `/assets/duck.js` instead of a path like `/assets/duck.1b7a64b3b3d31219c262cf72521a5267.js`).

This is usually because the path is wrong. If you're referencing the file directly in a Twig template:

```twig
<img src="{{ asset('images/duck.png') }}">
```

Then the path that you pass `asset()` should be the "logical path" to the file. Use the `debug:asset-map` command to see all valid logical paths in your app.

More likely, you're importing the failing asset from a CSS file (e.g., `@import url('other.css')`) or a JavaScript file:

```javascript
// assets/controllers/farm-controller.js
import '../farm/chicken.js';
```

When doing this, the path should be relative to the file that's importing it (and, in JavaScript files, should start with `./` or `../`). In this case, `../farm/chicken.js` would point to `assets/farm/chicken.js`. To see a list of all invalid imports in your app, run:

```bash
php bin/console cache:clear
php bin/console debug:asset-map
```

Any invalid imports will show up as warnings on top of the screen (make sure you have `symfony/monolog-bundle` installed):

```
WARNING   [asset_mapper] Unable to find asset "../images/ducks.png" referenced in "assets/styles/app.css".
WARNING   [asset_mapper] Unable to find asset "./ducks.js" imported from "assets/app.js".
```

### Missing Asset Warnings on Commented-out Code

The AssetMapper component looks in your JavaScript files for import lines so that it can automatically add them to your importmap. This is done via regex and works very well, though it isn't perfect. If you comment out an import, it will still be found and added to your importmap. That doesn't harm anything but could be surprising.

If the imported path cannot be found, you'll see a warning log when that asset is being built, which you can ignore.

## Deploying with the AssetMapper Component

When you're ready to deploy, "compile" your assets by running this command:

```bash
php bin/console asset-map:compile
```

This will write all your versioned asset files into the `public/assets/` directory, along with a few JSON files (`manifest.json`, `importmap.json`, etc.) so that the importmap can be rendered lightning fast.

## Optimizing Performance

To make your AssetMapper-powered site fly, there are a few things you need to do. If you want to take a shortcut, you can use a service like Cloudflare, which will automatically do most of these things for you:

1. **Use HTTP/2:**  
   Your web server should be running HTTP/2 (or HTTP/3) so the browser can download assets in parallel. HTTP/2 is automatically enabled in Caddy and can be activated in Nginx and Apache. Or, proxy your site through a service like Cloudflare, which will automatically enable HTTP/2 for you.

2. **Compress your assets:**  
   Your web server should compress (e.g., using gzip) your assets (JavaScript, CSS, images) before sending them to the browser. This is automatically enabled in Caddy and can be activated in Nginx and Apache. In Cloudflare, assets are compressed by default.

3. **Set long-lived cache expiry:**  
   Your web server should set a long-lived `Cache-Control` HTTP header on your assets. Because the AssetMapper component includes a version hash in the filename of each asset, you can safely set `max-age` to a very long time (e.g., 1 year). This isn't automatic in any web server but can be easily enabled.

Once you've done these things, you can use a tool like Lighthouse to check the performance of your site.

### Performance: Understanding Preloading

One issue that Lighthouse may report is:

**Avoid Chaining Critical Requests**

To understand the problem, imagine this theoretical setup:

- `assets/app.js` imports `./duck.js`
- `assets/duck.js` imports `bootstrap`

Without preloading, when the browser downloads the page, the following would happen:

1. The browser downloads `assets/app.js`;
2. It then sees the `./duck.js` import and downloads `assets/duck.js`;
3. It then sees the Bootstrap import and downloads `assets/bootstrap.js`.

Instead of downloading all 3 files in parallel, the browser would be forced to download them one-by-one as it discovers them. That would hurt performance.

AssetMapper avoids this problem by outputting "preload" `<link>` tags. The logic works like this:

1. **When you call `importmap('app')` in your template,**  
   the AssetMapper component looks at the `assets/app.js` file and finds all of the JavaScript files that it imports or files that those files import, etc.

2. **It then outputs a `<link>` tag for each of those files with a `rel="preload"` attribute.**  
   This tells the browser to start downloading those files immediately, even though it hasn't yet seen the import statement for them.

Additionally, if the WebLink Component is available in your application, Symfony will add a `Link` header in the response to preload the CSS files.

## Frequently Asked Questions

### Does the AssetMapper Component Combine Assets?

**Nope! But that's because this is no longer necessary!**

In the past, it was common to combine assets to reduce the number of HTTP requests that were made. Thanks to advances in web servers like HTTP/2, it's typically not a problem to keep your assets separate and let the browser download them in parallel. In fact, by keeping them separate, when you update one asset, the browser can continue to use the cached version of all of your other assets.

See [Optimization](#optimizing-performance) for more details.

### Does the AssetMapper Component Minify Assets?

**Nope!** In most cases, this is perfectly fine. The web asset compression performed by web servers before sending them is usually sufficient. However, if you think you could benefit from minifying assets (in addition to later compressing them), you can use the [SensioLabs Minify Bundle](https://github.com/SensioLabs/MinifyBundle).

This bundle integrates seamlessly with AssetMapper and minifies all web assets automatically when running the `asset-map:compile` command (as explained in the [Serving Assets in Production](#serving-assets-in-production) section).

See [Optimization](#optimizing-performance) for more details.

### Is the AssetMapper Component Production Ready? Is it Performant?

**Yes! Very!** The AssetMapper component leverages advances in browser technology (like importmaps and native import support) and web servers (like HTTP/2, which allows assets to be downloaded in parallel). See the other questions about minimization and combination and [Optimization](#optimizing-performance) for more details.

The [https://ux.symfony.com](https://ux.symfony.com) site runs on the AssetMapper component and has a 99% Google Lighthouse score.

### Does the AssetMapper Component work in All Browsers?

**Yes!** Features like importmaps and the `import` statement are supported in all modern browsers, but the AssetMapper component ships with an ES module shim to support importmap in old browsers. So, it works everywhere (see note below).

Inside your own code, if you're relying on modern ES6 JavaScript features like the class syntax, this is supported in all but the oldest browsers. If you do need to support very old browsers, you should use a tool like Encore instead of the AssetMapper component.

The `import` statement can't be polyfilled or shimmed to work on every browser. However, only the oldest browsers don't support it—basically IE 11 (which is no longer supported by Microsoft and has less than 0.4% of global usage).

The importmap feature is shimmed to work in all browsers by the AssetMapper component. However, the shim doesn't work with "dynamic" imports:

```javascript
// this works
import { add } from './math.js';

// this will not work in the oldest browsers
import('./math.js').then(({ add }) => {
    // ...
});
```

If you want to use dynamic imports and need to support certain older browsers ([caniuse.com/import-maps](https://caniuse.com/import-maps)), you can use an `importShim()` function from the shim: [es-module-shims](https://www.npmjs.com/package/es-module-shims#user-content-polyfill-edge-case-dynamic-import).

### Can I Use it with Sass or Tailwind?

**Sure!** See [Using Tailwind CSS](#using-tailwind-css) or [Using Sass](#using-sass).

### Can I Use it with TypeScript?

**Sure!** See [Using TypeScript](#using-typescript).

### Can I Use it with JSX or Vue?

**Probably not.** If you're writing an application in React, Svelte, or another frontend framework, you'll probably be better off using their tools directly.

- **JSX:**  
  JSX can be compiled directly to a native JavaScript file, but if you're using a lot of JSX, you'll probably want to use a tool like Encore. See the [UX React Documentation](https://ux.symfony.com/react) for more details about using it with the AssetMapper component.

- **Vue:**  
  Vue files can be written in native JavaScript, and those will work with the AssetMapper component. But you cannot write single-file components (i.e., `.vue` files) with AssetMapper, as those must be used in a build system. See the [UX Vue.js Documentation](https://ux.symfony.com/vuejs) for more details about using with the AssetMapper component.

### Can I Lint and Format My Code?

**Not with AssetMapper,** but you can install [kocal/biome-js-bundle](https://github.com/kocal/biome-js-bundle) in your project to lint and format your front-end assets. It's much faster than alternatives like Prettier and requires no configuration to handle your JavaScript, TypeScript, and CSS files.

### Using TypeScript

To use TypeScript with the AssetMapper component, check out [sensiolabs/typescript-bundle](https://github.com/sensiolabs/typescript-bundle).

### Third-Party Bundles & Custom Asset Paths

All bundles that have a `Resources/public/` or `public/` directory will automatically have that directory added as an "asset path," using the namespace: `bundles/<BundleName>`. For example, if you're using `BabdevPagerfantaBundle` and you run the `debug:asset-map` command, you'll see an asset whose logical path is `bundles/babdevpagerfanta/css/pagerfanta.css`.

This means you can render these assets in your templates using the `asset()` function:

```twig
<link rel="stylesheet" href="{{ asset('bundles/babdevpagerfanta/css/pagerfanta.css') }}">
```

Actually, this path—`bundles/babdevpagerfanta/css/pagerfanta.css`—already works in applications without the AssetMapper component because the `assets:install` command copies the assets from bundles into `public/bundles/`. However, when the AssetMapper component is enabled, the `pagerfanta.css` file will automatically be versioned! It will output something like:

```html
<link rel="stylesheet" href="/assets/bundles/babdevpagerfanta/css/pagerfanta-ea64fc9c55f8394e696554f8aeb81a8e.css">
```

### Overriding 3rd-Party Assets

If you want to override a 3rd-party asset, you can do that by creating a file in your `assets/` directory with the same name. For example, if you want to override the `pagerfanta.css` file, create a file at `assets/bundles/babdevpagerfanta/css/pagerfanta.css`. This file will be used instead of the original file.

If a bundle renders their own assets but they use a non-default asset package, then the AssetMapper component will not be used. This happens, for example, with `EasyAdminBundle`.

### Importing Assets Outside of the `assets/` Directory

You can import assets that live outside of your asset path (i.e., the `assets/` directory). For example:

```css
/* assets/styles/app.css */

/* you can reach above assets/ */
@import url('../../vendor/babdev/pagerfanta-bundle/Resources/public/css/pagerfanta.css');
```

However, if you get an error like this:

```
The "app" importmap entry contains the path "vendor/some/package/assets/foo.js" but it does not appear to be in any of your asset paths.
```

It means that you're pointing to a valid file, but that file isn't in any of your asset paths. You can fix this by adding the path to your `asset_mapper.yaml` file:

```yaml
# config/packages/asset_mapper.yaml
framework:
    asset_mapper:
        paths:
            - assets/
            - vendor/some/package/assets
```

Then try the command again.

## Configuration Options

You can see every available configuration option and some info by running:

```bash
php bin/console config:dump framework asset_mapper
```

Some of the more important options are described below.

### `framework.asset_mapper.paths`

This config holds all of the directories that will be scanned for assets. This can be a simple list:

```yaml
framework:
    asset_mapper:
        paths:
            - assets/
            - vendor/some/package/assets
```

Or you can give each path a "namespace" that will be used in the asset map:

```yaml
framework:
    asset_mapper:
        paths:
            assets/: ''
            vendor/some/package/assets/: 'some-package'
```

In this case, the "logical path" to all of the files in the `vendor/some/package/assets/` directory will be prefixed with `some-package`—e.g., `some-package/foo.js`.

### `framework.asset_mapper.excluded_patterns`

This is a list of glob patterns that will be excluded from the asset map:

```yaml
framework:
    asset_mapper:
        excluded_patterns:
            - '*/*.scss'
```

You can use the `debug:asset-map` command to double-check that the files you expect are being included in the asset map.

### `framework.asset_mapper.exclude_dotfiles`

Whether to exclude any file starting with a `.` from the asset mapper. This is useful if you want to avoid leaking sensitive files like `.env` or `.gitignore` in the files published by the asset mapper.

```yaml
framework:
    asset_mapper:
        exclude_dotfiles: true
```

This option is enabled by default.

### `framework.asset_mapper.importmap_polyfill`

Configure the polyfill for older browsers. By default, the ES module shim is loaded via a CDN (i.e., the default value for this setting is `es-module-shims`):

```yaml
framework:
    asset_mapper:
        # Set this option to false to disable the shim entirely
        # (your website/web app won't work in old browsers)
        importmap_polyfill: false

        # You can also use a custom polyfill by adding it to your importmap.php file
        # and setting this option to the key of that file in the importmap.php file
        # importmap_polyfill: 'custom_polyfill'
```

You can tell the AssetMapper to load the ES module shim locally by using the following command, without changing your configuration:

```bash
php bin/console importmap:require es-module-shims
```

### `framework.asset_mapper.importmap_script_attributes`

This is a list of attributes that will be added to the `<script>` tags rendered by the `{{ importmap() }}` Twig function:

```yaml
framework:
    asset_mapper:
        importmap_script_attributes:
            crossorigin: 'anonymous'
```

## Page-Specific CSS & JavaScript

Sometimes you may choose to include CSS or JavaScript files only on certain pages.

### For JavaScript

An easy way is to load the file with a dynamic import:

```javascript
const someCondition = '...';
if (someCondition) {
    import('./some-file.js');

    // or use async/await
    // const something = await import('./some-file.js');
}
```

### Creating Separate Entrypoints

Another option is to create a separate entrypoint. For example, create a `checkout.js` file that contains whatever JavaScript and CSS you need:

```javascript
// assets/checkout.js
import './checkout.css';

// ...
```

Next, add this to `importmap.php` and mark it as an entrypoint:

```php
// importmap.php
return [
    // the 'app' entrypoint ...

    'checkout' => [
        'path' => './assets/checkout.js',
        'entrypoint' => true,
    ],
];
```

Finally, on the page that needs this JavaScript, call `importmap()` and pass both `app` and `checkout`:

```twig
{# templates/products/checkout.html.twig #}
{#
    Override an "importmap" block from base.html.twig.
    If you don't have that block, add it around the {{ importmap('app') }} call.
#}
{% block importmap %}
    {# do NOT call parent() #}

    {{ importmap(['app', 'checkout']) }}
{% endblock %}
```

By passing both `app` and `checkout`, the `importmap()` function will output the importmap and also add a `<script type="module">` tag that loads the `app.js` file and the `checkout.js` file. It's important to **not call `parent()`** in the `importmap` block. Each page can only have one importmap, so `importmap()` must be called exactly once.

If, for some reason, you want to execute only `checkout.js` and not `app.js`, pass only `checkout` to `importmap()`.

## Using a Content Security Policy (CSP)

If you're using a Content Security Policy (CSP) to prevent cross-site scripting attacks, the inline `<script>` tags rendered by the `importmap()` function will likely violate that policy and will not be executed by the browser.

### Adding a Nonce

To allow these scripts to run without disabling the security provided by the CSP, you can generate a secure random string for every request (called a nonce) and include it in the CSP header and in a nonce attribute on the `<script>` tags. The `importmap()` function accepts an optional second argument that can be used to pass attributes to the rendered `<script>` tags. You can use the [NelmioSecurityBundle](https://github.com/nelmio/NelmioSecurityBundle) to generate the nonce and include it in the CSP header, and then pass the same nonce to the Twig function:

```twig
{# The csp_nonce() function is defined by the NelmioSecurityBundle #}
{{ importmap('app', {'nonce': csp_nonce('script')}) }}
```

### Content Security Policy and CSS Files

If your importmap includes CSS files, AssetMapper uses a trick to load those by adding `data:application/javascript` to the rendered importmap (see [Handling CSS](#handling-css)).

This can cause browsers to report CSP violations and block the CSS files from being loaded. To prevent this, you can add `strict-dynamic` to the `script-src` directive of your Content Security Policy, to tell the browser that the importmap is allowed to load other resources.

When using `strict-dynamic`, the browser will ignore any other sources in `script-src` such as `'self'` or `'unsafe-inline'`, so any other `<script>` tags will also need to be trusted via a nonce.

## The AssetMapper Component Caching System in Development

When developing your app in debug mode, the AssetMapper component will calculate the content of each asset file and cache it. Whenever that file changes, the component will automatically re-calculate the content.

The system also accounts for "dependencies": If `app.css` contains `@import url('other.css')`, then the `app.css` file contents will also be re-calculated whenever `other.css` changes. This is because the version hash of `other.css` will change, which will cause the final content of `app.css` to change since it includes the final `other.css` filename inside.

Mostly, this system just works. But if you have a file that is not being re-calculated when you expect it to, you can run:

```bash
php bin/console cache:clear
```

This will force the AssetMapper component to re-calculate the content of all files.

## Run Security Audits on Your Dependencies

Similar to npm, the AssetMapper component comes bundled with a command that checks security vulnerabilities in the dependencies of your application:

```bash
php bin/console importmap:audit
```

Example output:

```
--------  ---------------------------------------------  ---------  -------  ----------  -----------------------------------------------------
Severity  Title                                          Package    Version  Patched in  More info
--------  ---------------------------------------------  ---------  -------  ----------  -----------------------------------------------------
Medium    jQuery Cross Site Scripting vulnerability      jquery     3.3.1    3.5.0       https://api.github.com/advisories/GHSA-257q-pV89-V3xv
High      Prototype Pollution in JSON5 via Parse Method  json5      1.0.0    1.0.2       https://api.github.com/advisories/GHSA-9c47-m6qq-7p4h
Medium    semver vulnerable to RegExp Denial of Service  semver     4.3.0    5.7.2       https://api.github.com/advisories/GHSA-c2qf-rxjj-qqgw
Critical  Prototype Pollution in minimist                minimist   1.1.3    1.2.6       https://api.github.com/advisories/GHSA-xvch-5gv4-984h
Medium    ESLint dependencies are vulnerable             minimist   1.1.3    1.2.2       https://api.github.com/advisories/GHSA-7fhm-mqm4-2wp7
Medium    Bootstrap Vulnerable to Cross-Site Scripting   bootstrap  4.1.3    4.3.1       https://api.github.com/advisories/GHSA-9v3M-8fp8-mi99
--------  ---------------------------------------------  ---------  -------  ----------  -----------------------------------------------------
7 packages found: 7 audited / 0 skipped
6 vulnerabilities found: 1 Critical / 1 High / 4 Medium
```

The command will return the `0` exit code if no vulnerability is found, or the `1` exit code otherwise. This means that you can seamlessly integrate this command as part of your CI to be warned anytime a new vulnerability is found.

# Configuration Reference

## framework.asset_mapper

### Paths

```yaml
framework:
    asset_mapper:
        paths:
            - assets/
            - vendor/some/package/assets
```

Or with namespaces:

```yaml
framework:
    asset_mapper:
        paths:
            assets/: ''
            vendor/some/package/assets/: 'some-package'
```

### Excluded Patterns

```yaml
framework:
    asset_mapper:
        excluded_patterns:
            - '*/*.scss'
```

### Exclude Dotfiles

```yaml
framework:
    asset_mapper:
        exclude_dotfiles: true
```

### Importmap Polyfill

```yaml
framework:
    asset_mapper:
        importmap_polyfill: false
        # or
        importmap_polyfill: 'custom_polyfill'
```

### Importmap Script Attributes

```yaml
framework:
    asset_mapper:
        importmap_script_attributes:
            crossorigin: 'anonymous'
```

# Conclusion

The AssetMapper component provides a modern and efficient way to manage your CSS and JavaScript assets in Symfony applications without the overhead of traditional bundlers. By leveraging native browser features and HTTP/2 capabilities, it simplifies asset management while maintaining high performance and compatibility across browsers.

For more detailed information and advanced configurations, refer to the official [Symfony AssetMapper Documentation](https://symfony.com/doc/current/asset_mapper.html).

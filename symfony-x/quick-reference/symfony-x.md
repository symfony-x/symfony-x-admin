# Symfony-X Quick Reference (QR)

Symfony-X Quick Reference (QR) contains common CLI used during the course of Symfony development.

## AssetMapper & Asset

#### 3rd Party npm libraries import into importmap

   ```bash
   php bin/console importmap:require NPM_LIBRARY
   ```
   
   ```bash
   php bin/console importmap:update
   ```
   
   ```bash
   php bin/console importmap:require NPM_LIBRARY --download
   ```

## Troubleshooting

#### Find invalid imports
Find invalid imports that appear anywhere in your code. Run...

   ```bash
   php bin/console cache:clear
   ```
Clears Symfony's cache and also clears an internal cache in AssetMapper. Now run...

   ```bash
   php bin/console debug:asset
   ```

This re-builds the cache for all of those assets internally. When it does that, it parses your files and reports any missing imports.

#### View tailwind config

   ```bash
   php bin/console debug:config symfonycasts_tailwind
   ```

## Stimulus

#### Lazy loading by adding the middle line to js

   ```js
   // imports
   /* stimulusFetch: 'lazy' */
   // code
   ```
## CSS / Tailwind / Flowbite

#### Lazy load css

   ```js
   export default function (message, inPeace = false) 
   {
        if (!inPeace) 
        {
            setTimeout(() => 
            {
                import('../styles/alien-greeting.css');
            } , 4000);
        }
   }
   ```

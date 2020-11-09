"use strict";
/**
 * Create new JSON-LD, type: Local Business
 * @param name Business Name
 * @param imgURL Url of image. Example: https://example.com/path/image.png
 * @param url URL of site. Example: https://example.com
 * @param telephone telephone. Example: +38 (099) 703 41 19
 * @param streetAddress Street Address of Business. Example: вул. Троїцька, 67А
 * @param addressLocality City. Example: Кременчук
 * @param postalCode Index. Example: 39600
 * @param addressCountry Country: UA, US, RU, BY
 * @customfunction
 */
function CreateNewLocalBusiness(name, imgURL, url, telephone, streetAddress, addressLocality, postalCode, addressCountry = `UA`) {
    return [
        [
            ,
            `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "${name}",
        "image": "${imgURL}",
        "@id": "https://ntile.app",
        "url": "${url}",
        "telephone": "${telephone}",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "${streetAddress}",
          "addressLocality": "${addressLocality}",
          "postalCode": "${postalCode}",
          "addressCountry": "${addressCountry}"
        }  
      }
      </script>`,
        ],
    ];
}

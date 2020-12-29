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
/**
 * Create new JSON-LD, type: Breadcrumb
 * @param urlName1 Name page 1.
 * @param url1 URL page 1. Example: https://example.com
 * @param urlName2 Name page 2.
 * @param url2 URL page 2.
 * @customfunction
 */
function CreateBreadcrumb(urlName1, url1, urlName2, url2) {
    return [
        [
            ,
            `<script type="application/ld+json">
      {
        "@context": "https://schema.org/", 
        "@type": "BreadcrumbList", 
        "itemListElement": [
          {
            "@type": "ListItem", 
            "position": 1, 
            "name": "${urlName1}",
            "item": "${url1}"  
          },
          {
            "@type": "ListItem", 
            "position": 2, 
            "name": "${urlName2}",
            "item": "${url2}"  
          }
        ]
      }
      </script>`,
        ],
    ];
}
/**
 * Create new JSON-LD, type: Breadcrumb
 * @param name Name item.
 * @param url URL item page. Example: https://example.com/catalog/item.
 * @param urlImage URL image item page.
 * @param brand String Brand.
 * @param currency Default: UAH.
 * @param availability Default: https://schema.org/InStock.
 * @param condition Default: https://schema.org/NewCondition.
 * @customfunction
 */
function CreateProduct(name, url, price, urlImage, brand, currency = 'UAH', availability = 'https://schema.org/InStock', condition = 'https://schema.org/NewCondition') {
    return [
        [
            ,
            `<script type="application/ld+json">
      {
        "@context": "https://schema.org/", 
        "@type": "Product", 
        "name": "${name}",
        "image": "${urlImage}",
        "brand": "${brand}",
        "offers": {
          "@type": "Offer",
          "url": "${url}",
          "priceCurrency": "${currency}",
          "price": "${price}",
          "availability": "${availability}",
          "itemCondition": "${condition}"
        }
      }
      </script>`,
        ],
    ];
}

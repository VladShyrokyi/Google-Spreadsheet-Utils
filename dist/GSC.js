"use strict";
class GSC {
    static Request(url, method, params) {
        let content = OAuthService.Request(url, method, params);
        if (content) {
            try {
                return JSON.parse(content);
            }
            catch (error) {
                return content;
            }
        }
        else {
            return {};
        }
    }
    static getSitesUrl() {
        return "https://www.googleapis.com/webmasters/v3/sites";
    }
    static getSiteUrl(url) {
        return `https://www.googleapis.com/webmasters/v3/sites/${url}`;
    }
    static getSitemapsUrl(url) {
        return `https://www.googleapis.com/webmasters/v3/sites/${url}/sitemaps`;
    }
    static getSitemapUrl(url, feedPath) {
        return `https://www.googleapis.com/webmasters/v3/sites/${url}/sitemaps/${feedPath}`;
    }
    static getSites() {
        let json = this.Request(this.getSitesUrl(), `get`);
        let URLs = [];
        for (let i in json.siteEntry)
            URLs.push([json.siteEntry[i].siteUrl, json.siteEntry[i].permissionLevel]);
        return URLs;
    }
    static setSites(urls) {
        urls.map((e) => this.Request(this.getSiteUrl(e), `put`), this);
    }
    static deleteSites(urls) {
        urls.map((e) => this.Request(this.getSiteUrl(e), `delete`), this);
    }
    static getSitemap(url, feedPath) {
        this.Request(this.getSitemapUrl(url, feedPath), `get`);
    }
    static setSitemap(url, feedPath) {
        this.Request(this.getSitemapUrl(url, feedPath), `put`);
    }
    static deleteSitemap(url, feedPath) {
        this.Request(this.getSitemapUrl(url, feedPath), `delete`);
    }
}

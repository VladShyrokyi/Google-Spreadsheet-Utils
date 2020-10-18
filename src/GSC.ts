class GSC {
	static Request(
		url: string,
		method: GoogleAppsScript.URL_Fetch.HttpMethod,
		params?: object | GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
	): any {
		let content = OAuthService.Request(url, method, params);
		if (content) {
			try {
				return JSON.parse(content);
			} catch (error) {
				return content;
			}
		} else {
			return {};
		}
	}
	private static getSitesUrl(): string {
		return "https://www.googleapis.com/webmasters/v3/sites";
	}
	private static getSiteUrl(url: string): string {
		return `https://www.googleapis.com/webmasters/v3/sites/${url}`;
	}
	private static getSitemapsUrl(url: string): string {
		return `https://www.googleapis.com/webmasters/v3/sites/${url}/sitemaps`;
	}
	private static getSitemapUrl(url: string, feedPath: string): string {
		return `https://www.googleapis.com/webmasters/v3/sites/${url}/sitemaps/${feedPath}`;
	}
	static getSites(): any[][] {
		let json = this.Request(this.getSitesUrl(), `get`);
		let URLs = [];
		for (let i in json.siteEntry)
			URLs.push([json.siteEntry[i].siteUrl, json.siteEntry[i].permissionLevel]);
		return URLs;
	}
	static setSites(urls: string[]): void {
		urls.map((e) => this.Request(this.getSiteUrl(e), `put`), this);
	}
	static deleteSites(urls: string[]): void {
		urls.map((e) => this.Request(this.getSiteUrl(e), `delete`), this);
	}
	static getSitemap(url: string, feedPath: string) {
		this.Request(this.getSitemapUrl(url, feedPath), `get`);
	}
	static setSitemap(url: string, feedPath: string): void {
		this.Request(this.getSitemapUrl(url, feedPath), `put`);
	}
	static deleteSitemap(url: string, feedPath: string): void {
		this.Request(this.getSitemapUrl(url, feedPath), `delete`);
	}
}

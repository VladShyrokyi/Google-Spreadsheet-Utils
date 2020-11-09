class API {
  private cache = CacheService.getDocumentCache();
  public get url(): string {
    return this._url.valueOf();
  }
  constructor(private readonly _url: URI) {}
  /**
   * Get Data from API. Add to cache.
   * @param Query if has replaced query
   * @returns Key
   */
  FetchQuery(Query?: string): string {
    if (!!Query) this._url.removeSearch(`query`).addSearch({ query: Query });
    let Key = this.url.slice(0, 249);
    if (!this.cache?.get(Key)) {
      let value = UrlFetchApp.fetch(this._url.toString()).getContentText();
      this.cache?.remove(Key);
      this.cache?.put(Key, value);
    }
    return Key;
  }
}

class ApiSerpStat extends API {
  constructor(
    Base: string,
    ReportType: string,
    Query: string,
    Token: string,
    SearchRegion: string,
    ...Params: string[]
  ) {
    let url = new URI(Base + ReportType)
      .addSearch({ query: Query })
      .addSearch({ token: Token })
      .addSearch({ se: SearchRegion });
    Params.forEach(([key, value]) => url.addSearch(key, value));
    super(url);
  }
}

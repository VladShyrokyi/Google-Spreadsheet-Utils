class API {
  private cache = CacheService.getDocumentCache();
  public get UrlAPI(): string {
    return this._UrlAPI.valueOf();
  }
  constructor(private readonly _UrlAPI: URI) {}
  /**
   * Get Data from API. Add to cache.
   * @param Query if has replaced query
   * @returns Key
   */
  FetchQuery(Query?: string): string {
    if (!!Query) this._UrlAPI.removeSearch(`query`).addSearch({ query: Query });
    let Key = this.UrlAPI.slice(0, 249);
    if (!this.cache?.get(Key)) {
      let value = UrlFetchApp.fetch(this._UrlAPI.toString()).getContentText();
      this.cache?.remove(Key);
      this.cache?.put(Key, value);
    }
    return Key;
  }
}

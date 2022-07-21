import { GetStaticPathsContext } from 'next';
import * as plugins from 'temp/sitemap-fetcher-plugins';
import { StaticPathExt } from 'lib/type/StaticPathExt';
import Site from 'lib/type/Site';

export interface SitemapFetcherPlugin {
  /**
   * A function which will be called during page props generation
   */
  exec(sites?: Site[], context?: GetStaticPathsContext): Promise<StaticPathExt[]>;
}

export class SitecoreSitemapFetcher {
  /**
   * Generates SitecoreSitemap for given mode (Export / Disconnected Export / SSG)
   * @param {GetStaticPathsContext} context
   */
  async fetch(sites: Site[], context?: GetStaticPathsContext): Promise<StaticPathExt[]> {
    const pluginsList = Object.values(plugins) as SitemapFetcherPlugin[];
    const pluginsResults = await Promise.all(
      pluginsList.map((plugin) => plugin.exec(sites, context))
    );
    const results = pluginsResults.reduce((acc, cur) => [...acc, ...cur], []);
    return results;
  }
}

export const sitemapFetcher = new SitecoreSitemapFetcher();

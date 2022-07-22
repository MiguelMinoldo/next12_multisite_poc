/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLSitemapService } from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'temp/config';
import { SitemapFetcherPlugin } from '..';
import { GetStaticPathsContext } from 'next';
import pkg from '../../../../package.json';
import { StaticPathExt } from 'lib/type/StaticPathExt';
import Site from 'lib/type/Site';

class GraphqlSitemapServicePlugin implements SitemapFetcherPlugin {
  _graphqlSitemapService: GraphQLSitemapService;

  constructor() {
    this._graphqlSitemapService = new GraphQLSitemapService({
      endpoint: config.graphQLEndpoint,
      apiKey: config.sitecoreApiKey,
      siteName: config.jssAppName,
      /*
      The Sitemap Service needs a root item ID in order to fetch the list of pages for the current
      app. If your Sitecore instance only has 1 JSS App, you can specify the root item ID here;
      otherwise, the service will attempt to figure out the root item for the current JSS App using GraphQL and app name.
      rootItemId: '{GUID}'
      */
    });
  }

  async exec(sites: Site[], _context?: GetStaticPathsContext): Promise<StaticPathExt[]> {
    let paths = new Array<StaticPathExt>();
    for (let i = 0; i < sites?.length; i++) {
      const site = sites[i]?.site || config.jssAppName;
      this._graphqlSitemapService.options.siteName = site;
      this._graphqlSitemapService.options.rootItemId = sites[i].rootItemId;
      console.log('Processing sitemap: Site: ' + site + 'Root Item ID: ' + sites[i].rootItemId);
      if (process.env.EXPORT_MODE) {
        // Disconnected Export mode
        if (process.env.JSS_MODE !== 'disconnected') {
          const p = (await this._graphqlSitemapService.fetchExportSitemap(
            pkg.config.language
          )) as StaticPathExt[];
          paths = paths.concat(
            p.map((page) => ({
              params: { path: page.params.path, site: site },
              locale: page.locale,
            }))
          );
        }
      }
      const p = (await this._graphqlSitemapService.fetchSSGSitemap(
        sites[i].languages || []
      )) as StaticPathExt[];
      paths = paths.concat(
        p.map((page) => ({
          params: { path: page.params.path, site: site },
          locale: page.locale,
        }))
      );
    }
    return paths;
  }
}

export const graphqlSitemapServicePlugin = new GraphqlSitemapServicePlugin();

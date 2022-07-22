/* eslint-disable prettier/prettier */
const hostnames = [
  {
      siteName: 'multisite_poc',
      description: 'multisite_poc Site',
      subdomain: '',
      rootItemId: '{8F2703C1-5B70-58C6-927B-228A67DB7550}', 
      languages: [
        'en'
      ],
      customDomain: 'www.multisite_poc_global.localhost|next12-multisite-global.vercel.app',
      // Default subdomain for Preview deployments and for local development
      defaultForPreview: true,
    },
    {
      siteName: 'multisite_poc_uk',
      description: 'multisite_poc_uk Site',
      subdomain: '',
      rootItemId: '{AD81037E-93BE-4AAC-AB08-0269D96A2B49}', 
      languages: [
        'en-gb'
      ],
      customDomain: 'www.multisite_poc_uk.localhost|next12-multisite-uk.vercel.app',
    },
]
// Returns the default site (Global)
const DEFAULT_HOST = hostnames.find((h) => h.defaultForPreview)

/**
 * Returns the data of the hostname based on its subdomain or custom domain
 * or the default host if there's no match.
 *
 * This method is used by middleware.ts
 */
export async function getHostnameDataOrDefault(
  subdomainOrCustomDomain?: string
) {
  if (!subdomainOrCustomDomain) return DEFAULT_HOST

  // check if site is a custom domain or a subdomain
  const customDomain = subdomainOrCustomDomain.includes('.')

  // fetch data from mock database using the site value as the key
  return (
    hostnames.find((item) =>
      customDomain
        ? item.customDomain.split('|').includes(subdomainOrCustomDomain)
        : item.subdomain === subdomainOrCustomDomain
    ) ?? DEFAULT_HOST
  )
}

/**
 * Returns the data of the hostname based on its subdomain.
 *
 * This method is used by pages under middleware.ts
 */
export async function getHostnameDataBySubdomain(subdomain: string) {
  return hostnames.find((item) => item.subdomain === subdomain)
}

/**
 * Returns the paths for `getStaticPaths` based on the subdomain of every
 * available hostname.
 */
export async function getSitesPaths() {
  // get all sites
  const subdomains = hostnames.filter((item) => item.siteName)

  // build paths for each of the sites
  return subdomains.map((item) => {
    return { site: item.siteName, languages: item.languages, rootItemId: item.rootItemId }
  })
}

export default hostnames
/**
 * Header and footer navigation. Labels follow the prototype (JfdHeader / JfdFooter).
 */
import { paths } from './paths';
import { quoteHref } from './quote-routes';
import { services } from './services';

export interface NavLink {
  label: string;
  href: string;
}

export const headerNav = {
  /** Disclosure menu: the four services, then the hub. */
  services: {
    label: 'Services',
    links: [
      ...services.map((s) => ({ label: s.title, href: s.path })),
      { label: 'All services', href: paths.services },
    ] satisfies NavLink[],
  },
  links: [
    { label: 'Projects', href: paths.projects },
    { label: 'Why JFD', href: paths.about },
    { label: 'Contact', href: paths.contact },
  ] satisfies NavLink[],
  cta: { label: 'Send us your job sheet', href: quoteHref('survey') } satisfies NavLink,
};

export const footerNav = {
  groups: [
    {
      label: 'Services',
      links: services.map((s) => ({ label: s.shortTitle, href: s.path })),
    },
    {
      label: 'Company',
      links: [
        { label: 'Projects', href: paths.projects },
        { label: 'Why JFD', href: paths.about },
        { label: 'Contact', href: paths.contact },
      ],
    },
  ] satisfies { label: string; links: NavLink[] }[],
  cta: { label: 'Send us your job sheet', href: quoteHref('survey') } satisfies NavLink,
  // Terms link omitted until JFD supplies terms (plan section 3).
  legal: [{ label: 'Privacy', href: paths.privacy }] satisfies NavLink[],
};

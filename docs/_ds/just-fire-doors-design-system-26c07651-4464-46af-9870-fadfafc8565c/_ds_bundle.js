/* @ds-bundle: {"format":4,"namespace":"JustFireDoorsDesignSystem_26c076","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"Chip","sourcePath":"components/content/Chip.jsx"},{"name":"Flow","sourcePath":"components/content/Flow.jsx"},{"name":"HairlineGrid","sourcePath":"components/content/HairlineGrid.jsx"},{"name":"Tile","sourcePath":"components/content/HairlineGrid.jsx"},{"name":"NumberedRow","sourcePath":"components/content/NumberedRow.jsx"},{"name":"Panel","sourcePath":"components/content/Panel.jsx"},{"name":"Stat","sourcePath":"components/content/Stat.jsx"},{"name":"Heading","sourcePath":"components/layout/Heading.jsx"},{"name":"Section","sourcePath":"components/layout/Section.jsx"},{"name":"Photo","sourcePath":"components/media/Photo.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/navigation/SiteHeader.jsx"},{"name":"Wordmark","sourcePath":"components/navigation/Wordmark.jsx"},{"name":"JobRecord","sourcePath":"components/records/JobRecord.jsx"},{"name":"StatusBadge","sourcePath":"components/records/StatusBadge.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"6b2aa58b7371","components/actions/TextLink.jsx":"598b5c3525cc","components/content/Card.jsx":"2d91399b61c9","components/content/Chip.jsx":"10ff7c4b92d9","components/content/Flow.jsx":"d6425e55642a","components/content/HairlineGrid.jsx":"e7d50f75fca7","components/content/NumberedRow.jsx":"c0ea87ba797a","components/content/Panel.jsx":"0797cc49e6d1","components/content/Stat.jsx":"1963edd15acd","components/layout/Heading.jsx":"14fb125b4109","components/layout/Section.jsx":"2470bcf3b2ea","components/media/Photo.jsx":"306ab0154fe1","components/navigation/SiteFooter.jsx":"2042d35082ab","components/navigation/SiteHeader.jsx":"77af1732b5d1","components/navigation/Wordmark.jsx":"3285251cc92b","components/records/JobRecord.jsx":"ecc2c009bdff","components/records/StatusBadge.jsx":"8f41e43fc758","ui_kits/website/BookPage.jsx":"4f850460185d","ui_kits/website/Home.jsx":"4421e07495e3","ui_kits/website/InspectionPage.jsx":"fd69c78a5924"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.JustFireDoorsDesignSystem_26c076 = window.JustFireDoorsDesignSystem_26c076 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...rest
}) {
  const cls = ['jfd-btn', size !== 'md' && 'jfd-btn--' + size, variant === 'inverse' && 'jfd-btn--inverse', variant === 'ghostDark' && 'jfd-btn--ghost-dark', className].filter(Boolean).join(' ');
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    href: href
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/TextLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextLink({
  onDark = false,
  href = '#',
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    className: ['jfd-link', onDark && 'jfd-link--on-dark', className].filter(Boolean).join(' ')
  }, rest), children);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  href,
  media,
  mediaLabel,
  index,
  title,
  children,
  meta,
  style,
  ...rest
}) {
  const Tag = href ? 'a' : 'div';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "jfd-card",
    href: href,
    style: style
  }, rest), (media || mediaLabel) && /*#__PURE__*/React.createElement("div", {
    className: 'jfd-card__media' + (media ? '' : ' jfd-placeholder')
  }, media ? /*#__PURE__*/React.createElement("img", {
    src: media,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "jfd-label"
  }, mediaLabel)), /*#__PURE__*/React.createElement("div", {
    className: "jfd-card__body"
  }, index && /*#__PURE__*/React.createElement("div", {
    className: "jfd-index",
    style: {
      marginBottom: 10
    }
  }, index), title && /*#__PURE__*/React.createElement("div", {
    className: "jfd-card-title",
    style: {
      marginBottom: 10
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "jfd-body",
    style: {
      margin: '0 0 18px'
    }
  }, children), meta && /*#__PURE__*/React.createElement("div", {
    className: "jfd-card__meta jfd-label"
  }, meta)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/Chip.jsx
try { (() => {
function Chip({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "jfd-chip",
    style: {
      display: 'inline-block',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Chip.jsx", error: String((e && e.message) || e) }); }

// components/content/Flow.jsx
try { (() => {
function Flow({
  steps = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "jfd-flow",
    style: style
  }, steps.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\u2192"), /*#__PURE__*/React.createElement("span", null, s))));
}
Object.assign(__ds_scope, { Flow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Flow.jsx", error: String((e && e.message) || e) }); }

// components/content/HairlineGrid.jsx
try { (() => {
function HairlineGrid({
  columns,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "jfd-hairline-grid",
    style: {
      ...(columns ? {
        gridTemplateColumns: 'repeat(' + columns + ', minmax(0,1fr))'
      } : {}),
      ...style
    }
  }, children);
}
function Tile({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "jfd-tile",
    style: style
  }, children);
}
Object.assign(__ds_scope, { HairlineGrid, Tile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/HairlineGrid.jsx", error: String((e && e.message) || e) }); }

// components/content/NumberedRow.jsx
try { (() => {
function NumberedRow({
  index,
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "jfd-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jfd-index",
    style: {
      paddingTop: 4
    }
  }, index), /*#__PURE__*/React.createElement("div", {
    className: "jfd-card-title",
    style: {
      fontSize: 21
    }
  }, title), /*#__PURE__*/React.createElement("span", null), children && /*#__PURE__*/React.createElement("div", {
    className: "jfd-body",
    style: {
      margin: 0,
      maxWidth: '60ch'
    }
  }, children));
}
Object.assign(__ds_scope, { NumberedRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/NumberedRow.jsx", error: String((e && e.message) || e) }); }

// components/content/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Panel({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "jfd-panel",
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Panel.jsx", error: String((e && e.message) || e) }); }

// components/content/Stat.jsx
try { (() => {
function Stat({
  value,
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "jfd-stat"
  }, value), label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13.5,
      color: 'var(--jfd-ink-3)',
      marginTop: 3
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Stat.jsx", error: String((e && e.message) || e) }); }

// components/layout/Heading.jsx
try { (() => {
function Heading({
  level = 'h2',
  eyebrow,
  accent,
  children,
  style,
  eyebrowStyle
}) {
  const Tag = level === 'statement' ? 'h2' : level;
  return /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("p", {
    className: "jfd-eyebrow",
    style: eyebrowStyle
  }, eyebrow), /*#__PURE__*/React.createElement(Tag, {
    className: level === 'statement' ? 'jfd-statement' : 'jfd-' + level,
    style: style
  }, children, accent && /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("span", {
    className: "jfd-accent"
  }, accent))));
}
Object.assign(__ds_scope, { Heading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Heading.jsx", error: String((e && e.message) || e) }); }

// components/layout/Section.jsx
try { (() => {
function Section({
  tone = 'ground',
  children,
  id,
  style,
  innerStyle
}) {
  const cls = 'jfd-section' + (tone !== 'ground' ? ' jfd-section--' + tone : '');
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    className: cls,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "jfd-container",
    style: innerStyle
  }, children));
}
Object.assign(__ds_scope, { Section });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Section.jsx", error: String((e && e.message) || e) }); }

// components/media/Photo.jsx
try { (() => {
function Photo({
  src,
  ratio = '16x10',
  placeholder = 'Photograph',
  caption,
  style
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: 'jfd-photo jfd-photo--' + ratio + (src ? '' : ' jfd-placeholder')
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "jfd-label"
  }, placeholder)), caption && /*#__PURE__*/React.createElement("figcaption", {
    className: "jfd-caption"
  }, caption));
}
Object.assign(__ds_scope, { Photo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Photo.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Wordmark({
  suffix = 'SW',
  color,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "jfd-wordmark",
    style: {
      color,
      ...style
    }
  }, rest), "Just Fire Doors", suffix && /*#__PURE__*/React.createElement("sup", null, suffix));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function SiteFooter({
  columns = [],
  legal,
  blurb
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "jfd-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "jfd-container",
    style: {
      padding: '72px var(--jfd-gutter) 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(' + columns.length + ', 1fr)',
      gap: 32,
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    color: "#fff"
  }), blurb && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--jfd-dark-ink-2)',
      maxWidth: '34ch',
      marginTop: 16
    }
  }, blurb)), columns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("p", {
    className: "jfd-footer__label"
  }, c.title), c.links.map((l, j) => /*#__PURE__*/React.createElement("a", {
    key: j,
    href: l.href || '#'
  }, l.label))))), /*#__PURE__*/React.createElement("div", {
    className: "jfd-footer__legal"
  }, legal)));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteHeader.jsx
try { (() => {
function SiteHeader({
  links = [],
  cta = 'Book an inspection',
  ctaHref = '#',
  scrolled = false,
  onNavigate,
  onCta
}) {
  const [open, setOpen] = React.useState(null);
  return /*#__PURE__*/React.createElement("header", {
    className: 'jfd-header' + (scrolled ? ' is-scrolled' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "jfd-container jfd-header__inner"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate('home');
      }
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, null)), /*#__PURE__*/React.createElement("nav", {
    className: "jfd-nav"
  }, links.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: 'relative'
    },
    onMouseEnter: () => l.items && setOpen(i),
    onMouseLeave: () => setOpen(null)
  }, /*#__PURE__*/React.createElement("button", {
    className: "jfd-nav__link",
    onClick: () => onNavigate && onNavigate(l.id || l.label)
  }, l.label, l.items ? ' ▾' : ''), l.items && open === i && /*#__PURE__*/React.createElement("div", {
    className: "jfd-menu"
  }, l.items.map((it, j) => /*#__PURE__*/React.createElement("a", {
    key: j,
    href: "#",
    onClick: e => {
      e.preventDefault();
      setOpen(null);
      onNavigate && onNavigate(it.id || it.label);
    }
  }, it.label)))))), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    href: ctaHref,
    onClick: e => {
      if (onCta) {
        e.preventDefault();
        onCta();
      }
    }
  }, cta)));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// components/records/StatusBadge.jsx
try { (() => {
const LABELS = {
  closed: 'Closed',
  onsite: 'On site',
  decide: 'Decision needed',
  neutral: 'Booked'
};
function StatusBadge({
  status = 'neutral',
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: 'jfd-status' + (status !== 'neutral' ? ' jfd-status--' + status : '')
  }, children || LABELS[status]);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/records/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/records/JobRecord.jsx
try { (() => {
function JobRecord({
  title,
  reference,
  rows = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--jfd-surface)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "jfd-record__head"
  }, /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement("span", null, reference)), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "jfd-record__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "jfd-record__id"
  }, r.id), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--jfd-graphite)'
    }
  }, r.label), /*#__PURE__*/React.createElement("span", {
    style: {
      justifySelf: 'end'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    status: r.status
  }, r.statusLabel)))));
}
Object.assign(__ds_scope, { JobRecord });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/records/JobRecord.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/BookPage.jsx
try { (() => {
const {
  Section,
  Heading,
  Button,
  Panel,
  JobRecord,
  StatusBadge
} = window.JustFireDoorsDesignSystem_26c076;
const fieldStyle = {
  width: '100%',
  minHeight: 52,
  padding: '14px 16px',
  border: '1px solid var(--jfd-rule-strong)',
  background: '#fff',
  font: '400 16px var(--jfd-font-body)',
  color: 'var(--jfd-graphite)',
  borderRadius: 0
};
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "jfd-label"
  }, label), children);
}
function BookPage({
  go
}) {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 64
    },
    innerStyle: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,0.8fr)',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Heading, {
    level: "h2",
    eyebrow: "Book an inspection",
    style: {
      marginBottom: 16
    }
  }, "Tell us about the building."), /*#__PURE__*/React.createElement("p", {
    className: "jfd-lead",
    style: {
      marginTop: 0,
      marginBottom: 32
    }
  }, "We'll confirm a date within one working day."), sent ? /*#__PURE__*/React.createElement(Panel, {
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "closed"
  }, "Request received"), /*#__PURE__*/React.createElement("div", {
    className: "jfd-card-title",
    style: {
      margin: '14px 0 8px'
    }
  }, "Thanks \u2014 reference JFD-2304."), /*#__PURE__*/React.createElement("p", {
    className: "jfd-body",
    style: {
      margin: '0 0 20px'
    }
  }, "We'll call you to confirm access and a survey date."), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('home')
  }, "Back to home")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'grid',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Your name"
  }, /*#__PURE__*/React.createElement("input", {
    style: fieldStyle,
    required: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Building address"
  }, /*#__PURE__*/React.createElement("input", {
    style: fieldStyle,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Approx. number of doors"
  }, /*#__PURE__*/React.createElement("input", {
    style: fieldStyle,
    type: "number",
    defaultValue: "24"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Building type"
  }, /*#__PURE__*/React.createElement("select", {
    style: fieldStyle
  }, /*#__PURE__*/React.createElement("option", null, "Residential block"), /*#__PURE__*/React.createElement("option", null, "Care home"), /*#__PURE__*/React.createElement("option", null, "School"), /*#__PURE__*/React.createElement("option", null, "Commercial")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    size: "lg"
  }, "Request inspection")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "jfd-label",
    style: {
      marginBottom: 12
    }
  }, "What you'll receive"), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(JobRecord, {
    title: "Sample job sheet",
    reference: "JFD-0000",
    rows: [{
      id: 'FD-01',
      label: 'Stair core',
      status: 'closed'
    }, {
      id: 'FD-02',
      label: 'Flat entrance',
      status: 'decide'
    }, {
      id: 'FD-03',
      label: 'Riser',
      status: 'onsite'
    }]
  }))));
}
window.BookPage = BookPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/BookPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const {
  Section,
  Heading,
  Button,
  TextLink,
  Panel,
  JobRecord,
  HairlineGrid,
  Tile,
  Stat,
  Card,
  NumberedRow,
  Photo,
  Flow,
  Chip
} = window.JustFireDoorsDesignSystem_26c076;
function Home({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 72
    },
    innerStyle: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Heading, {
    level: "h1",
    eyebrow: "Fire door specialists \xB7 South West",
    accent: "that actually close."
  }, "Fire doors"), /*#__PURE__*/React.createElement("p", {
    className: "jfd-lead",
    style: {
      margin: '26px 0 34px'
    }
  }, "Inspection, repair and installation for landlords, housing providers and facilities teams \u2014 with a numbered record for every door."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('book')
  }, "Book an inspection"), /*#__PURE__*/React.createElement(TextLink, {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('inspection');
    }
  }, "How an inspection works"))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(JobRecord, {
    title: "Job sheet \xB7 Harbour House",
    reference: "JFD-2291",
    rows: [{
      id: 'FD-01',
      label: 'Stair core, ground floor',
      status: 'closed'
    }, {
      id: 'FD-02',
      label: 'Flat 4 entrance',
      status: 'closed'
    }, {
      id: 'FD-03',
      label: 'Riser cupboard, L2',
      status: 'decide'
    }, {
      id: 'FD-04',
      label: 'Plant room',
      status: 'onsite'
    }, {
      id: 'FD-05',
      label: 'Bin store',
      status: 'neutral'
    }]
  }))), /*#__PURE__*/React.createElement("hr", {
    className: "jfd-divider-azure"
  }), /*#__PURE__*/React.createElement(Section, {
    tone: "surface",
    style: {
      padding: '40px 0'
    }
  }, /*#__PURE__*/React.createElement(HairlineGrid, {
    columns: 4
  }, /*#__PURE__*/React.createElement(Tile, null, /*#__PURE__*/React.createElement(Stat, {
    value: "1,240",
    label: "Doors inspected this year"
  })), /*#__PURE__*/React.createElement(Tile, null, /*#__PURE__*/React.createElement(Stat, {
    value: "48 hr",
    label: "Report turnaround"
  })), /*#__PURE__*/React.createElement(Tile, null, /*#__PURE__*/React.createElement(Stat, {
    value: "FD30 \xB7 FD60",
    label: "Ratings covered"
  })), /*#__PURE__*/React.createElement(Tile, null, /*#__PURE__*/React.createElement(Stat, {
    value: "BS 8214",
    label: "Inspection standard"
  })))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Heading, {
    level: "h2",
    eyebrow: "Services",
    style: {
      marginBottom: 40,
      maxWidth: '18ch'
    }
  }, "One team, from survey to sign-off."), /*#__PURE__*/React.createElement("div", {
    className: "jfd-grid"
  }, /*#__PURE__*/React.createElement(Card, {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('inspection');
    },
    mediaLabel: "Inspection photo",
    index: "01",
    title: "Fire door inspection",
    meta: "Report in 48 hrs"
  }, "Leaf, frame, gaps, seals, glazing and hardware \u2014 checked and photographed."), /*#__PURE__*/React.createElement(Card, {
    href: "#",
    mediaLabel: "Repair photo",
    index: "02",
    title: "Repair & remedial",
    meta: "Same-visit where possible"
  }, "Strips, closers, hinges and gap packing to bring doors back into compliance."), /*#__PURE__*/React.createElement(Card, {
    href: "#",
    mediaLabel: "Install photo",
    index: "03",
    title: "Supply & install",
    meta: "Certified doorsets"
  }, "Third-party certified doorsets fitted and recorded."))), /*#__PURE__*/React.createElement(Section, {
    tone: "surface",
    innerStyle: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Heading, {
    level: "h2",
    eyebrow: "What we find",
    style: {
      marginBottom: 28
    }
  }, "The problems that fail doors."), /*#__PURE__*/React.createElement(NumberedRow, {
    index: "01",
    title: "Gaps over 4mm"
  }, "Smoke and flame pass the leaf in minutes."), /*#__PURE__*/React.createElement(NumberedRow, {
    index: "02",
    title: "Missing or painted seals"
  }, "Intumescent strips can't expand if they're painted over."), /*#__PURE__*/React.createElement(NumberedRow, {
    index: "03",
    title: "Closers that don't close"
  }, "A door wedged or slow to latch isn't a fire door.")), /*#__PURE__*/React.createElement(Photo, {
    ratio: "5x4",
    caption: "Painted-over intumescent strip \xB7 Plymouth"
  })), /*#__PURE__*/React.createElement(Section, {
    tone: "dark"
  }, /*#__PURE__*/React.createElement(Heading, {
    level: "statement",
    eyebrow: "Why it matters",
    eyebrowStyle: {
      color: 'var(--jfd-azure-soft)'
    },
    style: {
      maxWidth: '20ch'
    }
  }, "A fire door only works if it's closed, sealed and recorded."), /*#__PURE__*/React.createElement(Flow, {
    steps: ['Survey', 'Report', 'Repair', 'Certify'],
    style: {
      marginTop: 40,
      color: 'var(--jfd-dark-ink)'
    }
  })), /*#__PURE__*/React.createElement(Section, {
    tone: "action",
    innerStyle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "jfd-eyebrow",
    style: {
      color: 'var(--jfd-azure-pale)'
    }
  }, "Next step"), /*#__PURE__*/React.createElement("div", {
    className: "jfd-h3"
  }, "Book a survey for your building."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--jfd-azure-mist)',
      margin: '12px 0 0',
      fontSize: 16.5
    }
  }, "Tell us the address and number of doors \u2014 we'll confirm a date.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "inverse",
    size: "lg",
    onClick: () => go('book')
  }, "Book an inspection"), /*#__PURE__*/React.createElement(TextLink, {
    onDark: true,
    href: "#"
  }, "View sample report"))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/InspectionPage.jsx
try { (() => {
const {
  Section,
  Heading,
  Button,
  Photo,
  NumberedRow,
  Chip,
  HairlineGrid,
  Tile,
  Flow
} = window.JustFireDoorsDesignSystem_26c076;
function InspectionPage({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    innerStyle: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 56,
      alignItems: 'center'
    },
    style: {
      paddingTop: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "jfd-label",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home');
    }
  }, "Home"), " / Services"), /*#__PURE__*/React.createElement(Heading, {
    level: "h1",
    eyebrow: "Service 01",
    style: {
      fontSize: 'clamp(44px,5.4vw,68px)'
    }
  }, "Fire door inspection"), /*#__PURE__*/React.createElement("p", {
    className: "jfd-lead",
    style: {
      margin: '24px 0 28px'
    }
  }, "A door-by-door survey against BS 8214, with photographs, a status for every door and a costed list of remedials."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Chip, null, "BS 8214"), /*#__PURE__*/React.createElement(Chip, null, "FD30"), /*#__PURE__*/React.createElement(Chip, null, "FD60"), /*#__PURE__*/React.createElement(Chip, null, "Fire Safety Regs 2022")), /*#__PURE__*/React.createElement(Button, {
    onClick: () => go('book')
  }, "Book an inspection")), /*#__PURE__*/React.createElement(Photo, {
    ratio: "16x10",
    caption: "Inspector checking leaf gap with feeler gauge"
  })), /*#__PURE__*/React.createElement(Section, {
    tone: "surface"
  }, /*#__PURE__*/React.createElement(Heading, {
    level: "h2",
    eyebrow: "What we check",
    style: {
      marginBottom: 32
    }
  }, "Seven points on every door."), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement(NumberedRow, {
    index: "01",
    title: "Leaf and frame"
  }, "Damage, warping, certification label."), /*#__PURE__*/React.createElement(NumberedRow, {
    index: "02",
    title: "Gaps"
  }, "Measured at head, hinge and latch sides."), /*#__PURE__*/React.createElement(NumberedRow, {
    index: "03",
    title: "Intumescent and smoke seals"
  }, "Present, continuous, unpainted."), /*#__PURE__*/React.createElement(NumberedRow, {
    index: "04",
    title: "Self-closer"
  }, "Closes and latches from any angle."))), /*#__PURE__*/React.createElement(Section, {
    tone: "tint"
  }, /*#__PURE__*/React.createElement(Heading, {
    level: "h3",
    eyebrow: "The process",
    style: {
      marginBottom: 24
    }
  }, "From survey to certificate."), /*#__PURE__*/React.createElement(Flow, {
    steps: ['Book', 'Survey', 'Report in 48 hrs', 'Remedials', 'Re-inspect']
  })));
}
window.InspectionPage = InspectionPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/InspectionPage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Flow = __ds_scope.Flow;

__ds_ns.HairlineGrid = __ds_scope.HairlineGrid;

__ds_ns.Tile = __ds_scope.Tile;

__ds_ns.NumberedRow = __ds_scope.NumberedRow;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Heading = __ds_scope.Heading;

__ds_ns.Section = __ds_scope.Section;

__ds_ns.Photo = __ds_scope.Photo;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.JobRecord = __ds_scope.JobRecord;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

})();

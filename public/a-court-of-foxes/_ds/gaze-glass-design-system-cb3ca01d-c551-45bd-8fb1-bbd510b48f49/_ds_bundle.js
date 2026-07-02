/* @ds-bundle: {"format":3,"namespace":"GazeGlassDesignSystem_cb3ca0","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"bd2c8ed0f28e","components/core/Button.jsx":"a18e52bc6b87","components/core/Card.jsx":"e05f30506266","components/core/Divider.jsx":"8d640eb36409","components/core/Eyebrow.jsx":"88dba4790397","components/core/Input.jsx":"93576ae4f90e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GazeGlassDesignSystem_cb3ca0 = window.GazeGlassDesignSystem_cb3ca0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — a small classification mark. "Witnessed by Justice", god domains,
 * spirit roles. Quiet by default; spectrum-tinted for divine domains.
 */
function Badge({
  children,
  tone = "gold",
  icon,
  style = {},
  ...rest
}) {
  const tones = {
    gold: {
      color: "var(--gg-gold-bright)",
      border: "rgba(201,162,39,0.5)",
      bg: "rgba(201,162,39,0.08)"
    },
    larimar: {
      color: "var(--gg-larimar)",
      border: "rgba(95,183,196,0.5)",
      bg: "rgba(95,183,196,0.08)"
    },
    amber: {
      color: "var(--gg-honey-amber)",
      border: "rgba(224,160,48,0.5)",
      bg: "rgba(224,160,48,0.08)"
    },
    magenta: {
      color: "var(--gg-magenta-aura)",
      border: "rgba(181,23,158,0.5)",
      bg: "rgba(181,23,158,0.10)"
    },
    muted: {
      color: "var(--gg-text-muted)",
      border: "var(--gg-hairline)",
      bg: "transparent"
    }
  };
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      fontFamily: "var(--gg-font-mortals)",
      fontSize: "0.6875rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.16em",
      color: t.color,
      border: `1px solid ${t.border}`,
      background: t.bg,
      padding: "0.3rem 0.7rem",
      borderRadius: "var(--gg-radius-pill)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      lineHeight: 0
    }
  }, icon) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the primary call to ritual. "Enter the glass", "Begin the observation".
 * Gold is illumination, not decoration: use `primary` sparingly, once per view.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  as = "button",
  href,
  icon,
  iconRight,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "0.5rem 1rem",
      fontSize: "0.8125rem",
      letterSpacing: "0.16em"
    },
    md: {
      padding: "0.85rem 1.75rem",
      fontSize: "0.875rem",
      letterSpacing: "0.18em"
    },
    lg: {
      padding: "1.1rem 2.5rem",
      fontSize: "1rem",
      letterSpacing: "0.2em"
    }
  };
  const variants = {
    primary: {
      background: "var(--gg-gold-leaf)",
      color: "var(--gg-ink-900)",
      border: "1px solid var(--gg-gold-leaf)",
      boxShadow: "var(--gg-glow-gold-soft)"
    },
    secondary: {
      background: "transparent",
      color: "var(--gg-parchment-bone)",
      border: "1px solid var(--gg-border-gold)"
    },
    ghost: {
      background: "transparent",
      color: "var(--gg-text-gold)",
      border: "1px solid transparent",
      padding: "0.5rem 0.25rem"
    }
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.6rem",
    fontFamily: "var(--gg-font-mortals)",
    fontWeight: 600,
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    borderRadius: "var(--gg-radius-sm)",
    transition: "all var(--gg-dur-fast) var(--gg-ease)",
    lineHeight: 1,
    whiteSpace: "nowrap",
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const Tag = href ? "a" : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: href ? undefined : disabled,
    style: base
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      fontSize: "1.1em",
      lineHeight: 0
    }
  }, icon) : null, /*#__PURE__*/React.createElement("span", null, children), iconRight ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      fontSize: "1.1em",
      lineHeight: 0
    }
  }, iconRight) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — an archive plate. A bordered, atmospheric container for a mortal,
 * a god, or a spirit. Etched, not bubbly: thin gold hairline, deep shadow,
 * subtle parchment veil. Not for filler — every plate holds a soul.
 */
function Card({
  children,
  glow = false,
  as = "div",
  style = {},
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      position: "relative",
      background: "linear-gradient(180deg, var(--gg-ink-800) 0%, var(--gg-ink-900) 100%)",
      border: "1px solid var(--gg-border)",
      borderRadius: "var(--gg-radius-md)",
      boxShadow: glow ? "var(--gg-shadow-lg), var(--gg-glow-gold-soft)" : "var(--gg-shadow-md)",
      overflow: "hidden",
      color: "var(--gg-text)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      inset: "0 0 auto 0",
      height: "1px",
      background: "linear-gradient(90deg, transparent, var(--gg-border-gold) 50%, transparent)"
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Divider — ornamental separator. The brand spark "✦" flanked by hairlines.
 * Use to mark thresholds between passages, not as filler.
 */
function Divider({
  glyph = "✦",
  color = "gold",
  width = "100%",
  style = {},
  ...rest
}) {
  const c = color === "gold" ? "var(--gg-border-gold)" : "var(--gg-hairline)";
  const glyphColor = color === "gold" ? "var(--gg-text-gold)" : "var(--gg-text-faint)";
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "1.25rem",
      width,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: "1px",
      background: c
    }
  }), glyph ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      color: glyphColor,
      fontSize: "0.85rem",
      lineHeight: 0
    }
  }, glyph) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: "1px",
      background: c
    }
  }));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Eyebrow — the small-caps, wide-tracked label that opens a section.
 * Often numbered, museum-placard style: "01 / The Seer Records".
 */
function Eyebrow({
  children,
  number,
  color = "gold",
  align = "left",
  style = {},
  ...rest
}) {
  const colors = {
    gold: "var(--gg-text-gold)",
    muted: "var(--gg-text-muted)",
    larimar: "var(--gg-larimar)",
    magenta: "var(--gg-magenta-aura)"
  };
  return /*#__PURE__*/React.createElement("p", _extends({
    style: {
      fontFamily: "var(--gg-font-mortals)",
      fontWeight: 600,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "var(--gg-tracking-eyebrow)",
      color: colors[color],
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      justifyContent: align === "center" ? "center" : "flex-start",
      margin: 0,
      ...style
    }
  }, rest), number ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.85
    }
  }, number), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: "2rem",
      height: "1px",
      background: "currentColor",
      opacity: 0.5
    }
  })) : null, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — a quiet field for the Circle. Underline-only by default (the brand
 * is etched, not boxed); `boxed` for forms on parchment. Gold focus glow.
 */
function Input({
  label,
  hint,
  variant = "line",
  style = {},
  id,
  ...rest
}) {
  const fieldId = id || (label ? `gg-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const boxed = variant === "boxed";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      width: "100%"
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: "var(--gg-font-mortals)",
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.18em",
      color: "var(--gg-text-muted)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    style: {
      fontFamily: "var(--gg-font-mortals)",
      fontSize: "1rem",
      color: "var(--gg-text)",
      background: boxed ? "var(--gg-surface-veil)" : "transparent",
      border: "none",
      borderBottom: "1px solid var(--gg-border-gold)",
      borderRadius: boxed ? "var(--gg-radius-sm)" : 0,
      outline: "none",
      padding: boxed ? "0.85rem 1rem" : "0.6rem 0.1rem",
      width: "100%",
      transition: "border-color var(--gg-dur-fast) var(--gg-ease), box-shadow var(--gg-dur-fast) var(--gg-ease)",
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = "var(--gg-gold-bright)";
      e.target.style.boxShadow = "0 1px 0 var(--gg-gold-bright)";
    },
    onBlur: e => {
      e.target.style.borderColor = "var(--gg-border-gold)";
      e.target.style.boxShadow = "none";
    }
  }, rest)), hint ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--gg-font-mortals)",
      fontSize: "0.8125rem",
      color: "var(--gg-text-faint)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Input = __ds_scope.Input;

})();

/* Examples Catalogue > Overview only. The title toggles Material's native
 * checkbox; sessionStorage keeps this tab's choice across pages and refreshes.
 * A fresh direct family link opens the group so its active item is discoverable.
 * The original Overview URL remains available through breadcrumbs/direct links.
 */
(() => {
  if (window.dualSPHOverviewNavigation) return;
  window.dualSPHOverviewNavigation = true;
  const key = "dualsphdocs.catalogue.overview.expanded";
  let fallback = null;
  function savedState() {
    try { return sessionStorage.getItem(key); } catch (_) { return fallback; }
  }
  function saveState(value) {
    fallback = String(value);
    try { sessionStorage.setItem(key, fallback); } catch (_) { /* Use memory if storage is disabled. */ }
  }
  function setupOverview() {
    const sidebar = document.querySelector(".md-nav--primary");
    if (!sidebar) return;
    const link = [...sidebar.querySelectorAll(".md-nav__container > a")].find(a =>
      new URL(a.href).pathname.replace(/\/$/, "").endsWith("/examples_catalogue/catalogue")
    );
    const item = link && link.closest("li.md-nav__item--nested");
    if (!item) return;
    const checkbox = item.querySelector(":scope > input.md-nav__toggle");
    const arrow = item.querySelector(":scope > .md-nav__container > label");
    const children = item.querySelector(":scope > nav");
    if (!checkbox || !arrow || !children || checkbox.dataset.overviewToggle) return;
    checkbox.dataset.overviewToggle = "true";
    item.classList.remove("md-nav__item--section");
    item.classList.add("catalogue-overview");
    const saved = savedState();
    checkbox.checked = saved === null ? !!children.querySelector(".md-nav__item--active") : saved === "true";
    children.id = checkbox.id + "_children";
    arrow.hidden = true;
    arrow.tabIndex = -1;
    arrow.removeAttribute("role");
    arrow.setAttribute("aria-hidden", "true");
    link.setAttribute("role", "button");
    link.setAttribute("aria-controls", children.id);
    const back = children.querySelector(":scope > label.md-nav__title");
    if (back) {
      back.tabIndex = 0;
      back.setAttribute("role", "button");
      back.setAttribute("aria-label", "Back to Examples Catalogue");
    }
    function update() {
      const expanded = checkbox.checked;
      saveState(expanded);
      link.setAttribute("aria-expanded", String(expanded));
      children.setAttribute("aria-expanded", String(expanded));
    }
    checkbox.addEventListener("change", update);
    link.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      checkbox.click();
    });
    function onKey(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopImmediatePropagation();
        checkbox.click();
      }
    }
    link.addEventListener("keydown", onKey);
    if (back) back.addEventListener("keydown", onKey);
    update();
  }
  if (typeof document$ !== "undefined") document$.subscribe(setupOverview);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupOverview);
  else setupOverview();
})();

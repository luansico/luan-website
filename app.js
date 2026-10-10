(function () {
  "use strict";
  const languages = ["sq", "en"];
  const categories = ["electrical", "cameras", "it"];
  const serviceIds = ["electrical", "cameras", "computers", "network", "other"];
  function requireValue(condition, message) { if (!condition) throw new Error(message); }
  function bilingual(value, field) {
    requireValue(value && languages.every(lang => typeof value[lang] === "string" && value[lang].trim().length > 0), field + " requires Albanian and English text.");
  }
  function httpsUrl(value) {
    try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; }
  }
  function localAsset(value) { return typeof value === "string" && /^assets\/[a-zA-Z0-9_/-]+\.(jpg|jpeg|png|webp)$/.test(value) && !value.includes(".."); }
  function emailAddress(value) { return typeof value === "string" && /^[^\s@\u0000-\u001f]+@[^\s@\u0000-\u001f]+\.[^\s@\u0000-\u001f]+$/.test(value) && value.length <= 180 && !/[<>?&#]/.test(value); }
  function validateSite(site) {
    requireValue(site && languages.includes(site.defaultLanguage), "Invalid default language.");
    requireValue(site.contact && typeof site.contact.name === "string" && site.contact.name.trim(), "Missing contact name.");
    requireValue(httpsUrl(site.contact.linkedin) && new URL(site.contact.linkedin).hostname === "www.linkedin.com", "LinkedIn requires a valid HTTPS profile URL.");
    requireValue(site.contact.email === null || site.contact.email === "" || emailAddress(site.contact.email), "Invalid contact email; use null until confirmed.");
    requireValue(site.contact.phone === null || site.contact.phone === "" || (typeof site.contact.phone === "string" && /^\+[1-9][0-9]{6,14}$/.test(site.contact.phone)), "Phone must be international format, or null.");
    requireValue(site.contact.whatsapp === null || site.contact.whatsapp === "" || (typeof site.contact.whatsapp === "string" && /^\+[1-9][0-9]{6,14}$/.test(site.contact.whatsapp)), "WhatsApp must be international format, or null.");
    requireValue(Array.isArray(site.contact.socials), "Social links must be an array.");
    for (const link of site.contact.socials) requireValue(typeof link.label === "string" && link.label.trim() && httpsUrl(link.url), "Invalid social link.");
    requireValue(Array.isArray(site.projects) && Array.isArray(site.testimonials), "Projects and testimonials must be arrays.");
    const seen = new Set();
    for (const project of site.projects) {
      requireValue(typeof project.id === "string" && /^[a-z0-9-]+$/.test(project.id) && !seen.has(project.id), "Project IDs must be unique slugs."); seen.add(project.id);
      requireValue(categories.includes(project.category) && ["example", "project"].includes(project.kind), "Invalid project category or kind.");
      requireValue(localAsset(project.image), "Project images must be local assets.");
      for (const field of ["title", "summary", "detail"]) bilingual(project[field], project.id + "." + field);
      requireValue(project.items && languages.every(lang => Array.isArray(project.items[lang]) && project.items[lang].length > 0 && project.items[lang].every(item => typeof item === "string" && item.trim())), "Project scope lists need both languages.");
      requireValue(Array.isArray(project.links), "Project links must be an array.");
      for (const link of project.links) { bilingual(link.label, "Media label"); requireValue(httpsUrl(link.url), "Media links must use HTTPS."); }
      if (project.kind === "project") requireValue(project.approved === true && typeof project.source === "string" && project.source.trim(), "Real projects require approval and a source reference.");
    }
    for (const review of site.testimonials) {
      requireValue(review.approved === true && typeof review.source === "string" && review.source.trim(), "Reviews require approval and a source reference.");
      requireValue(typeof review.name === "string" && review.name.trim(), "Review name is required.");
      bilingual(review.quote, "Review quote"); bilingual(review.context, "Review context");
    }
    return site;
  }
  function validateEnquiry(data) {
    const lengths = { name: [2, 100], location: [2, 150], message: [10, 2500], phone: [0, 50] };
    for (const [field, bounds] of Object.entries(lengths)) {
      if (typeof data[field] !== "string" || data[field].trim().length < bounds[0] || data[field].length > bounds[1] || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(data[field])) return false;
      if (field !== "message" && /[\r\n]/.test(data[field])) return false;
    }
    return typeof data.email === "string" && (data.email === "" || emailAddress(data.email)) && serviceIds.includes(data.service);
  }
  function whatsappUrl(number, message) {
    requireValue(typeof number === "string" && /^\+[1-9][0-9]{6,14}$/.test(number), "Invalid WhatsApp number.");
    return "https://wa.me/" + number.slice(1) + "?text=" + encodeURIComponent(message);
  }
  // Small pure validation API also used by the local checks.
  window.LuanValidation = { validateSite, validateEnquiry, httpsUrl, localAsset, whatsappUrl };
  if (typeof document === "undefined") return;
  const $ = selector => document.querySelector(selector);
  let site;
  try { site = validateSite(window.LUAN_SITE); }
  catch (error) { $("#config-error").textContent = "Ju lutemi na kontaktoni në WhatsApp ose telefon. / Please contact us on WhatsApp or by phone."; $("#config-error").hidden = false; $("#enquiry-form").hidden = true; return; }
  let lang = site.defaultLanguage;
  try { const stored = localStorage.getItem("luan-language"); if (languages.includes(stored)) lang = stored; } catch { /* Browsing without storage still works. */ }
  const translations = window.LUAN_TRANSLATIONS;
  let filter = "all";
  let currentProject = null;
  let preparedData = null;
  function t(key) { return translations[lang]?.[key] ?? translations.sq?.[key] ?? ""; }
  function textBlock(element, value) {
    element.replaceChildren();
    value.split("<br>").forEach((line, i) => { if (i) element.append(document.createElement("br")); element.append(document.createTextNode(line)); });
  }
  function make(tag, className, value) { const el = document.createElement(tag); if (className) el.className = className; if (value !== undefined) el.textContent = value; return el; }
  function icon(name) { const el = document.createElementNS("http://www.w3.org/2000/svg", "svg"); el.classList.add("icon"); el.setAttribute("aria-hidden", "true"); const use = document.createElementNS("http://www.w3.org/2000/svg", "use"); use.setAttribute("href", "#i-" + name); el.append(use); return el; }
  function externalLink(url, label, className) { const link = make("a", className, label); link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; return link; }
  function categoryLabel(category) { return t({ electrical: "filterElectrical", cameras: "filterCameras", it: "filterIt" }[category]); }
  function updateFormIntroduction() {
    $("#form-intro").textContent = t(site.contact.whatsapp ? "formWhatsappIntro" : site.contact.email ? "formEmailIntro" : "formIntro");
    $("#result-instruction").textContent = t(site.contact.whatsapp ? "resultWhatsappInstruction" : site.contact.email ? "resultEmailInstruction" : "resultInstruction");
    $("#whatsapp-hint").hidden = !site.contact.whatsapp;
    document.querySelectorAll("[data-whatsapp]").forEach(link => {
      link.hidden = !site.contact.whatsapp;
      if (site.contact.whatsapp) link.href = whatsappUrl(site.contact.whatsapp, t("whatsappGreeting"));
    });
  }
  function renderServices() {
    const grid = $("#service-grid"); grid.replaceChildren();
    window.LUAN_SERVICES.forEach((service, index) => {
      const card = make("article", "service-card");
      const top = make("div", "service-top"); top.append(icon(service.icon), make("span", "service-number", "0" + (index + 1)));
      card.append(top, make("h3", "", service.title[lang]), make("p", "", service.description[lang]));
      const list = make("ul"); service.items[lang].forEach(item => { const li = make("li"); li.append(icon("check"), make("span", "", item)); list.append(li); }); card.append(list);
      const link = make("a", "text-link"); link.href = "#contact"; link.dataset.service = service.id; link.append(make("span", "", t("serviceCta")), icon("arrow")); card.append(link); grid.append(card);
    });
  }
  function renderProjects() {
    const grid = $("#project-grid"); grid.replaceChildren();
    const projects = site.projects.filter(project => filter === "all" || project.category === filter);
    $("#work-count").textContent = projects.length + " " + t("itemsShown");
    $("#examples-note").hidden = !site.projects.some(project => project.kind === "example");
    if (!projects.length) { grid.append(make("p", "", t("noProjects"))); return; }
    for (const project of projects) {
      const card = make("article", "project-card");
      const visual = make("div", "project-image-wrap"); const img = make("img"); img.src = project.image; img.alt = project.title[lang] + " — " + t(project.kind === "example" ? "exampleLabel" : "projectLabel"); img.loading = "lazy"; img.width = 700; img.height = 480;
      visual.append(img, make("span", "image-label", t(project.kind === "example" ? "exampleLabel" : "projectLabel")));
      const title = make("div", "project-title-row"); const heading = make("h3", "", project.title[lang]);
      const button = make("button", "project-open"); button.type = "button"; button.dataset.project = project.id; button.setAttribute("aria-label", t("viewDetails") + ": " + project.title[lang]); button.setAttribute("aria-haspopup", "dialog"); button.append(icon("diagonal")); title.append(heading, button);
      card.append(visual, make("p", "project-category", categoryLabel(project.category)), title, make("p", "", project.summary[lang])); grid.append(card);
    }
  }
  function renderTestimonials() {
    const grid = $("#testimonials"); grid.replaceChildren();
    grid.hidden = site.testimonials.length === 0; $("#references-panel").hidden = site.testimonials.length > 0;
    for (const review of site.testimonials) { const quote = make("blockquote"); quote.append(make("p", "", "“" + review.quote[lang] + "”"), make("cite", "", review.name + " · " + review.context[lang])); grid.append(quote); }
  }
  function renderContacts() {
    document.querySelectorAll("[data-linkedin]").forEach(link => { link.href = site.contact.linkedin; });
    const direct = $("#direct-contacts"); direct.replaceChildren();
    if (site.contact.email) { const link = make("a", "direct-contact", site.contact.email); link.href = "mailto:" + site.contact.email; direct.append(link); }
    if (site.contact.phone) { const link = make("a", "direct-contact", site.contact.phone); link.href = "tel:" + site.contact.phone; direct.append(link); }
    for (const social of site.contact.socials) { const link = externalLink(social.url, social.label, "direct-contact"); link.append(icon("diagonal")); direct.append(link); }
  }
  function renderProjectDetail() {
    const project = currentProject; if (!project) return;
    const root = $("#project-detail"); root.replaceChildren();
    const img = make("img", "detail-image"); img.src = project.image; img.alt = project.title[lang];
    const body = make("div", "detail-body"); const heading = make("h2", "", project.title[lang]); heading.id = "dialog-title";
    body.append(make("p", "eyebrow", categoryLabel(project.category) + " / " + t(project.kind === "example" ? "exampleLabel" : "projectLabel")), heading, make("p", "", project.detail[lang]));
    const list = make("ul"); project.items[lang].forEach(item => list.append(make("li", "", item))); body.append(list);
    if (project.links.length) { const links = make("div", "media-links"); for (const media of project.links) { const link = externalLink(media.url, media.label[lang], "text-link"); link.append(icon("diagonal")); links.append(link); } body.append(links); }
    body.append(make("p", "detail-disclaimer", t(project.kind === "example" ? "exampleDisclaimer" : "projectDisclaimer")));
    const cta = make("a", "button button-primary", t("discussProject")); cta.href = "#contact"; cta.dataset.service = project.category === "it" ? "network" : project.category; cta.append(icon("arrow")); body.append(cta); root.append(img, body);
  }
  function serviceLabel(service) { return t({ electrical: "specialty1", cameras: "specialty2", computers: "specialty3", network: "specialty4", other: "serviceOther" }[service]); }
  function enquiryText(data) {
    return [t("enquiryGreeting"), "", t("labelName").replace(" *", "") + ": " + data.name, ...(data.email ? ["Email: " + data.email] : []), ...(data.phone ? [t("labelPhone").replace(/ \(.+\)/, "") + ": " + data.phone] : []), t("labelService").replace(" *", "") + ": " + serviceLabel(data.service), t("labelLocation").replace(" *", "") + ": " + data.location, "", data.message, "", t("enquiryClosing"), t("enquirySource")].join("\n");
  }
  function showEnquiry(scroll) {
    if (!preparedData) return;
    const message = enquiryText(preparedData); $("#enquiry-text").value = message;
    const send = $("#send-enquiry"); send.replaceChildren(make("span", "", t(site.contact.whatsapp ? "openWhatsapp" : site.contact.email ? "openEmail" : "openLinkedin")), icon("diagonal"));
    send.href = site.contact.whatsapp ? whatsappUrl(site.contact.whatsapp, message) : site.contact.email ? "mailto:" + site.contact.email + "?subject=" + encodeURIComponent(t("enquirySubject") + " — " + serviceLabel(preparedData.service)) + "&body=" + encodeURIComponent(message) : site.contact.linkedin;
    if (site.contact.email && !site.contact.whatsapp) send.removeAttribute("target"); else send.target = "_blank";
    $("#enquiry-result").hidden = false; $("#copy-status").textContent = ""; updateFormIntroduction();
    if (site.contact.whatsapp && send.href.length > 2000) { send.href = whatsappUrl(site.contact.whatsapp, ""); $("#result-instruction").textContent = t("longWhatsappInstruction"); }
    if (scroll) $(".result-title").focus({preventScroll:true});
    if (scroll) $("#enquiry-result").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }
  function clearEnquiry() { preparedData = null; $("#enquiry-result").hidden = true; $("#enquiry-text").value = ""; $("#copy-status").textContent = ""; $("#send-enquiry").removeAttribute("href"); $("#form-error").hidden = true; }
  function setLanguage(next, save) {
    lang = next; document.documentElement.lang = lang; document.title = t("title"); $("meta[name=description]").content = t("description"); $("meta[property='og:title']").content = t("title"); $("meta[property='og:description']").content = t("description");
    document.querySelectorAll("[data-i18n]").forEach(el => textBlock(el, t(el.dataset.i18n)));
    for (const [attribute, dataset] of [["aria-label", "i18nAria"], ["placeholder", "i18nPlaceholder"], ["alt", "i18nAlt"]]) document.querySelectorAll("[data-" + dataset.replace(/[A-Z]/g, char => "-" + char.toLowerCase()) + "]").forEach(el => el.setAttribute(attribute, t(el.dataset[dataset])));
    document.querySelectorAll("[data-language]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === lang)));
    renderServices(); renderProjects(); renderTestimonials(); renderProjectDetail(); updateFormIntroduction(); showEnquiry(false);
    if (!$("#form-error").hidden) $("#form-error").textContent = t("formInvalid");
    if (save) try { localStorage.setItem("luan-language", lang); } catch { /* Language changes do not require storage. */ }
  }
  const menu = $("#menu-toggle");
  function closeMenu() { menu.setAttribute("aria-expanded", "false"); $("#main-nav").classList.remove("is-open"); }
  menu.addEventListener("click", () => { const open = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", String(open)); $("#main-nav").classList.toggle("is-open", open); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { closeMenu(); menu.focus(); } });
  document.addEventListener("click", event => {
    const language = event.target.closest("[data-language]"); if (language) { setLanguage(language.dataset.language, true); return; }
    const filterButton = event.target.closest("[data-filter]"); if (filterButton) { filter = filterButton.dataset.filter; document.querySelectorAll("[data-filter]").forEach(button => button.setAttribute("aria-pressed", String(button === filterButton))); renderProjects(); return; }
    const projectButton = event.target.closest("[data-project]"); if (projectButton) { currentProject = site.projects.find(project => project.id === projectButton.dataset.project); renderProjectDetail(); $("#project-dialog").showModal(); return; }
    const serviceLink = event.target.closest("[data-service]"); if (serviceLink) { $("#service").value = serviceLink.dataset.service; clearEnquiry(); $("#project-dialog").close(); }
    const closer = event.target.closest("[data-close-dialog]"); if (closer) closer.closest("dialog").close();
    if (event.target.closest("#main-nav a")) closeMenu();
    if (!event.target.closest(".header-inner") && menu.getAttribute("aria-expanded") === "true") closeMenu();
  });
  $("#privacy-open").addEventListener("click", () => $("#privacy-dialog").showModal());
  document.querySelectorAll("dialog").forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    // Keep keyboard focus inside the open dialog across browser implementations.
    dialog.addEventListener("keydown", event => {
      if (event.key !== "Tab") return;
      const controls = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(el => el.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  });
  $("#enquiry-form").addEventListener("input", clearEnquiry);
  $("#enquiry-form").addEventListener("change", clearEnquiry);
  $("#enquiry-form").addEventListener("submit", event => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!validateEnquiry(data)) { $("#form-error").textContent = t("formInvalid"); $("#form-error").hidden = false; return; }
    preparedData = data; $("#form-error").hidden = true; showEnquiry(true);
  });
  $("#copy-enquiry").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("#enquiry-text").value); $("#copy-status").textContent = t("copySuccess"); }
    catch { $("#enquiry-text").focus(); $("#enquiry-text").select(); $("#copy-status").textContent = t("copyFallback"); }
  });
  $("#year").textContent = new Date().getFullYear();
  renderContacts(); setLanguage(lang, false);
})();

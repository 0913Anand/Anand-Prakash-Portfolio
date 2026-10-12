const projectList = document.querySelector("#project-list");
const renderProjects = (filter = "all") => {
  projectList.innerHTML = projects.filter((project) => filter === "all" || project.categories.includes(filter)).map((project, index) => `<article class="project-card reveal"><div class="project-top"><span>${String(index + 1).padStart(2, "0")} / ${project.type}</span><span>${project.categories.map((category) => category.replace("-", " ")).join(" · ")}</span></div><h3>${project.name}</h3><p>${project.summary}</p><div class="tags">${project.stack.map((tag) => `<span>${tag}</span>`).join("")}</div><div class="project-actions"><button class="text-button details-button" data-project="${projects.indexOf(project)}">View details ↗</button>${project.slug ? `<a class="text-button" href="project.html?slug=${project.slug}">Case study ↗</a>` : ""}${project.github ? `<a class="text-button" href="${project.github}" target="_blank" rel="noreferrer">GitHub ↗</a>` : ""}${project.demo ? `<a class="text-button" href="${project.demo}" target="_blank" rel="noreferrer">Live demo ↗</a>` : ""}</div></article>`).join("");
};
renderProjects();
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => { document.querySelector(".filter.active").classList.remove("active"); document.querySelectorAll(".filter").forEach((filterButton) => filterButton.setAttribute("aria-pressed", String(filterButton === button))); button.classList.add("active"); renderProjects(button.dataset.filter); }));
const dialog = document.querySelector("#project-dialog");
projectList.addEventListener("click", (event) => { const button = event.target.closest(".details-button"); if (!button) return; const project = projects[button.dataset.project]; document.querySelector("#dialog-content").innerHTML = `<span class="dialog-meta">${project.type}</span><h2 id="dialog-title">${project.name}</h2><h4>Problem</h4><p>${project.problem}</p><h4>Solution</h4><p>${project.solution}</p><h4>Architecture</h4><p>${project.architecture}</p><p>${project.details}</p><h4>Implementation decisions</h4><ul>${project.decisions.map((decision) => `<li>${decision}</li>`).join("")}</ul><div class="tags">${project.stack.map((tag) => `<span>${tag}</span>`).join("")}</div>`; dialog.showModal(); });
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
document.querySelector("#skill-grid").innerHTML = skillCategories.map(([name, skillList], index) => `<div class="skill-card"><span>${String(index + 1).padStart(2, "0")}</span><h3>${name}</h3><div class="skill-badges">${skillList.map((skill) => `<span>${skill}</span>`).join("")}</div></div>`).join("");
document.querySelector("#credential-list").innerHTML = certifications.map((credential) => `<li><strong>${credential.name}</strong><span>${credential.issuer}</span><small>${credential.kind}</small></li>`).join("");
const palette = document.querySelector("#command-palette");
const commandSearch = document.querySelector("#command-search");
const commandResults = document.querySelector("#command-results");
const restorePaletteFocus = () => {
  window.setTimeout(() => {
    const focusTarget = window.matchMedia("(max-width: 850px)").matches
      ? document.querySelector(".menu-toggle")
      : document.querySelector(".command-trigger");
    focusTarget?.focus();
  }, 100);
};
const commands = [
  ["Home", "#home", "Navigate"],
  ["About", "#about", "Navigate"],
  ["Projects", "#projects", "Navigate"],
  ["Engineering Lab", "#lab", "Navigate"],
  ["Skills", "#skills", "Navigate"],
  ["Education & Certifications", "#education", "Navigate"],
  ["Contact", "#contact", "Navigate"],
  ["Download Resume", "Anand_Prakash_Master_Resume.pdf", "Action"],
];
const renderCommands = () => {
  const query = commandSearch.value.trim().toLowerCase();
  const matches = commands.filter(([label]) => label.toLowerCase().includes(query));
  commandResults.innerHTML = matches.length ? matches.map(([label, target, group], index) => `<button class="command-item" role="option" data-target="${target}" aria-selected="${index === 0}"><span>${label}</span><small>${group}</small></button>`).join("") : `<p class="command-empty">No matching commands. Try “projects” or “contact”.</p>`;
};
const openPalette = () => { palette.showModal(); commandSearch.value = ""; renderCommands(); commandSearch.focus(); };
document.querySelector(".command-trigger").addEventListener("click", openPalette);
document.querySelector(".palette-nav-trigger").addEventListener("click", () => { menu.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); menuButton.setAttribute("aria-label", "Open navigation"); openPalette(); });
palette.addEventListener("cancel", (event) => { event.preventDefault(); palette.close(); });
palette.addEventListener("close", restorePaletteFocus);
commandSearch.addEventListener("input", renderCommands);
commandResults.addEventListener("click", (event) => { const item = event.target.closest(".command-item"); if (!item) return; palette.close(); if (item.dataset.target.startsWith("#")) document.querySelector(item.dataset.target)?.scrollIntoView({behavior: "smooth"}); else window.location.href = item.dataset.target; });
palette.addEventListener("keydown", (event) => { if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return; const items = [...commandResults.querySelectorAll(".command-item")]; if (!items.length) return; event.preventDefault(); const current = items.findIndex((item) => item.getAttribute("aria-selected") === "true"); const next = (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; items.forEach((item, index) => item.setAttribute("aria-selected", String(index === next))); items[next].focus(); });
palette.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const item = commandResults.querySelector('.command-item[aria-selected="true"]');
  if (!item) return;
  event.preventDefault();
  item.click();
});
palette.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  palette.close();
  restorePaletteFocus();
});
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); if (palette.open) palette.close(); else openPalette(); } });
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 20), {passive:true});
const navigationLinks = [...document.querySelectorAll(".nav-links a")];
const observedSections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, {rootMargin: "-35% 0px -55% 0px"});
observedSections.forEach((section) => sectionObserver.observe(section));
const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), {threshold: 0.12});
document.querySelectorAll(".section-block, .featured-preview, .specialization-strip, .lab-section").forEach((element) => { element.classList.add("reveal"); revealObserver.observe(element); });
const menu = document.querySelector(".nav-links");
const menuButton = document.querySelector(".menu-toggle");
menuButton.addEventListener("click", (event) => { const open = menu.classList.toggle("open"); event.currentTarget.setAttribute("aria-expanded", String(open)); event.currentTarget.setAttribute("aria-label", open ? "Close navigation" : "Open navigation"); });
document.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", () => { menu.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); menuButton.setAttribute("aria-label", "Open navigation"); }));
document.addEventListener("keydown", (event) => { if (event.key !== "Escape") return; if (menu.classList.contains("open")) { menu.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); menuButton.setAttribute("aria-label", "Open navigation"); menuButton.focus(); } });
const themeButton = document.querySelector(".theme-toggle");
const setTheme = (isLight) => { document.body.classList.toggle("light", isLight); themeButton.setAttribute("aria-pressed", String(isLight)); themeButton.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme"); };
themeButton.addEventListener("click", () => { const isLight = !document.body.classList.contains("light"); setTheme(isLight); localStorage.setItem("theme", isLight ? "light" : "dark"); });
setTheme(localStorage.getItem("theme") === "light");
const contactForm = document.querySelector("#contact-form");
const contactError = document.querySelector("#contact-error");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactError.hidden = true;
  contactForm.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
  if (!contactForm.checkValidity()) {
    const firstInvalid = contactForm.querySelector(":invalid");
    firstInvalid.setAttribute("aria-invalid", "true");
    contactError.textContent = firstInvalid.type === "email" ? "Enter a valid email address." : "Please complete this field before opening your email draft.";
    contactError.hidden = false;
    firstInvalid.focus();
    return;
  }
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(data.get("subject"));
  const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
  document.querySelector("#contact-status").textContent = "Opening your email client with a pre-filled draft…";
  window.location.href = `mailto:anandprakash5722@gmail.com?subject=${subject}&body=${body}`;
});

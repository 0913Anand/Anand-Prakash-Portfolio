const slug = new URLSearchParams(window.location.search).get("slug");
const project = projects.find((item) => item.slug === slug);
const container = document.querySelector("#case-content");
if (!project) {
  document.title = "Project not found | Anand Prakash";
  container.innerHTML = `<section class="case-empty"><span class="section-kicker">404 / PROJECT</span><h1>This case study<br /><em>isn't here.</em></h1><p>That project page does not exist or does not have a published case study yet.</p><a class="button button-primary" href="index.html#projects">Back to projects <b>↗</b></a></section>`;
} else {
  document.title = `${project.name} | Anand Prakash`;
  container.innerHTML = `<section class="case-hero"><span class="section-kicker">${project.type}</span><h1>${project.name}</h1><p>${project.summary}</p><div class="tags">${project.stack.map((tag) => `<span>${tag}</span>`).join("")}</div></section><section class="case-grid"><div><span class="case-label">01 / Problem</span><h2>What needed to be solved</h2><p>${project.problem}</p><span class="case-label">02 / Solution</span><h2>How it was approached</h2><p>${project.solution}</p></div><aside class="case-architecture"><span class="case-label">ARCHITECTURE / ILLUSTRATION</span><div class="architecture-flow"><span>Interface</span><i>→</i><span>API / logic</span><i>→</i><span>Data / tools</span></div><p>${project.architecture}</p></aside></section><section class="case-details"><div><span class="case-label">03 / Implementation notes</span><h2>Decisions and details</h2><p>${project.details}</p><ul>${project.decisions.map((decision) => `<li>${decision}</li>`).join("")}</ul></div><div class="case-disclaimer"><span class="simulation-badge">CONTENT NOTE</span><p>This case study uses only information currently documented in the portfolio resume. Repository links, screenshots and live demos are omitted unless verified.</p></div></section><a class="case-back-bottom" href="index.html#projects">View all projects ↗</a>`;
}

const workflowInput = document.querySelector("#workflow-input");
const workflowTrack = document.querySelector("#workflow-track");
const workflowResult = document.querySelector("#workflow-result");
const workflowSteps = [...document.querySelectorAll(".workflow-step")];
const workflowExamples = {
  "Summarize a revenue trend": "Summarize a revenue trend",
  "Look up an expense category": "Look up an expense category",
};

document.querySelectorAll(".example-prompt").forEach((button) => {
  button.addEventListener("click", () => {
    workflowInput.value = workflowExamples[button.textContent] || button.textContent;
    workflowInput.focus();
  });
});

const setWorkflowStep = (index, label, detail) => {
  workflowSteps[index].classList.add("complete");
  workflowSteps[index].querySelector("small").textContent = detail;
  if (index < workflowSteps.length - 1) workflowTrack.querySelectorAll("i")[index].classList.add("complete");
  if (label) workflowSteps[index].querySelector("b").textContent = label;
};

const resetWorkflow = () => {
  workflowSteps.forEach((step, index) => {
    step.classList.remove("complete");
    step.querySelector("small").textContent = index === 0 ? "Waiting for a task" : "Not started";
  });
  workflowTrack.querySelectorAll("i").forEach((line) => line.classList.remove("complete"));
  workflowResult.hidden = true;
  workflowResult.textContent = "";
};

document.querySelector("#run-workflow").addEventListener("click", () => {
  const task = workflowInput.value.trim();
  if (!task) {
    workflowInput.focus();
    workflowInput.setCustomValidity("Enter a task to run the simulated workflow.");
    workflowInput.reportValidity();
    return;
  }
  workflowInput.setCustomValidity("");
  resetWorkflow();
  workflowTrack.classList.add("is-running");
  setWorkflowStep(0, "User input", "Task received locally");
  window.setTimeout(() => setWorkflowStep(1, "Agent", "Planning an illustrative path"), 280);
  window.setTimeout(() => setWorkflowStep(2, "Tool selection", task.toLowerCase().includes("expense") ? "Selected database lookup" : "Selected search tool"), 560);
  window.setTimeout(() => {
    setWorkflowStep(3, "Result", "Illustrative response ready");
    workflowResult.hidden = false;
    workflowResult.textContent = `Simulated output for “${task}”: the agent would gather relevant context, call the selected tool, and return a concise answer. No LLM or tool was called.`;
    workflowTrack.classList.remove("is-running");
  }, 840);
});
document.querySelector("#reset-workflow").addEventListener("click", resetWorkflow);

const mockRoutes = {
  tasks: {method: "GET", endpoint: "/api/tasks", body: "", response: {source: "local mock", tasks: [{id: 1, title: "Review API contract", status: "open"}, {id: 2, title: "Validate dashboard data", status: "done"}]}},
  expense: {method: "POST", endpoint: "/api/expenses/summary", body: '{\n  "month": "2026-09"\n}', response: {source: "local mock", month: "2026-09", categories: [{name: "Travel", total: 420}, {name: "Software", total: 180}], note: "Illustrative response only"}},
  health: {method: "GET", endpoint: "/api/health", body: "", response: {source: "local mock", status: "ok", service: "portfolio-demo"}},
};
const apiRoute = document.querySelector("#api-route");
const apiBody = document.querySelector("#api-body");
const apiMethod = document.querySelector("#api-method");
const apiEndpoint = document.querySelector("#api-endpoint");
const apiResponse = document.querySelector("#api-response");
const renderRoute = () => {
  const route = mockRoutes[apiRoute.value];
  apiMethod.textContent = route.method;
  apiEndpoint.textContent = route.endpoint;
  apiBody.value = route.body;
  apiBody.disabled = route.method === "GET";
  apiResponse.textContent = "Ready. This explorer uses a local mock response.";
  apiResponse.className = "api-response";
};
apiRoute.addEventListener("change", renderRoute);
renderRoute();
document.querySelector("#send-api").addEventListener("click", () => {
  const route = mockRoutes[apiRoute.value];
  apiResponse.className = "api-response loading";
  apiResponse.textContent = "Preparing local mock response…";
  window.setTimeout(() => {
    if (route.method === "POST") {
      try { JSON.parse(apiBody.value); } catch {
        apiResponse.className = "api-response error";
        apiResponse.textContent = JSON.stringify({error: "Request body is not valid JSON."}, null, 2);
        return;
      }
    }
    apiResponse.className = "api-response success";
    apiResponse.textContent = JSON.stringify(route.response, null, 2);
  }, 350);
});
document.querySelector("#copy-api").addEventListener("click", async (event) => {
  try {
    await navigator.clipboard.writeText(apiResponse.textContent);
    event.currentTarget.textContent = "Copied";
    window.setTimeout(() => { event.currentTarget.textContent = "Copy response"; }, 1200);
  } catch {
    event.currentTarget.textContent = "Copy unavailable";
  }
});

const analyticsData = [
  {month: "Jan", category: "Web", value: 62}, {month: "Jan", category: "AI", value: 38}, {month: "Jan", category: "Data", value: 48},
  {month: "Feb", category: "Web", value: 74}, {month: "Feb", category: "AI", value: 52}, {month: "Feb", category: "Data", value: 57},
  {month: "Mar", category: "Web", value: 68}, {month: "Mar", category: "AI", value: 77}, {month: "Mar", category: "Data", value: 64},
  {month: "Apr", category: "Web", value: 83}, {month: "Apr", category: "AI", value: 69}, {month: "Apr", category: "Data", value: 72},
  {month: "May", category: "Web", value: 79}, {month: "May", category: "AI", value: 88}, {month: "May", category: "Data", value: 81},
];
const chart = document.querySelector("#bar-chart");
const stats = document.querySelector("#analytics-stats");
const insights = document.querySelector("#analytics-insights");
const renderAnalytics = () => {
  const category = document.querySelector("#analytics-category").value;
  const filtered = analyticsData.filter((row) => category === "all" || row.category === category);
  const months = [...new Set(filtered.map((row) => row.month))];
  chart.innerHTML = months.map((month) => {
    const rows = filtered.filter((row) => row.month === month);
    return `<div class="chart-column"><div class="bars">${rows.map((row) => `<span class="bar bar-${row.category.toLowerCase()}" style="height:${row.value}%" title="${row.category}: ${row.value}"></span>`).join("")}</div><small>${month}</small></div>`;
  }).join("");
  const total = filtered.reduce((sum, row) => sum + row.value, 0);
  const average = Math.round(total / filtered.length);
  const peak = filtered.reduce((top, row) => row.value > top.value ? row : top, filtered[0]);
  stats.innerHTML = `<div><span>ROWS</span><b>${filtered.length}</b></div><div><span>AVERAGE</span><b>${average}</b></div><div><span>PEAK</span><b>${peak.value}</b></div>`;
  insights.innerHTML = `<p><b>Insight 01</b> ${peak.category} reaches its highest illustrative value in ${peak.month} (${peak.value}).</p><p><b>Insight 02</b> The filtered sample averages ${average} across ${filtered.length} category-month rows.</p>`;
};
document.querySelector("#analytics-category").addEventListener("change", renderAnalytics);
document.querySelector("#reset-analytics").addEventListener("click", () => { document.querySelector("#analytics-category").value = "all"; renderAnalytics(); });
renderAnalytics();

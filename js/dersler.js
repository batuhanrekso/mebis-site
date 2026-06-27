function statusClass(status) {
  if (status === "Geçti") return "status-passed";
  if (status === "Devamsız") return "status-absent";
  return "status-failed";
}

function buildCourseRows(items, filterText) {
  const q = filterText.trim().toLowerCase();
  let html = "";

  for (const item of items) {
    if (item.type === "group") {
      html += `<tr class="group-row"><td colspan="12">${item.name}</td></tr>`;
      continue;
    }

    const haystack = [item.name, item.code, item.status, item.course_type]
      .join(" ")
      .toLowerCase();
    if (q && !haystack.includes(q)) continue;

    const supplement = item.has_supplement
      ? `<span class="supplement-icon" data-tooltip="${item.supplement_tooltip || "Bütünleme"}">s</span>`
      : "";
    const history = item.has_history
      ? `<i class="fa fa-history history-icon" title="Geçmiş"></i>`
      : "";
    const coeff = item.coefficient
      ? `${item.letter} | ${item.coefficient}`
      : `${item.letter} | `;

    html += `<tr>
      <td class="icon-col"><i class="fa fa-search icon-action"></i></td>
      <td class="icon-col">${history}${supplement}</td>
      <td>${item.course_type}</td>
      <td>${item.code}</td>
      <td class="course-name">${item.name}</td>
      <td>${item.akts}</td>
      <td>${item.kredi}</td>
      <td>${item.lang}</td>
      <td class="${statusClass(item.status)}">${item.status}</td>
      <td>${item.average}</td>
      <td>${coeff}</td>
      <td class="gear-col"><i class="fa fa-cog"></i> <i class="fa fa-caret-down"></i></td>
    </tr>`;
  }

  return html;
}

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("dersler-body");
  const searchInput = document.getElementById("table-search");
  if (!tbody) return;

  const response = await fetch("data/dersler.json");
  const data = await response.json();

  if (data.stats) {
    document.getElementById("stat-akts").textContent = data.stats.akts;
    document.getElementById("stat-gano").textContent = data.stats.gano;
    document.getElementById("stat-sano").textContent = data.stats.sano;
  }

  const render = () => {
    tbody.innerHTML = buildCourseRows(data.courses, searchInput?.value || "");
  };

  render();
  searchInput?.addEventListener("input", render);
});

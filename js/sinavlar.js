function renderIcon(row) {
  if (row.has_download) {
    return '<i class="fa fa-download text-success"></i>';
  }
  if (row.icon === "exclamation") {
    return '<i class="fa fa-exclamation-circle text-danger fa-lg"></i>';
  }
  if (row.icon === "minus") {
    return '<i class="fa fa-minus-circle text-info fa-lg"></i>';
  }
  return "";
}

function titleClass(row) {
  if (row.accent === "primary") return "title-final";
  if (row.tanim_type === "final") return "title-final";
  if (row.tanim_type === "but") return "title-but";
  return "";
}

function gradeClass(row) {
  if (row.accent === "primary") return "";
  return "";
}

function rowClass(row) {
  return row.active ? "active" : "";
}

function statusClass(row) {
  if (row.accent === "primary") return "status-closed";
  return row.status === "Sonuçlandı" ? "status-result" : "status-closed";
}

function buildTableRows(items, filterText) {
  const q = filterText.trim().toLowerCase();
  let html = "";

  for (const item of items) {
    if (item.type === "group") {
      html += `<tr class="group-row"><td colspan="13">${item.name}</td></tr>`;
      continue;
    }

    const haystack = [
      item.title,
      item.status,
      item.date,
      item.kind,
      item.place,
      item.grade,
    ]
      .join(" ")
      .toLowerCase();

    if (q && !haystack.includes(q)) continue;

    html += `<tr class="${rowClass(item)}">
      <td class="icon-col"></td>
      <td class="icon-col"></td>
      <td class="icon-col">${item.has_download ? '<i class="fa fa-download text-success"></i>' : ""}</td>
      <td class="icon-col"></td>
      <td class="icon-col">${renderIcon(item)}</td>
      <td class="${statusClass(item)}">${item.status}</td>
      <td>${item.date}</td>
      <td>${item.kind}</td>
      <td class="${titleClass(item)}">${item.title}</td>
      <td>${item.group_col}</td>
      <td>${item.time}</td>
      <td class="place-link">${item.place || "-"}</td>
      <td class="${gradeClass(item)}">${item.grade}<i class="fa fa-search-plus pull-right text-success fa-lg"></i></td>
    </tr>`;
  }

  return html;
}

const TAB_DATA = {
  "2025-2026": "data/sinavlar.json",
  sonuclanan: "data/sinavlar-sonuclanan.json",
  acilan: null,
  tumu: "data/sinavlar.json",
};

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("sinavlar-body");
  const searchInput = document.getElementById("table-search");
  const tabLinks = document.querySelectorAll(".nav-tabs [data-tab]");

  if (!tbody) return;

  const cache = {};
  let activeTab = "2025-2026";

  async function loadTab(tabId) {
    if (cache[tabId]) return cache[tabId];
    const url = TAB_DATA[tabId];
    if (!url) return [];
    const response = await fetch(url);
    const data = await response.json();
    cache[tabId] = data;
    return data;
  }

  async function render() {
    const items = await loadTab(activeTab);
    tbody.innerHTML = buildTableRows(items, searchInput?.value || "");
  }

  tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      if (!tabId || tabId === activeTab) return;

      activeTab = tabId;
      tabLinks.forEach((l) => l.parentElement.classList.remove("active"));
      link.parentElement.classList.add("active");
      render();
    });
  });

  render();
  searchInput?.addEventListener("input", render);
});

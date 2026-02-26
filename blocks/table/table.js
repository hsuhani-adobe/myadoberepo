let globalData = [];
let tableElement = null;


// ---------- CREATE TABLE HEADER ----------
function createTableHeader(table) {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <th>S.No</th>
    <th>Country</th>
    <th>Capital</th>
  `;

  thead.appendChild(tr);
  table.appendChild(thead);
}


// ---------- CREATE TABLE BODY ----------
function createTableBody(table, data) {
  const tbody = document.createElement("tbody");

  data.forEach((row, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.Country ?? ''}</td>
      <td>${row.Capital ?? ''}</td>
    `;

    // Add continent class for styling
    if (row.Continent) {
      tr.classList.add(row.Continent.toLowerCase());
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}


// ---------- RENDER TABLE ----------
function renderTable(data) {
  const table = document.createElement("table");
  table.classList.add("countries-table");

  createTableHeader(table);
  createTableBody(table, data);

  return table;
}


// ---------- CREATE DROPDOWN ----------
function createDropdown(continents) {
  const select = document.createElement("select");
  select.classList.add("continent-dropdown");

  // ALL option
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Continents";
  select.appendChild(allOption);

  continents.forEach(continent => {
    const option = document.createElement("option");
    option.value = continent;
    option.textContent =
      continent.charAt(0).toUpperCase() + continent.slice(1);
    select.appendChild(option);
  });

  return select;
}


// ---------- MAIN DECORATE ----------
export default async function decorate(block) {
  const link = block.querySelector("a");
  if (!link) return;

  // Fetch main sheet (data)
  const response = await fetch(link.href);
  const json = await response.json();

  globalData = json.data;

  // Extract unique continents dynamically
  const continents = [
    ...new Set(
      globalData
        .map(item => item.Continent?.toLowerCase())
        .filter(Boolean)
    )
  ];

  const container = document.createElement("div");
  container.classList.add("countries-block");

  // Create dropdown
  const dropdown = createDropdown(continents);
  container.appendChild(dropdown);

  // Default table (All data)
  tableElement = renderTable(globalData);
  container.appendChild(tableElement);

  link.replaceWith(container);

  // Dropdown change event
  dropdown.addEventListener("change", () => {
    const selected = dropdown.value;

    const filtered =
      selected === "all"
        ? globalData
        : globalData.filter(
            item =>
              item.Continent &&
              item.Continent.toLowerCase() === selected
          );

    const newTable = renderTable(filtered);
    tableElement.replaceWith(newTable);
    tableElement = newTable;
  });
}
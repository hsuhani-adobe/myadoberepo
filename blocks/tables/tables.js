// Base JSON URL (will come from block link)
let BASE_URL = "";


// ----------- TABLE HEADER -----------
function createTableHeader(table) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <th>S.No</th>
    <th>Country</th>
    <th>Capital</th>
    
  `;

  table.append(tr);
}


// ----------- TABLE ROW -----------
function createTableRow(table, row, i) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${i}</td>
    <td>${row.Country || ""}</td>
    <td>${row.Capital || ""}</td>
   
  `;

  table.append(tr);
}


async function createTable(sheetName = "All") {

  const url = `${BASE_URL}?sheet=${sheetName}`;

  const resp = await fetch(url);
  const json = await resp.json();

  const table = document.createElement("table");
  table.classList.add("countries-table");
  table.classList.add(`sheet-${sheetName.toLowerCase()}`);

  createTableHeader(table);

  if (json.data && json.data.length) {
    json.data.forEach((row, i) => {
      createTableRow(table, row, i + 1);
    });
  }

  return table;
}


// ----------- CREATE DROPDOWN -----------
function createDropdown() {

  const sheets = ["All", "asia", "australia", "america"];

  const select = document.createElement("select");
  select.classList.add("continent-dropdown");

  sheets.forEach(sheet => {
    const option = document.createElement("option");
    option.value = sheet;
    option.textContent =
      sheet.charAt(0).toUpperCase() + sheet.slice(1);
    select.append(option);
  });

  return select;
}


// ----------- DECORATE FUNCTION -----------
export default async function decorate(block) {

  const countriesLink = block.querySelector('a');
  if (!countriesLink) return;

  BASE_URL = countriesLink.href;

  const parentDiv = document.createElement("div");
  parentDiv.classList.add("countries-block");

  // Create dropdown
  const dropdown = createDropdown();
  parentDiv.append(dropdown);

  // Load default table (All sheet)
  let table = await createTable("All");
  parentDiv.append(table);

  countriesLink.replaceWith(parentDiv);

  // Dropdown change event
  dropdown.addEventListener("change", async () => {

    const selectedSheet = dropdown.value;

    const newTable = await createTable(selectedSheet);

    table.replaceWith(newTable);
    table = newTable;
  });
}
// ----------- TABLE HEADER -----------
function createTableHeader(table) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <th>S.No</th>
    <th>Country</th>
    <th>Capital</th>
    <th>Abbreviation</th>
  `;

  table.append(tr);
}


// ----------- TABLE ROW -----------
function createTableRow(table, row, i) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${i}</td>
    <td>${row.Country}</td>
    <td>${row.Capital}</td>
    <td>${row.Abbreviation}</td>
  `;

  table.append(tr);
}


// ----------- CREATE TABLE -----------
async function createTable(jsonURL) {
  const resp = await fetch(jsonURL);
  const json = await resp.json();

  console.log("JSON DATA =>", json);

  const table = document.createElement("table");
  createTableHeader(table);

  if (json.data && json.data.length) {
    json.data.forEach((row, i) => {
      createTableRow(table, row, i + 1);
    });
  }

  return table;
}


// ----------- DECORATE FUNCTION -----------
export default async function decorate(block) {
  const countriesLink = block.querySelector('a');
  const parentDiv = document.createElement("div");
  parentDiv.classList.add("countries-block");

  if (countriesLink) {
    const table = await createTable(countriesLink.href);
    parentDiv.append(table);
    countriesLink.replaceWith(parentDiv);
  }
}
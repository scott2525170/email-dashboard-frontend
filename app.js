document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("emails", document.getElementById("emails").value);
    formData.append("subject", document.getElementById("subject").value);
    formData.append("message", document.getElementById("message").value);
  
    const file = document.getElementById("image").files[0];
    if (file) formData.append("image", file);
  
 const API_URL = "https://repaying-mangle-childless.ngrok-free.dev";
  
    const res = await fetch(`${API_URL}/api`, {
      method: "POST",
      body: formData
    });
  
    const data = await res.json();
    console.log(data);
  
    showResults(data.results);
  });
  
  function showResults(results) {
    const table = document.getElementById("resultsTable");
  
    results.forEach(r => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${r.email}</td>
        <td>${r.status}</td>
        <td>${r.error || "-"}</td>
      `;
  
      table.appendChild(row);
    });
  }

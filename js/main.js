function populateLatestJobs(jobs){
    const list = document.getElementById("list-latestjobs");
    if(!list) return;
    list.innerHTML = "";
    jobs.forEach(job=>{
        const li = document.createElement("li");
        li.innerHTML = `<a href="details.html?id=${job.id}">${job.master || "Unnamed Job"}</a>`;
        list.appendChild(li);
    });
}

function populateJobsTable(jobs){
    const table = document.getElementById("table-jobsdata");
    if(!table) return;
    table.innerHTML = "";
    jobs.forEach(job=>{
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${job.master || job.title || "Unnamed Job"}</td>
          <td><a href="${job.url || "#"}">Apply</a></td>
          <td><a href="#">Admit</a></td>
          <td><a href="#">Result</a></td>
        `;
        table.appendChild(row);
    });
}

function populateImportantLinks(links){
    const list = document.getElementById("list-importantlinks");
    if(!list) return;
    list.innerHTML = "";
    if(!Array.isArray(links)) return;
    links.forEach(cat=>{
        if(!cat.links) return;
        cat.links.forEach(link=>{
            const li = document.createElement("li");
            li.innerHTML = `<a href="${link.url}" target="_blank">${link.title || link.name}</a>`;
            list.appendChild(li);
        });
    });
}

function populateStaticPortals(portals){
    const container = document.getElementById("grid-staticportals");
    if(!container) return;
    container.innerHTML = "";
    if(!Array.isArray(portals)) return;
    portals.forEach(portal=>{
        const a = document.createElement("a");
        a.href = portal.url;
        a.target="_blank";
        a.textContent = portal.title || portal.name;
        container.appendChild(a);
    });
}

function populateDailyPosts(posts){
    const container = document.getElementById("grid-dailyposts");
    if(!container) return;
    container.innerHTML = "";
    posts.forEach(post=>{
        const div = document.createElement("div");
        div.style.minWidth="250px";
        div.style.background="#fef3c7";
        div.style.padding="10px";
        div.style.border="1px solid #fcd34d";
        div.style.borderRadius="6px";
        div.innerHTML = `<strong>${post.title || "No Title"}</strong><br>${post.date || ""}<br><a href="${post.url || "#"}">Read</a>`;
        container.appendChild(div);
    });
}
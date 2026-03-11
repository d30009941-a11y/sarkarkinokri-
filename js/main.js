/* ===============================
   Robust Main.js for SarkarKinokri
   Handles events, jobsdata, dailyposts dynamically
=============================== */

async function fetchJSON(url, retries = 3) {
    const cacheBuster = "?cb=" + new Date().getTime();
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url + cacheBuster);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            console.log(`Fetched: ${url}`);
            return json;
        } catch (e) {
            console.warn(`Fetch failed (${i + 1}): ${url}`, e);
        }
    }
    console.error(`Failed to fetch after ${retries} retries: ${url}`);
    return null;
}

async function loadPortal() {
    console.log("Portal loading...");

    // 1️⃣ Load index.json
    const manifest = await fetchJSON("./data/index.json");
    if (!manifest) return;

    // 2️⃣ Load events JSONs
    let allEvents = [];
    if (manifest.events && Array.isArray(manifest.events)) {
        for (let path of manifest.events) {
            const file = await fetchJSON("./data/events/" + path);
            if (file?.data) {
                Object.values(file.data).forEach(job => allEvents.push(job));
            }
        }
    }
    console.log("Events fetched:", allEvents.length);

    // Sort by latest updated date
    allEvents.sort((a, b) => {
        const dateA = a.updates?.length ? new Date(a.updates[a.updates.length - 1].date) : new Date(a.opening_date || 0);
        const dateB = b.updates?.length ? new Date(b.updates[b.updates.length - 1].date) : new Date(b.opening_date || 0);
        return dateB - dateA;
    });

    // 3️⃣ Load jobsdata JSONs
    let allJobs = [];
    if (manifest.jobsdata && Array.isArray(manifest.jobsdata)) {
        for (let path of manifest.jobsdata) {
            const file = await fetchJSON("./data/jobsdata/" + path);
            if (file?.data) {
                Object.values(file.data).forEach(job => allJobs.push(job));
            }
        }
    }
    console.log("Jobs fetched:", allJobs.length);

    // 4️⃣ Load dailyposts dynamically
    let allPosts = [];
    if (manifest.dailyposts && Array.isArray(manifest.dailyposts)) {
        for (let path of manifest.dailyposts) {
            const file = await fetchJSON("./data/dailyposts/" + path);
            if (file) allPosts.push(file);
        }
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    console.log("Daily posts fetched:", allPosts.length);

    // 5️⃣ Load important links & static portals
    const links = await fetchJSON("./data/" + manifest.importantlinks);
    const portals = await fetchJSON("./data/" + manifest.staticportals);

    // 6️⃣ Populate UI
    populateLatestJobs(allEvents);
    populateJobsTable(allJobs);
    populateDailyPosts(allPosts);
    populateImportantLinks(links);
    populateStaticPortals(portals);

    console.log("Portal fully loaded.");
}

document.addEventListener("DOMContentLoaded", loadPortal);

/* ===============================
   UI Rendering Functions
=============================== */

function populateLatestJobs(jobs) {
    const list = document.getElementById("latestjobs");
    if (!list) return;
    list.innerHTML = "";
    jobs.forEach(job => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${job.url || "#"}">${job.master || job.title || "Unnamed Job"}</a>`;
        list.appendChild(li);
    });
}

function populateJobsTable(jobs) {
    const tbody = document.querySelector("#jobsdata tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    jobs.forEach(job => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${job.master || job.title || "Unnamed Job"}</td>
            <td><a href="${job.url || "#"}">Apply</a></td>
            <td><a href="${job.admit_card_url || "#"}">Admit</a></td>
            <td><a href="${job.result_url || "#"}">Result</a></td>
        `;
        tbody.appendChild(row);
    });
}

function populateDailyPosts(posts) {
    const container = document.getElementById("dailyposts");
    if (!container) return;
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.overflowX = "auto";
    container.style.gap = "10px";

    posts.forEach(post => {
        const div = document.createElement("div");
        div.style.minWidth = "250px";
        div.style.background = "#fef3c7";
        div.style.padding = "10px";
        div.style.border = "1px solid #fcd34d";
        div.style.borderRadius = "6px";
        div.innerHTML = `<strong>${post.title || "No Title"}</strong><br>${post.date || ""}<br><a href="${post.url || "#"}">Read</a>`;
        container.appendChild(div);
    });
}

function populateImportantLinks(links) {
    const list = document.getElementById("importantlinks");
    if (!list || !Array.isArray(links)) return;
    list.innerHTML = "";
    links.forEach(cat => {
        if (!cat.links) return;
        cat.links.forEach(link => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${link.url}">${link.title || link.name}</a>`;
            list.appendChild(li);
        });
    });
}

function populateStaticPortals(portals) {
    const list = document.getElementById("staticportals");
    if (!list || !Array.isArray(portals)) return;
    list.innerHTML = "";
    portals.forEach(portal => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${portal.url}">${portal.title || portal.name}</a>`;
        list.appendChild(li);
    });
}
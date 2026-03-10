// =======================
// HOMEPAGE LOGIC
// =======================

function heroSearch(){
    let value = document.getElementById("searchInput").value.toLowerCase();
    location.href = "#board";
}

async function loadPortal(){
    try {
        const [eventsData, portals, important] = await Promise.all([
            fetch('data/events.json').then(r=>r.json()), 
            fetch('data/staticportals.json').then(r=>r.json()),
            fetch('data/importantlinks.json').then(r=>r.json())
        ]);

        // Populate recruitment portals & all-portal grid
        portals.forEach(p=>{
            const target = document.getElementById("list-" + p.category);
            if(target) target.innerHTML += `<a href="${p.url}" target="_blank">${p.icon} ${p.name}</a>`;

            let colors = ["#fef2f2", "#fff7ed", "#fffbeb", "#ecfdf5", "#eff6ff", "#f5f3ff", "#fdf2f8"];
            document.getElementById("all-portal-grid").innerHTML +=
                `<a href="${p.url}" class="portal-item2" target="_blank" style="background:${colors[Math.floor(Math.random()*colors.length)]}">
                    <span>${p.icon}</span>${p.name}
                </a>`;
        });

        // =================
        // BOARD ROUTING LOGIC
        // =================
        const dvSynonyms = ["document verification", "dv", "document scrutiny", "counselling", "verification"];
        const admitSynonyms = ["admit card", "hall ticket", "admission slip", "e-admit", "call letter", "city intimation", "city slip"];
        const resultSynonyms = ["result", "merit list", "scorecard", "marksheet", "final selection", "merit"];

        eventsData.data.forEach(item => {
            let type = (item.type || "").toLowerCase();
            let linkText = (item.master || item.title || "UPDATE AVAILABLE").replace(/-/g, ' ').toUpperCase();
            let linkHTML = `<li><a href="details.html?id=${item.id}">${linkText}</a></li>`;

            // Latest Jobs
            if (type.includes("recruit") || type.includes("job") || type.includes("notif") || type.includes("apply")) {
                if (["Active","Ongoing","Scheduled"].includes(item.status)) {
                    document.getElementById("list-jobs").innerHTML += linkHTML;
                }
            }

            // Routing to specific boards
            else if(admitSynonyms.some(syn => type.includes(syn))) {
                document.getElementById("list-admit").innerHTML += linkHTML;
            } else if(resultSynonyms.some(syn => type.includes(syn))) {
                document.getElementById("list-result").innerHTML += linkHTML;
            } else if(type.includes("answer") || type.includes("response") || type.includes("key")) {
                document.getElementById("list-answer").innerHTML += linkHTML;
            } else if(dvSynonyms.some(syn => type.includes(syn))) {
                document.getElementById("list-dv").innerHTML += linkHTML;
            } else if(type.includes("interview") || type.includes("skill") || type.includes("physical") || type.includes("medical") || type.includes("pet") || type.includes("pst")) {
                document.getElementById("list-interview").innerHTML += linkHTML;
            }
        });

        // =================
        // RESOURCES GRID
        // =================
        important.forEach(cat=>{
            let colors = ["#d32f2f","#1976d2","#f57c00","#388e3c","#7b1fa2","#0097a7"];
            let random = colors[Math.floor(Math.random()*colors.length)];
            let box = `<div class="resource-box"><h4 style="background:${random}">${cat.category}</h4>`;
            cat.links.forEach(link => { box += `<a href="${link.url}" target="_blank">${link.title}</a>`; });
            box += `</div>`;
            document.getElementById("resource-grid").innerHTML += box;
        });

    } catch (e) { console.error("Data Load Error:", e); }
}

// Call homepage load
loadPortal();

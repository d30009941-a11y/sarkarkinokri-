async function loadPortal() {
    try {
        // Step 1: Fetch the manifest
        const indexRes = await fetch('data/index.json');
        if (!indexRes.ok) throw new Error("Failed to fetch index.json");
        const indexData = await indexRes.json();

        console.log("Index fetched:", indexData);

        // Step 2: Fetch actual events
        const eventPromises = indexData.events.map(path => fetch(path).then(r => r.json()));
        const jobPromises = indexData.jobsdata.map(path => fetch(path).then(r => r.json()));

        const [eventsArray, jobsArray, important, portals] = await Promise.all([
            Promise.all(eventPromises),
            Promise.all(jobPromises),
            fetch(indexData.importantlinks).then(r => r.json()),
            fetch(indexData.staticportals).then(r => r.json())
        ]);

        console.log("Events fetched:", eventsArray.length);
        console.log("Jobs fetched:", jobsArray.length);

        // Flatten events data if needed
        const eventsData = eventsArray.flatMap(e => e.data || []);
        const jobsData = jobsArray.flatMap(j => Object.values(j) || []);

        // ======= Your previous population logic =======
        // Use eventsData, jobsData, important, portals as before
        // Example:
        eventsData.forEach(item => {
            let type = (item.type || "").toLowerCase();
            let linkText = (item.master || item.title || "UPDATE AVAILABLE").replace(/-/g, ' ').toUpperCase();
            let linkHTML = `<li><a href="details.html?id=${item.id}">${linkText}</a></li>`;
            if(type.includes("job")) document.getElementById("list-jobs").innerHTML += linkHTML;
            // ... continue board routing logic
        });

    } catch (e) {
        console.error("Error loading portal:", e);
    }
}

loadPortal();
async function loadPortal() {
    try {
        // 1. Fetch the main manifest first
        const manifestResponse = await fetch('data/index.json');
        const manifest = await manifestResponse.json();

        // 2. Now fetch the actual content using paths from the manifest
        // Let's grab the first event file and the static files as an example
        const results = await Promise.allSettled([
            fetch(manifest.events[0]).then(r => r.json()), // Fetches Mslug_1.json
            fetch(manifest.staticportals).then(r => r.json()),
            fetch(manifest.importantlinks).then(r => r.json())
        ]);

        const eventData = results[0].status === "fulfilled" ? results[0].value : null;
        const portals = results[1].status === "fulfilled" ? results[1].value : [];
        const links = results[2].status === "fulfilled" ? results[2].value : [];

        console.log("Actual Event Content:", eventData);
        
        // 3. Populate your UI here...

    } catch (e) {
        console.error("Failed to load portal:", e);
    }
}

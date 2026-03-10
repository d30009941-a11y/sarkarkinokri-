async function loadPortal() {
    try {
        // 1. Fetch the manifest (Relative to index.html)
        const response = await fetch('data/index.json');
        if (!response.ok) throw new Error("Could not find index.json");
        const manifest = await response.json();

        // 2. Map the manifest paths to include the "data/" prefix 
        // because the browser is looking from the root index.html
        const eventPaths = manifest.events.map(path => `data/${path}`);
        
        // 3. Fetch all event files simultaneously
        const eventResults = await Promise.allSettled(
            eventPaths.map(url => fetch(url).then(res => res.json()))
        );

        // 4. Combine all successful event data into one array
        const allEvents = eventResults
            .filter(res => res.status === "fulfilled")
            .map(res => res.value);

        console.log("Successfully loaded events:", allEvents);

        // Now you can populate your UI using allEvents
        // Example: populateTable(allEvents);

    } catch (e) {
        console.error("Portal Loading Error:", e);
    }
}

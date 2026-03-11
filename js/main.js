async function loadPortal(){

try{

console.log("Portal loading...");

const manifest = await fetch("./data/index.json").then(r=>r.json());

/* -------- EVENTS -------- */

let jobs=[];

if(manifest.events){

const eventPaths = manifest.events.map(p=>"./data/"+p);

const eventFiles = await Promise.allSettled(
eventPaths.map(p=>fetch(p).then(r=>r.json()))
);

eventFiles.forEach(res=>{

if(res.status==="fulfilled"){

const file=res.value;

if(file.data){

Object.values(file.data).forEach(job=>{
jobs.push(normalizeJob(job));
});

}

}

});

}


/* -------- JOBS TABLE -------- */

let tableJobs=[];

if(manifest.jobsdata){

const jobPaths = manifest.jobsdata.map(p=>"./data/"+p);

const jobFiles = await Promise.allSettled(
jobPaths.map(p=>fetch(p).then(r=>r.json()))
);

jobFiles.forEach(res=>{

if(res.status==="fulfilled"){

const file=res.value;

if(Array.isArray(file.jobs)){
tableJobs.push(...file.jobs.map(normalizeTableJob));
}

if(Array.isArray(file)){
tableJobs.push(...file.map(normalizeTableJob));
}

}

});

}


/* -------- IMPORTANT LINKS -------- */

let links=[];

if(manifest.importantlinks){

try{

const raw = await fetch("./data/"+manifest.importantlinks).then(r=>r.json());

links = Array.isArray(raw) ? raw : Object.values(raw);

}catch(e){console.warn("importantlinks load failed")}

}


/* -------- STATIC PORTALS -------- */

let portals=[];

if(manifest.staticportals){

try{

const raw = await fetch("./data/"+manifest.staticportals).then(r=>r.json());

portals = Array.isArray(raw) ? raw : Object.values(raw);

}catch(e){console.warn("static portals load failed")}

}


/* -------- RENDER -------- */

populateLatestJobs(jobs);

populateJobsTable(tableJobs);

populateImportantLinks(links);

populateStaticPortals(portals);

console.log("Portal loaded successfully");

}catch(e){

console.error("Portal error:",e);

}

}

document.addEventListener("DOMContentLoaded",loadPortal);


/* ---------- NORMALIZERS ---------- */

function normalizeJob(job){

return{

id: job.id || job.slug || Math.random(),

title: job.master || job.title || job.name || "Job Update",

url: job.url || "#",

opening_date: job.opening_date || "",

closing_date: job.closing_date || ""

};

}

function normalizeTableJob(job){

return{

title: job.title || job.master || job.name || "Job",

apply: job.apply || job.apply_url || "#",

admit: job.admit || job.admit_url || "#",

result: job.result || job.result_url || "#"

};

}


/* ---------- UI ---------- */

function populateLatestJobs(jobs){

const list=document.getElementById("latestjobs");

if(!list) return;

list.innerHTML="";

jobs.slice(0,25).forEach(job=>{

const li=document.createElement("li");

li.innerHTML=`<a href="details.html?id=${job.id}">${job.title}</a>`;

list.appendChild(li);

});

}



function populateJobsTable(jobs){

const table=document.getElementById("jobsdata");

if(!table) return;

table.innerHTML="";

jobs.slice(0,50).forEach(job=>{

const row=document.createElement("tr");

row.innerHTML=`
<td>${job.title}</td>
<td><a href="${job.apply}">Apply</a></td>
<td><a href="${job.admit}">Admit</a></td>
<td><a href="${job.result}">Result</a></td>
`;

table.appendChild(row);

});

}



function populateImportantLinks(links){

const list=document.getElementById("importantlinks");

if(!list) return;

list.innerHTML="";

links.forEach(link=>{

const title = link.title || link.name || "Portal";

const li=document.createElement("li");

li.innerHTML=`<a href="${link.url || "#"}">${title}</a>`;

list.appendChild(li);

});

}



function populateStaticPortals(portals){

const list=document.getElementById("staticportals");

if(!list) return;

list.innerHTML="";

portals.forEach(portal=>{

const title = portal.title || portal.name || "Portal";

const li=document.createElement("li");

li.innerHTML=`<a href="${portal.url || "#"}">${title}</a>`;

list.appendChild(li);

});

}

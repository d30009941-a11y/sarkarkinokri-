async function loadPortal(){

try{

const manifestResponse = await fetch('data/index.json');
const manifest = await manifestResponse.json();



/* EVENTS */

const eventPaths = manifest.events.map(p => `data/${p}`);

const eventFiles = await Promise.allSettled(
eventPaths.map(url => fetch(url).then(r => r.json()))
);

const events = eventFiles
.filter(r => r.status==="fulfilled")
.flatMap(r => r.value);



/* JOB DATA */

const jobPaths = manifest.jobsdata.map(p => `data/${p}`);

const jobFiles = await Promise.allSettled(
jobPaths.map(url => fetch(url).then(r => r.json()))
);

const jobs = jobFiles
.filter(r => r.status==="fulfilled")
.flatMap(r => r.value);



/* IMPORTANT LINKS */

const linkResponse = await fetch(`data/${manifest.importantlinks}`);
const importantLinks = await linkResponse.json();



/* DAILY POSTS */

const dailyFiles = await fetchDailyPosts();



/* POPULATE UI */

populateJobs(jobs);

populateEvents(events);

populateLinks(importantLinks);

populateDaily(dailyFiles);



}catch(e){

console.error("Portal Error",e);

}

}



/* DAILY POST LOADER */

async function fetchDailyPosts(){

try{

const folder = "data/dailypost/";

const today = new Date();

const dd = String(today.getDate()).padStart(2,'0');
const mm = String(today.getMonth()+1).padStart(2,'0');
const yyyy = today.getFullYear();

const file = `${folder}${dd}-${mm}-${yyyy}-post.json`;

const res = await fetch(file);

if(!res.ok) return [];

return await res.json();

}catch{

return [];

}

}



/* UI FUNCTIONS */


function populateJobs(jobs){

const ul = document.getElementById("list-jobs");

jobs.slice(0,20).forEach(job=>{

const li = document.createElement("li");

li.innerHTML = `<a href="${job.url}" target="_blank">${job.title}</a>`;

ul.appendChild(li);

});

}



function populateEvents(events){

events.forEach(e=>{

if(e.type==="Admit Card") addItem("list-admit",e);
if(e.type==="Answer Key") addItem("list-answer",e);
if(e.type==="Result") addItem("list-result",e);
if(e.type==="Interview") addItem("list-interview",e);
if(e.type==="Document Verification") addItem("list-dv",e);

});

}



function populateLinks(data){

const grid = document.getElementById("resource-grid");

data.forEach(cat=>{

const div = document.createElement("div");

div.innerHTML=`<h3>${cat.category}</h3>`;

cat.links.forEach(l=>{

const a=document.createElement("a");

a.href=l.url;

a.textContent=l.title;

a.target="_blank";

div.appendChild(a);

});

grid.appendChild(div);

});

}



function populateDaily(posts){

const ul=document.getElementById("list-daily");

posts.forEach(p=>{

const li=document.createElement("li");

li.innerHTML=`<a href="${p.url}" target="_blank">${p.title}</a>`;

ul.appendChild(li);

});

}



function addItem(id,data){

const ul=document.getElementById(id);

const li=document.createElement("li");

li.innerHTML=`<a href="${data.url}" target="_blank">${data.title}</a>`;

ul.appendChild(li);

}



document.addEventListener("DOMContentLoaded",loadPortal);
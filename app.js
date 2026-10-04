const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
if(localStorage.getItem("autoverseLoggedIn")!=="true") location.href="login.html";

let vehicles=JSON.parse(localStorage.getItem("avVehicles")||"null")||[
{name:"Toyota Corolla",category:"Sedan",price:18500,status:"Available",info:"2024 • Automatic • Petrol • 12,000 km",image:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300"},
{name:"BMW X5",category:"SUV",price:52000,status:"Available",info:"2024 • Automatic • AWD • 8,000 km",image:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300"},
{name:"Ford Mustang",category:"Sports",price:45000,status:"Available",info:"2023 • Automatic • V8 • 15,000 km",image:"https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=300"},
{name:"Ford F-150",category:"Truck",price:38000,status:"Available",info:"2024 • Automatic • 4x4 • 10,000 km",image:"https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?w=300"},
{name:"Honda Civic",category:"Sedan",price:22000,status:"Sold",info:"2023 • Automatic • Petrol • 18,000 km",image:"https://images.unsplash.com/photo-1590362891991-f776e747a588?w=300"}
];
const users=[["Rahul Sharma","rahul@example.com","+91 98765 43210",3,"Active"],["Sneha Patel","sneha@example.com","+91 98765 12345",2,"Active"],["Amit Verma","amit@example.com","+91 98220 11122",1,"Active"],["Pooja Singh","pooja@example.com","+91 97654 98765",4,"Blocked"]];
const bookings=[["Rahul Sharma","BMW X5","Apr 28, 2025","$52,000","Confirmed"],["Sneha Patel","Toyota Corolla","Apr 27, 2025","$18,500","Pending"],["Amit Verma","Ford Mustang","Apr 26, 2025","$45,000","Confirmed"],["Pooja Singh","Honda Civic","Apr 25, 2025","$22,000","Cancelled"]];
const messages=[["Raj Mehta","Need details about BMW X5.","2 min ago"],["Neha Sharma","Is Toyota Corolla available next week?","18 min ago"],["Arjun Singh","I want to book Ford Mustang.","1 hour ago"],["Karan Patel","Please send vehicle finance details.","3 hours ago"],["Priya Joshi","Can I change my booking date?","Yesterday"],["Vikas Rao","Interested in your SUV collection.","Yesterday"]];

function money(n){return "$"+Number(n).toLocaleString();}
function save(){localStorage.setItem("avVehicles",JSON.stringify(vehicles));}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function showSection(id){$$(".section").forEach(s=>s.classList.remove("active"));$("#"+id).classList.add("active");$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.section===id));window.scrollTo(0,0)}
$$("[data-section]").forEach(b=>b.onclick=()=>showSection(b.dataset.section));
$$("[data-go]").forEach(b=>b.onclick=()=>showSection(b.dataset.go));
$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#logoutBtn").onclick=()=>{localStorage.removeItem("autoverseLoggedIn");location.href="login.html"};

$("#todayDate").textContent=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
document.querySelectorAll("#bars").forEach(el=>[35,55,75,70,105,90,125,110,120,135,155,180].forEach(v=>{const i=document.createElement("i");i.style.height=v+"px";el.appendChild(i)}));

function renderRecent(){let html=vehicles.slice(0,5).map(v=>`<div class="recent-row"><img class="vehicle-thumb" src="${v.image}" onerror="this.src='https://via.placeholder.com/100x60?text=Car'"><span style="min-width:130px">${v.name}</span><span>${v.category}</span><b>${money(v.price)}</b><span class="status ${v.status==="Available"?"available":"sold"}">${v.status}</span><span class="actions"><button onclick="viewVehicle('${v.name}')">👁</button><button onclick="editVehicle('${v.name}')">✎</button><button onclick="deleteVehicle('${v.name}')">🗑</button></span></div>`).join("");$("#recentVehicles").innerHTML=html}
function renderVehicles(){let q=($("#vehicleSearch")?.value||"").toLowerCase(), f=$("#statusFilter")?.value||"All Status";let list=vehicles.filter(v=>(v.name+v.category+v.info).toLowerCase().includes(q)&&(f==="All Status"||v.status===f));$("#vehicleTable").innerHTML=list.map(v=>`<tr><td><img class="vehicle-thumb" src="${v.image}" onerror="this.src='https://via.placeholder.com/100x60?text=Car'"></td><td><b>${v.name}</b></td><td>${v.category}</td><td>${money(v.price)}</td><td>${v.info}</td><td><span class="status ${v.status==="Available"?"available":"sold"}">${v.status}</span></td><td class="actions"><button onclick="viewVehicle('${v.name}')">👁</button><button onclick="editVehicle('${v.name}')">✎</button><button onclick="deleteVehicle('${v.name}')">🗑</button></td></tr>`).join("")||`<tr><td colspan="7">No vehicles found.</td></tr>`;$("#vehicleCount").textContent=vehicles.length+19}
function viewVehicle(name){const v=vehicles.find(x=>x.name===name);toast(`${v.name}: ${v.info} | ${money(v.price)}`)}
function editVehicle(name){const v=vehicles.find(x=>x.name===name);showSection("addVehicle");$("#vName").value=v.name;$("#vCategory").value=v.category;$("#vPrice").value=v.price;$("#vStatus").value=v.status;$("#vInfo").value=v.info;$("#vImage").value=v.image;$("#vehicleForm").dataset.edit=name}
function deleteVehicle(name){if(confirm("Delete "+name+"?")){vehicles=vehicles.filter(v=>v.name!==name);save();renderVehicles();renderRecent();toast("Vehicle deleted")}}
$("#vehicleForm").onsubmit=e=>{e.preventDefault();let old=e.target.dataset.edit;let obj={name:$("#vName").value.trim(),category:$("#vCategory").value,price:Number($("#vPrice").value),status:$("#vStatus").value,info:$("#vInfo").value.trim(),image:$("#vImage").value.trim()||"https://via.placeholder.com/300x180?text=Vehicle"};if(old){vehicles=vehicles.map(v=>v.name===old?obj:v);delete e.target.dataset.edit;toast("Vehicle updated")}else{vehicles.unshift(obj);toast("Vehicle added successfully")}save();renderVehicles();renderRecent();e.target.reset();showSection("vehicles")};
$("#vehicleSearch").oninput=renderVehicles;$("#statusFilter").onchange=renderVehicles;

const cats=[["🚘","Sedan",10],["🚙","SUV",7],["🏎️","Sports",4],["🛻","Truck",2],["🚗","Other",1]];
$("#categoryGrid").innerHTML=cats.map(c=>`<div class="category-card"><span>${c[0]}</span><b>${c[1]}</b><small>${c[2]} Vehicles</small></div>`).join("");
$("#userTable").innerHTML=users.map(u=>`<tr><td><b>${u[0]}</b></td><td>${u[1]}</td><td>${u[2]}</td><td>${u[3]}</td><td><span class="status ${u[4]==="Active"?"available":"sold"}">${u[4]}</span></td><td class="actions"><button onclick="toast('Viewing ${u[0]}')">👁</button><button onclick="toast('User settings opened')">⚙</button></td></tr>`).join("");
$("#bookingTable").innerHTML=bookings.map(b=>`<tr><td><b>${b[0]}</b></td><td>${b[1]}</td><td>${b[2]}</td><td>${b[3]}</td><td><span class="status ${b[4].toLowerCase()}">${b[4]}</span></td><td><button class="secondary-btn" onclick="toast('Booking action opened')">Manage</button></td></tr>`).join("");
$("#latestBookings").innerHTML=bookings.map(b=>`<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #eee;font-size:12px"><span><b>${b[0]}</b><br>${b[1]}</span><span>${b[2]}<br><span class="status ${b[4].toLowerCase()}">${b[4]}</span></span></div>`).join("");
$("#messageGrid").innerHTML=messages.map(m=>`<div class="message-card"><h3>✉ ${m[0]}</h3><small>${m[2]}</small><p>${m[1]}</p><button class="secondary-btn" onclick="toast('Reply window opened for ${m[0]}')">Reply</button></div>`).join("");
$$(".save-setting").forEach(b=>b.onclick=()=>toast("Settings saved successfully"));
$("#addUserBtn").onclick=()=>toast("Demo: Add User form opened");

$("#globalSearch").oninput=e=>{let q=e.target.value.trim();if(q){showSection("vehicles");$("#vehicleSearch").value=q;renderVehicles()}};
renderVehicles();renderRecent();

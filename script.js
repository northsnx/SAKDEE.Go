console.log("JS Loaded ✅");

const svg = document.getElementById("mapSVG");
let viewBox = [14.6917, 11.9813, 262.4405, 482.3263]; // [x, y, width, height]
let isPanning = false;
let startPoint = [0, 0];

function updateViewBox() {
    svg.setAttribute("viewBox", viewBox.join(" "));
}

function zoomMap(factor) {
    const [x, y, width, height] = viewBox;
    const newWidth = width / factor;
    const newHeight = height / factor;
    const newX = x + (width - newWidth) / 2;
    const newY = y + (height - newHeight) / 2;

    viewBox = [newX, newY, newWidth, newHeight];
    updateViewBox();
}

function resetZoom() {
    viewBox = [14.6917, 11.9813, 262.4405, 482.3263];
    updateViewBox();
}

// 🖱 Scroll zoom
svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;

    const [x, y, width, height] = viewBox;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const svgX = x + (mouseX / rect.width) * width;
    const svgY = y + (mouseY / rect.height) * height;

    const newWidth = width * zoomFactor;
    const newHeight = height * zoomFactor;
    const newX = svgX - (mouseX / rect.width) * newWidth;
    const newY = svgY - (mouseY / rect.height) * newHeight;

    viewBox = [newX, newY, newWidth, newHeight];
    updateViewBox();
});

// 🖱 Drag
svg.addEventListener("mousedown", (e) => {
    isPanning = true;
    startPoint = [e.clientX, e.clientY];
});

svg.addEventListener("mousemove", (e) => {
    if (!isPanning) return;
    const dx = (e.clientX - startPoint[0]) * viewBox[2] / svg.clientWidth;
    const dy = (e.clientY - startPoint[1]) * viewBox[3] / svg.clientHeight;

    viewBox[0] -= dx;
    viewBox[1] -= dy;
    startPoint = [e.clientX, e.clientY];
    updateViewBox();
});

svg.addEventListener("mouseup", () => { isPanning = false; });
svg.addEventListener("mouseleave", () => { isPanning = false; });

// 📤 Share
const shareButton = document.getElementById("shareButton");
shareButton.addEventListener("click", async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'SAKDEE Go+',
                text: 'มาดูกันว่าคุณเคยไปจังหวัดไหนบ้าง!',
                url: window.location.href
            });
        } catch (err) {
            alert("ยกเลิกการแชร์");
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("เบราว์เซอร์ไม่รองรับการแชร์\nลิงก์ถูกคัดลอกแล้ว: " + window.location.href);
        } catch (err) {
            alert("ไม่สามารถคัดลอกลิงก์ได้");
        }
    }
});

// 🗺️ จังหวัด
const provinceNames = {
    "TH10": "กรุงเทพมหานคร", "TH11": "สมุทรปราการ", "TH12": "นนทบุรี",
    "TH13": "ปทุมธานี", "TH14": "พระนครศรีอยุธยา", "TH15": "อ่างทอง",
    "TH16": "ลพบุรี", "TH17": "สิงห์บุรี", "TH18": "ชัยนาท", "TH19": "สระบุรี",
    "TH20": "ชลบุรี", "TH21": "ระยอง", "TH22": "จันทบุรี", "TH23": "ตราด",
    "TH24": "ฉะเชิงเทรา", "TH25": "ปราจีนบุรี", "TH26": "นครนายก", "TH27": "สระแก้ว",
    "TH30": "นครราชสีมา", "TH31": "บุรีรัมย์", "TH32": "สุรินทร์", "TH33": "ศรีสะเกษ",
    "TH34": "อุบลราชธานี", "TH35": "ยโสธร", "TH36": "ชัยภูมิ", "TH37": "อำนาจเจริญ",
    "TH38": "บึงกาฬ", "TH39": "หนองบัวลำภู", "TH40": "ขอนแก่น", "TH41": "อุดรธานี",
    "TH42": "เลย", "TH43": "หนองคาย", "TH44": "มหาสารคาม", "TH45": "ร้อยเอ็ด",
    "TH46": "กาฬสินธุ์", "TH47": "สกลนคร", "TH48": "นครพนม", "TH49": "มุกดาหาร",
    "TH50": "เชียงใหม่", "TH51": "ลำพูน", "TH52": "ลำปาง", "TH53": "อุตรดิตถ์",
    "TH54": "แพร่", "TH55": "น่าน", "TH56": "พะเยา", "TH57": "เชียงราย",
    "TH58": "แม่ฮ่องสอน", "TH60": "นครสวรรค์", "TH61": "อุทัยธานี", "TH62": "กำแพงเพชร",
    "TH63": "ตาก", "TH64": "สุโขทัย", "TH65": "พิษณุโลก", "TH66": "พิจิตร",
    "TH67": "เพชรบูรณ์", "TH70": "ราชบุรี", "TH71": "กาญจนบุรี", "TH72": "สุพรรณบุรี",
    "TH73": "นครปฐม", "TH74": "สมุทรสาคร", "TH75": "สมุทรสงคราม", "TH76": "เพชรบุรี",
    "TH77": "ประจวบคีรีขันธ์", "TH80": "นครศรีธรรมราช", "TH81": "กระบี่",
    "TH82": "พังงา", "TH83": "ภูเก็ต", "TH84": "สุราษฎร์ธานี", "TH85": "ระนอง",
    "TH86": "ชุมพร", "TH90": "สงขลา", "TH91": "สตูล", "TH92": "ตรัง",
    "TH93": "พัทลุง", "TH94": "ปัตตานี", "TH95": "ยะลา", "TH96": "นราธิวาส"
};

const provinceSelect = document.getElementById("provinceSelect");
const tooltip = document.getElementById("tooltip");
const visitedList = document.getElementById("visitedProvincesList");

let visitedProvinces = JSON.parse(localStorage.getItem("visitedProvinces") || "[]");

function updateDropdown() {
    provinceSelect.innerHTML = `<option value="">-- เลือกจังหวัด --</option>`;
    for (const [id, name] of Object.entries(provinceNames)) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name + (visitedProvinces.includes(id) ? " ✅" : "");
        provinceSelect.appendChild(option);
    }
}

function renderVisitedProvinces() {
    visitedList.innerHTML = "";
    if (visitedProvinces.length === 0) {
        visitedList.innerHTML = "<li>ยังไม่มีจังหวัดที่เลือก</li>";
        return;
    }

    visitedProvinces.forEach(id => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "4px 8px";
        li.style.borderBottom = "1px solid #ddd";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = provinceNames[id] || id;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.title = "ลบจังหวัดนี้";
        removeBtn.style.background = "none";
        removeBtn.style.border = "none";
        removeBtn.style.color = "#cc0000";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.fontSize = "16px";
        removeBtn.style.transition = "color 0.2s";

        removeBtn.addEventListener("click", () => {
            toggleProvince(id);
        });

        li.appendChild(nameSpan);
        li.appendChild(removeBtn);
        visitedList.appendChild(li);
        updateVisitedCount(); // เพิ่มบรรทัดนี้
    });
}

function updateVisitedCount() {
    const count = visitedProvinces.length;
    const countText = `คุณเคยไปแล้ว ${count} จังหวัด`;
    document.getElementById("visitedCount").textContent = countText;
}

function toggleProvince(id) {
    const path = document.getElementById(id);
    if (!path) return;

    if (visitedProvinces.includes(id)) {
        visitedProvinces = visitedProvinces.filter(pid => pid !== id);
        path.classList.remove("visited");
    } else {
        visitedProvinces.push(id);
        path.classList.add("visited");
    }

    localStorage.setItem("visitedProvinces", JSON.stringify(visitedProvinces));
    updateDropdown();
    renderVisitedProvinces();
}

updateDropdown();
renderVisitedProvinces();

provinceSelect.addEventListener("change", () => {
    const selectedId = provinceSelect.value;
    if (selectedId) toggleProvince(selectedId);
});

document.querySelectorAll("svg path").forEach(path => {
    const id = path.id;
    if (visitedProvinces.includes(id)) {
        path.classList.add("visited");
    }

    path.addEventListener("click", () => toggleProvince(id));
    path.addEventListener("mousemove", (e) => {
        tooltip.style.display = "block";
        tooltip.style.left = (e.pageX + 10) + "px";
        tooltip.style.top = (e.pageY + 10) + "px";
        tooltip.textContent = provinceNames[id];
    });
    path.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });
});

document.getElementById("clearButton").addEventListener("click", () => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด?")) {
        visitedProvinces = [];
        localStorage.removeItem("visitedProvinces");

        document.querySelectorAll("svg path.visited").forEach(path => {
            path.classList.remove("visited");
        });

        updateDropdown();
        renderVisitedProvinces();
        updateVisitedCount();
    }
});


function getCleanSVGBlob(svgElement) {
    const clone = svgElement.cloneNode(true);

    // ใส่ inline style ให้ path ที่มี class
    clone.querySelectorAll("path").forEach(path => {
        if (path.classList.contains("visited")) {
            path.setAttribute("fill", "#459bec"); // สีเขียว
            path.setAttribute("stroke", "#ffffff");
        } else {
            path.setAttribute("fill", "#ccc"); // สีปกติ
            path.setAttribute("stroke", "#999");
        }
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    return new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
}



document.getElementById("exportCustomImage").addEventListener("click", () => {
    const canvas = document.getElementById("customCanvas");
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const padding = 20;
    const columnGap = 30;
    const leftWidth = 450;
    const rightWidth = width - leftWidth - columnGap - padding * 1;

    const svgElement = document.getElementById("mapSVG");
    const visitedItems = document.querySelectorAll("#visitedProvincesList li");
    const countText = document.getElementById("visitedCount").textContent;



    document.fonts.ready.then(() => {
        // 1. เคลียร์พื้นหลัง
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // 2. หัวข้อ
        ctx.fillStyle = "#459bec";
        ctx.font = "bold 60px 'IBM Plex Sans Thai'";
        ctx.fillText("SAKDEE Go+", padding + 20, 100);

        ctx.fillStyle = "#000000FF";
        ctx.font = "32px 'IBM Plex Sans Thai'";
        ctx.fillText("คุณเคยไปจังหวัดไหนมาแล้วบ้าง", padding + 20, 150);

        // 3. จำนวนจังหวัด
        ctx.fillStyle = "#444";
        ctx.font = "20px 'IBM Plex Sans Thai'";
        ctx.fillText(countText, padding + 40, 190);

        // 4. รายชื่อจังหวัด
        ctx.fillStyle = "#AFAFAFFF";
        ctx.font = "18px 'IBM Plex Sans Thai'";

// รวมชื่อทั้งหมดเป็นข้อความเดียว
const names = Array.from(visitedItems).map(li =>
  li.textContent.replace(/❌/g, '').trim()
);
const allText = names.join(", ");

// ตัดข้อความออกเป็นบรรทัดละ ~50 ตัวอักษร (หรือมากกว่านั้นก็ได้)
const lines = allText.match(/.{1,50}(,|$)/g); // ตัดบรรทัดแบบง่าย ๆ

// วาดทีละบรรทัด
lines.forEach((line, i) => {
  ctx.fillText(line.trim(), padding + 40, 220 + i * 30);
});

        // 5. วาด SVG แผนที่ (ด้านขวา)
        const svgElement = document.getElementById("mapSVG");
        const svgBlob = getCleanSVGBlob(svgElement);
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();


         
        img.onload = () => {
            ctx.drawImage(
              img,
              leftWidth + columnGap,
              padding,
              rightWidth,
              height - padding * 4.5
            );
          
            URL.revokeObjectURL(url);
          
            const logo = new Image();
            logo.onload = () => {
              // ✅ วาดโลโก้เมื่อโหลดเสร็จ
              ctx.drawImage(logo, 0, 1000-95);  // ← ปรับตำแหน่งตามต้องการ
          
              // ✅ ค่อย export หลังวาดโลโก้
              const link = document.createElement("a");
              link.download = "sakdee-visited-map.png";
              link.href = canvas.toDataURL("image/png");
              link.click();
            };
            logo.src = "./scr/img/Frame1.png"; // ตรวจ path ให้ชัวร์
          };
        img.src = url;
    });
});

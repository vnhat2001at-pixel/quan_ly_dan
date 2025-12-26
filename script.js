// Tự động tải danh sách khi mở trang index.html
document.addEventListener("DOMContentLoaded", renderAllMissiles);

function addItem(sectionId) {
    let missileName = prompt("Nhập số hiệu quả đạn:");
    if (!missileName || missileName.trim() === "") return;
    missileName = missileName.trim();

    // Kiểm tra trùng lặp toàn hệ thống
    const allData = JSON.parse(localStorage.getItem('missile_list')) || {};
    for (let s in allData) {
        if (allData[s].includes(missileName)) {
            alert(`Lỗi: Số hiệu "${missileName}" đã tồn tại!`);
            return;
        }
    }

    // Lưu dữ liệu vào localStorage
    if (!allData[sectionId]) allData[sectionId] = [];
    allData[sectionId].push(missileName);
    localStorage.setItem('missile_list', JSON.stringify(allData));

    renderAllMissiles();
}

function renderAllMissiles() {
    const allData = JSON.parse(localStorage.getItem('missile_list')) || {};
    const sections = ['tuyen-1', 'tuyen-2', 'tuyen-3', 'tuyen-4', 'tuyen-5'];

    sections.forEach(id => {
        const container = document.querySelector(`#${id} .missile-container`);
        if (!container) return;
        container.innerHTML = ""; 

        if (allData[id]) {
            allData[id].forEach(name => {
                const tag = document.createElement('div');
                tag.className = 'missile-tag';
                const url = `chi_tiet_dan.html?id=${encodeURIComponent(name)}`;
                
                tag.innerHTML = `
                    <a href="${url}" class="missile-link">${name}</a>
                    <button class="btn-remove-name">×</button>
                `;

                // Xóa có xác nhận (để bảo vệ dữ liệu)
                tag.querySelector('.btn-remove-name').onclick = (e) => {
                    e.preventDefault();
                    if (confirm(`Bạn có chắc muốn xóa đạn ${name}?`)) {
                        allData[id] = allData[id].filter(n => n !== name);
                        localStorage.setItem('missile_list', JSON.stringify(allData));
                        localStorage.removeItem('data_' + name); // Xóa sạch dữ liệu chi tiết
                        renderAllMissiles();
                    }
                };
                container.appendChild(tag);
            });
        }
    });
}

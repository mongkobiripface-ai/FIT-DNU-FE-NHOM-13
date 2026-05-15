const detailBox = document.getElementById("detailBox");

function getStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffDays = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return {
      text: "Đã hết hạn",
      className: "expired",
      remainText: `Hết hạn ${Math.abs(diffDays)} ngày trước`
    };
  }

  if (diffDays <= 30) {
    return {
      text: "Sắp hết hạn",
      className: "warning",
      remainText: `Còn ${diffDays} ngày`
    };
  }

  return {
    text: "Còn hạn",
    className: "valid",
    remainText: `Còn ${diffDays} ngày`
  };
}

function renderModules(modules) {
  if (!modules) {
    return `<p class="empty-module">Chưa cập nhật học phần.</p>`;
  }

  return modules.split("|").map((item, index) => `
    <div class="module-item">
      <span>${index + 1}</span>
      <p>${item.trim()}</p>
    </div>
  `).join("");
}

function renderSkills(skills) {
  if (!skills) return "";

  return skills.split(",").map(skill => `
    <span>${skill.trim()}</span>
  `).join("");
}

function loadDetail() {
  const savedCert = localStorage.getItem("selectedCertificate");

  if (!savedCert) {
    detailBox.innerHTML = `
      <div class="empty">
        Không tìm thấy dữ liệu chứng chỉ.
      </div>

      <a href="index.html" class="btn">
        Quay lại trang chủ
      </a>
    `;
    return;
  }

  const cert = JSON.parse(savedCert);
  const status = getStatus(cert.expiryDate);

  detailBox.innerHTML = `
    <a href="index.html" class="back-btn">
      ← Quay lại portfolio
    </a>

    <section class="certificate-detail-layout">

      <div class="certificate-preview">
        <img src="${cert.image}" alt="${cert.title}">

        <div class="certificate-mini-card">
          <span class="badge ${status.className}">
            ${status.text}
          </span>

          <h2>${cert.title}</h2>
          <p>${cert.issuer}</p>
        </div>
      </div>

      <div class="certificate-info-panel">

        <div class="detail-heading">
          <span class="field">${cert.field}</span>
          <h1>${cert.title}</h1>
          <p>${cert.description}</p>
        </div>

        <div class="detail-grid">
          <div class="detail-info-box">
            <span>Đơn vị cấp</span>
            <strong>${cert.issuer}</strong>
          </div>

          <div class="detail-info-box">
            <span>Ngày cấp</span>
            <strong>${cert.issueDate}</strong>
          </div>

          <div class="detail-info-box">
            <span>Ngày hết hạn</span>
            <strong>${cert.expiryDate}</strong>
          </div>

          <div class="detail-info-box">
            <span>Trạng thái</span>
            <strong>${status.remainText}</strong>
          </div>
        </div>

        <div class="skills-section">
          <h3>🎯 Kỹ năng đạt được</h3>

          <div class="skills-list">
            ${renderSkills(cert.skills)}
          </div>
        </div>

        <div class="modules-section">
          <h3>📚 Học phần / Nội dung đào tạo</h3>

          <div class="module-list">
            ${renderModules(cert.modules)}
          </div>
        </div>

        <a href="${cert.credentialUrl}" target="_blank" class="btn">
          Xem chứng chỉ gốc
        </a>

      </div>

    </section>
  `;
}

loadDetail();
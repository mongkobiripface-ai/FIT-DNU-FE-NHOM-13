const certList = document.getElementById("certList");
const fieldFilter = document.getElementById("fieldFilter");
const searchInput = document.getElementById("searchInput");
const summaryBox = document.getElementById("summaryBox");
const alertBox = document.getElementById("alertBox");

let certificates = [];

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

function viewDetail(index) {
  const cert = certificates[index];
  localStorage.setItem("selectedCertificate", JSON.stringify(cert));
  window.location.href = "detail.html";
}

function renderSummary(data) {
  const total = data.length;

  const valid = data.filter(
    c => getStatus(c.expiryDate).className === "valid"
  ).length;

  const warning = data.filter(
    c => getStatus(c.expiryDate).className === "warning"
  ).length;

  const expired = data.filter(
    c => getStatus(c.expiryDate).className === "expired"
  ).length;

  summaryBox.innerHTML = `
    <div class="summary-card">
      <h3>${total}</h3>
      <p>Tổng chứng chỉ</p>
    </div>

    <div class="summary-card valid-border">
      <h3>${valid}</h3>
      <p>Còn hạn</p>
    </div>

    <div class="summary-card warning-border">
      <h3>${warning}</h3>
      <p>Sắp hết hạn</p>
    </div>

    <div class="summary-card expired-border">
      <h3>${expired}</h3>
      <p>Đã hết hạn</p>
    </div>
  `;
}

function renderAlert(data) {
  const warningCerts = data.filter(
    c => getStatus(c.expiryDate).className === "warning"
  );

  if (warningCerts.length === 0) {
    alertBox.innerHTML = "";
    return;
  }

  alertBox.innerHTML = `
    <div class="warning-alert">
      ⚠ Có <strong>${warningCerts.length}</strong> chứng chỉ sắp hết hạn trong 30 ngày tới
    </div>
  `;
}

function renderCertificates(data) {
  certList.innerHTML = "";

  if (data.length === 0) {
    certList.innerHTML = `
      <p class="empty">Không tìm thấy chứng chỉ phù hợp.</p>
    `;
    return;
  }

  data.forEach(cert => {
    const status = getStatus(cert.expiryDate);
    const originalIndex = certificates.findIndex(item => item.title === cert.title);

    certList.innerHTML += `
      <article class="card">
        <img src="${cert.image}" alt="${cert.title}">

        <div class="card-body">
          <div class="card-top">
            <span class="badge ${status.className}">
              ${status.text}
            </span>

            <span class="field">
              ${cert.field}
            </span>
          </div>

          <h3>${cert.title}</h3>

          <p>
            <strong>Đơn vị cấp:</strong>
            ${cert.issuer}
          </p>

          <p>
            <strong>Kỹ năng:</strong>
            ${cert.skills}
          </p>

          <p>
            <strong>Hết hạn:</strong>
            ${cert.expiryDate}
          </p>

          <p class="remain-text">
            ${status.remainText}
          </p>

          <button class="btn" onclick="viewDetail(${originalIndex})">
            Xem chi tiết
          </button>
        </div>
      </article>
    `;
  });
}

function loadFields() {
  const fields = [...new Set(certificates.map(c => c.field))];

  fields.forEach(field => {
    fieldFilter.innerHTML += `
      <option value="${field}">
        ${field}
      </option>
    `;
  });
}

function applyFilter() {
  const keyword = searchInput.value.toLowerCase();
  const selectedField = fieldFilter.value;

  const filtered = certificates.filter(cert => {
    const matchKeyword =
      cert.title.toLowerCase().includes(keyword) ||
      cert.skills.toLowerCase().includes(keyword) ||
      cert.issuer.toLowerCase().includes(keyword);

    const matchField =
      selectedField === "" || cert.field === selectedField;

    return matchKeyword && matchField;
  });

  renderSummary(filtered);
  renderAlert(filtered);
  renderCertificates(filtered);
}

async function init() {
  certificates = await getCertificates();

  renderSummary(certificates);
  renderAlert(certificates);
  renderCertificates(certificates);
  loadFields();
}

searchInput.addEventListener("input", applyFilter);
fieldFilter.addEventListener("change", applyFilter);

init();
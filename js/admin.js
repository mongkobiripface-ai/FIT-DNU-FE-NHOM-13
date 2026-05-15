const form = document.getElementById("certForm");
const adminList = document.getElementById("adminList");
const loginBox = document.getElementById("loginBox");
const adminContent = document.getElementById("adminContent");
const adminPassword = document.getElementById("adminPassword");
const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let deleteId = null;

function checkLogin() {

  const isLoggedIn =
    localStorage.getItem("certtracker_admin");

  if(isLoggedIn === "true"){

    loginBox.classList.add("hidden");

    adminContent.classList.remove("hidden");

    loadAdminList();

  }else{

    loginBox.classList.remove("hidden");

    adminContent.classList.add("hidden");

  }
}

function loginAdmin(){

  const password =
    adminPassword.value.trim();

  if(password === "admin123"){

    localStorage.setItem(
      "certtracker_admin",
      "true"
    );

    loginBox.classList.add("hidden");

    adminContent.classList.remove("hidden");

    loadAdminList();

  }else{

    alert("Sai mật khẩu admin!");

  }
}

function logoutAdmin(){

  localStorage.removeItem(
    "certtracker_admin"
  );

  location.reload();
}

async function loadAdminList(){

  const certs =
    await getCertificates();

  adminList.innerHTML = "";

  certs.forEach(cert => {

    adminList.innerHTML += `

      <div class="admin-card">

        <img
          src="${cert.image}"
          alt="${cert.title}"
        >

        <div class="admin-card-body">

          <h3>${cert.title}</h3>

          <p>
            <strong>${cert.issuer}</strong>
          </p>

          <p>${cert.field}</p>

          <p>
            <strong>Kỹ năng:</strong>
            ${cert.skills}
          </p>

          <div class="admin-actions">

            <button
              onclick="editCert('${cert.id}')"
              class="edit-btn"
            >
              Sửa
            </button>

            <button
              onclick="openDeleteModal('${cert.id}')"
              class="delete-btn"
            >
              Xóa
            </button>

          </div>

        </div>

      </div>

    `;
  });
}

form?.addEventListener(
  "submit",
  async function(e){

    e.preventDefault();

    const id =
      document.getElementById("certId").value;

    const data = {

      title:
      document.getElementById("title").value,

      issuer:
      document.getElementById("issuer").value,

      field:
      document.getElementById("field").value,

      skills:
      document.getElementById("skills").value,

      issueDate:
      document.getElementById("issueDate").value,

      expiryDate:
      document.getElementById("expiryDate").value,

      credentialUrl:
      document.getElementById("credentialUrl").value,

      image:
      document.getElementById("image").value,

      description:
      document.getElementById("description").value

    };

    if(id){

      await updateCertificate(id,data);

      alert("Cập nhật thành công");

    }else{

      await createCertificate(data);

      alert("Thêm thành công");

    }

    form.reset();

    document.getElementById("certId").value = "";

    loadAdminList();

  }
);

async function editCert(id){

  const cert =
    await getCertificateById(id);

  document.getElementById("certId").value =
    cert.id;

  document.getElementById("title").value =
    cert.title;

  document.getElementById("issuer").value =
    cert.issuer;

  document.getElementById("field").value =
    cert.field;

  document.getElementById("skills").value =
    cert.skills;

  document.getElementById("issueDate").value =
    cert.issueDate;

  document.getElementById("expiryDate").value =
    cert.expiryDate;

  document.getElementById("credentialUrl").value =
    cert.credentialUrl;

  document.getElementById("image").value =
    cert.image;

  document.getElementById("description").value =
    cert.description;

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}

function openDeleteModal(id){

  deleteId = id;

  confirmModal.classList.remove("hidden");
}

function closeModal(){

  deleteId = null;

  confirmModal.classList.add("hidden");
}

confirmDeleteBtn?.addEventListener(
  "click",
  async function(){

    if(deleteId){

      await deleteCertificate(deleteId);

      closeModal();

      loadAdminList();
    }
  }
);

function cancelEdit(){

  form.reset();

  document.getElementById("certId").value = "";
}

async function exportSkills(){

  const certs =
    await getCertificates();

  let csv =
    "Certificate,Field,Skills\n";

  certs.forEach(cert => {

    csv +=
      `"${cert.title}","${cert.field}","${cert.skills}"\n`;

  });

  const blob =
    new Blob(
      [csv],
      {
        type:"text/csv"
      }
    );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "certificates-skills.csv";

  link.click();
}

checkLogin();
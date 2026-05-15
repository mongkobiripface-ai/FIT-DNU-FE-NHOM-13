const API_URL =
  "https://69fc38a0fce564e25917848e.mockapi.io/certificates";

async function getCertificates() {
  const response = await fetch(API_URL);
  return await response.json();
}

async function getCertificateById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
}

async function createCertificate(data) {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

async function updateCertificate(id, data) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

async function deleteCertificate(id) {
  return fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
}async function getCertificateById(id) {

  const response =
    await fetch(`${API_URL}/${id}`);

  return await response.json();
}
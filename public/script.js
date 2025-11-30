document
  .getElementById("previewBtn")
  .addEventListener("click", generatePreview);

document.getElementById("sendBtn").addEventListener("click", sendEmail);

async function generatePreview() {
  const status = document.querySelector('input[name="status"]:checked')?.value;
  const name = document.getElementById("candidateName").value.trim();
  const position = document.getElementById("position").value.trim();

  if (!status || !name || !position) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post("/preview", {
      status,
      name,
      position,
    });

    document.getElementById("previewContent").innerText = res.data.preview;
    document.getElementById("previewBox").classList.remove("hidden");
  } catch (error) {
    console.error(error);
    alert("Preview failed");
  }
}

async function sendEmail() {
  const status = document.querySelector('input[name="status"]:checked')?.value;
  const name = document.getElementById("candidateName").value.trim();
  const email = document.getElementById("candidateEmail").value.trim();
  const position = document.getElementById("position").value.trim();

  if (!status || !name || !email || !position) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post("/send-email", {
      status,
      name,
      email,
      position,
    });

    if (res.data.success) {
      alert("Email sent successfully!");
    } else {
      alert("Failed to send email");
    }
  } catch (error) {
    console.log(error);
    alert("Failed to send email");
  }
}

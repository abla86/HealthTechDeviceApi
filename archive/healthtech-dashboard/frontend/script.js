const API = (document.body.dataset.apiBase || "http://127.0.0.1:8000").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 8000;

const table = document.querySelector("#device-table");
const errorBox = document.querySelector("#error");
const apiStatus = document.querySelector("#api-status");
const statusDot = document.querySelector("#status-dot");

function statusClass(status) {
  return String(status).toLowerCase();
}

function createRequestSignal() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return { signal: controller.signal, clear: () => window.clearTimeout(timeoutId) };
}

function isValidDevice(device) {
  return (
    device &&
    Number.isInteger(device.id) &&
    typeof device.name === "string" &&
    typeof device.type === "string" &&
    ["Online", "Offline", "Maintenance"].includes(device.status) &&
    Number.isInteger(device.battery) &&
    device.battery >= 0 &&
    device.battery <= 100
  );
}

function renderDevices(devices) {
  table.replaceChildren();

  for (const device of devices) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = String(device.id);

    const nameCell = document.createElement("td");
    const name = document.createElement("strong");
    name.textContent = device.name;
    nameCell.appendChild(name);

    const typeCell = document.createElement("td");
    typeCell.textContent = device.type;

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = `status ${statusClass(device.status)}`;
    status.textContent = device.status;
    statusCell.appendChild(status);

    const batteryCell = document.createElement("td");
    batteryCell.textContent = `${device.battery}%`;

    row.append(idCell, nameCell, typeCell, statusCell, batteryCell);
    table.appendChild(row);
  }
}

async function loadDevices() {
  let healthRequest;
  let deviceRequest;

  try {
    errorBox.classList.add("hidden");
    apiStatus.textContent = "Checking API...";
    statusDot.style.background = "#f1c96b";

    healthRequest = createRequestSignal();
    const healthResponse = await fetch(`${API}/health`, {
      cache: "no-store",
      signal: healthRequest.signal,
    });
    if (!healthResponse.ok) {
      throw new Error(`Health check returned ${healthResponse.status}`);
    }

    deviceRequest = createRequestSignal();
    const response = await fetch(`${API}/devices`, {
      cache: "no-store",
      signal: deviceRequest.signal,
    });
    if (!response.ok) {
      throw new Error(`Device request returned ${response.status}`);
    }

    const devices = await response.json();
    if (!Array.isArray(devices) || !devices.every(isValidDevice)) {
      throw new Error("API returned an invalid device payload");
    }

    renderDevices(devices);
    apiStatus.textContent = "API online";
    statusDot.style.background = "#72e2ba";

    document.querySelector("#total").textContent = String(devices.length);
    document.querySelector("#online").textContent = String(
      devices.filter((device) => device.status === "Online").length,
    );
    document.querySelector("#offline").textContent = String(
      devices.filter((device) => device.status === "Offline").length,
    );

    const average = devices.length
      ? Math.round(
          devices.reduce((sum, device) => sum + device.battery, 0) /
            devices.length,
        )
      : 0;

    document.querySelector("#battery").textContent = `${average}%`;
  } catch (error) {
    apiStatus.textContent = "API offline";
    statusDot.style.background = "#ff8c8c";
    errorBox.textContent =
      error?.name === "AbortError"
        ? "The backend did not respond within 8 seconds. Check the API address and backend status."
        : "Could not connect to the FastAPI backend or the API returned invalid data. Check the configured API address and backend status.";
    errorBox.classList.remove("hidden");
  } finally {
    healthRequest?.clear();
    deviceRequest?.clear();
  }
}

document.querySelector("#refresh").addEventListener("click", loadDevices);

loadDevices();

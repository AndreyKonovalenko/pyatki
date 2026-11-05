const form = document.getElementById('run-form');
const methodSelect = document.getElementById('method');
const innInput = document.getElementById('inn');
const yearInput = document.getElementById('year');
const output = document.getElementById('output');
const runButton = form.querySelector('button[type="submit"]');

const drawer = document.getElementById('form-drawer');
const toggleBtn = document.getElementById('toggle-form');
const hideBtn = document.getElementById('hide-form');

// ---------- drawer control ----------

function openDrawer() {
  drawer.classList.remove('closed');
  document.body.classList.add('drawer-open');
  toggleBtn.classList.add('hidden');
}

function closeDrawer() {
  drawer.classList.add('closed');
  document.body.classList.remove('drawer-open');
  toggleBtn.classList.remove('hidden');
}

toggleBtn.addEventListener('click', openDrawer);
hideBtn.addEventListener('click', closeDrawer);

// start with drawer open
openDrawer();

// ---------- load methods ----------

async function loadMethods() {
  const res = await fetch('/api/methods');
  const methods = await res.json();
  for (const m of methods) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    methodSelect.appendChild(opt);
  }
}

// ---------- run ----------

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  runButton.disabled = true;
  output.textContent = '⏳ Running...';

  const params = new URLSearchParams({
    method: methodSelect.value,
    ...(innInput.value && {inn: innInput.value}),
    ...(yearInput.value && {inn: yearInput.value})
  })

  try {
    const res = await fetch(`/api/execute?${params.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      output.textContent = `❌ Error: ${data.error}`;
      return;
    }

    output.textContent = JSON.stringify(data, null, 2);

    // auto-hide the drawer once a result is rendered
    // closeDrawer();
  } catch (err) {
    output.textContent = `❌ Network error: ${err.message}`;
  } finally {
    runButton.disabled = false;
  }
});

loadMethods();
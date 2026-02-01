const app = document.getElementById("app");
const headerActions = document.getElementById("header-actions");

const TOKEN_KEY = "act-practice-token";

const state = {
  user: null,
};

function setHeaderActions() {
  headerActions.innerHTML = "";
  if (state.user) {
    const logoutButton = document.createElement("button");
    logoutButton.className = "secondary";
    logoutButton.textContent = "Log out";
    logoutButton.addEventListener("click", () => {
      clearToken();
      state.user = null;
      renderRoute("login");
    });
    headerActions.appendChild(logoutButton);
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

function renderNotice(message, variant = "notice") {
  const notice = document.createElement("div");
  notice.className = `notice ${variant}`;
  notice.textContent = message;
  return notice;
}

function renderDashboard() {
  app.innerHTML = "";

  const card = document.createElement("section");
  card.className = "card dashboard";

  const greeting = document.createElement("h2");
  greeting.textContent = `Welcome back, ${state.user.email}`;

  const role = document.createElement("p");
  role.className = "helper";
  role.textContent = `Role: ${state.user.role}`;

  const actions = document.createElement("div");
  actions.className = "actions";

  const refreshButton = document.createElement("button");
  refreshButton.className = "secondary";
  refreshButton.textContent = "Refresh profile";
  refreshButton.addEventListener("click", async () => {
    try {
      const data = await apiRequest("/api/me");
      state.user = data.user;
      renderDashboard();
      setHeaderActions();
    } catch (error) {
      card.prepend(renderNotice(error.message, "error"));
    }
  });

  actions.appendChild(refreshButton);

  const overview = document.createElement("div");
  overview.className = "dashboard-card";
  overview.innerHTML = `
    <h3>Your next steps</h3>
    <ul>
      <li>Schedule practice sessions for the week.</li>
      <li>Track your progress and focus areas.</li>
      <li>Invite classmates or students to join.</li>
    </ul>
  `;

  card.append(greeting, role, actions, overview);
  app.appendChild(card);
}

function renderLogin() {
  app.innerHTML = "";

  const card = document.createElement("section");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = "Log in";

  const form = document.createElement("form");
  form.className = "form-grid";

  form.innerHTML = `
    <div>
      <label for="login-email">Email</label>
      <input type="email" id="login-email" required />
    </div>
    <div>
      <label for="login-password">Password</label>
      <input type="password" id="login-password" minlength="8" required />
    </div>
    <button class="primary" type="submit">Log in</button>
  `;

  const helper = document.createElement("p");
  helper.className = "helper";
  helper.innerHTML = `Don't have an account? <button class="link-button" type="button" data-route="register">Create one</button>`;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = form.querySelector("#login-email").value.trim();
    const password = form.querySelector("#login-password").value;

    try {
      const data = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      state.user = data.user;
      setHeaderActions();
      renderRoute("dashboard");
    } catch (error) {
      const notice = renderNotice(error.message, "error");
      card.prepend(notice);
    }
  });

  card.append(title, form, helper);
  app.appendChild(card);
}

function renderRegister() {
  app.innerHTML = "";

  const card = document.createElement("section");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = "Create account";

  const form = document.createElement("form");
  form.className = "form-grid";
  form.innerHTML = `
    <div>
      <label for="register-email">Email</label>
      <input type="email" id="register-email" required />
    </div>
    <div>
      <label for="register-password">Password</label>
      <input type="password" id="register-password" minlength="8" required />
      <small class="helper">Use at least 8 characters.</small>
    </div>
    <div>
      <label for="register-role">Role</label>
      <select id="register-role" required>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
    </div>
    <button class="primary" type="submit">Register</button>
  `;

  const helper = document.createElement("p");
  helper.className = "helper";
  helper.innerHTML = `Already have an account? <button class="link-button" type="button" data-route="login">Log in</button>`;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = form.querySelector("#register-email").value.trim();
    const password = form.querySelector("#register-password").value;
    const role = form.querySelector("#register-role").value;

    try {
      const data = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });
      setToken(data.token);
      state.user = data.user;
      setHeaderActions();
      renderRoute("dashboard");
    } catch (error) {
      const notice = renderNotice(error.message, "error");
      card.prepend(notice);
    }
  });

  card.append(title, form, helper);
  app.appendChild(card);
}

function renderRoute(route) {
  if (route === "dashboard" && !state.user) {
    renderLogin();
    return;
  }

  if (route === "login") {
    renderLogin();
    return;
  }

  if (route === "register") {
    renderRegister();
    return;
  }

  renderDashboard();
}

function bindRouteLinks() {
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.matches("[data-route]")) {
      const route = target.getAttribute("data-route");
      if (route) {
        renderRoute(route);
      }
    }
  });
}

async function initialize() {
  bindRouteLinks();
  setHeaderActions();

  const token = getToken();
  if (!token) {
    renderRoute("login");
    return;
  }

  try {
    const data = await apiRequest("/api/me");
    state.user = data.user;
    setHeaderActions();
    renderRoute("dashboard");
  } catch (error) {
    clearToken();
    renderRoute("login");
  }
}

initialize();

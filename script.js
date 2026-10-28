/*
 * Project data. To add a card, add one object to this array.
 * tags: any of "bsa", "integrations", "automation".
 * status: "soon" shows a "Coming soon" tag. Use "" for finished work.
 * demo / code: set to a URL string, or null to show a disabled placeholder link.
 */
var PROJECTS = [
  {
    id: "order-exception-monitor",
    title: "Order exception monitor",
    status: "soon",
    plan: "Planned. To be built with Google Apps Script.",
    tags: ["automation", "bsa"],
    problem: "Placeholder. Details are coming once the project is built.",
    built: "Placeholder. Details are coming once the project is built.",
    result: "Placeholder. A measured result will be added after the project is built and tested.",
    demo: null,
    code: null
  },
  {
    id: "no-code-integration-workflow",
    title: "No-code integration workflow",
    status: "soon",
    plan: "Planned. To be built with Zapier or Make.",
    tags: ["integrations", "automation"],
    problem: "Placeholder. Details are coming once the project is built.",
    built: "Placeholder. Details are coming once the project is built.",
    result: "Placeholder. A measured result will be added after the project is built and tested.",
    demo: null,
    code: null
  }
];

var PATHS = {
  all: "All",
  bsa: "Business Systems Analyst",
  integrations: "Integrations",
  automation: "Automation"
};

function el(tag, attrs, text) {
  var node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
  }
  if (text !== undefined && text !== null) {
    node.textContent = text;
  }
  return node;
}

function renderLink(label, url, title) {
  if (url) {
    return el("a", { href: url, target: "_blank", rel: "noopener" }, label);
  }
  // Disabled placeholder link: no href, not focusable, announced as disabled.
  return el("a", { "aria-disabled": "true", title: label + " link for " + title + " is not available yet" }, label + " (soon)");
}

function renderCard(project, isMatch) {
  var li = el("li", { "class": "card", "data-id": project.id });
  var article = el("article", { "aria-labelledby": "title-" + project.id });

  var head = el("div", { "class": "card-head" });
  head.appendChild(el("h3", { id: "title-" + project.id }, project.title));
  if (project.status === "soon") {
    head.appendChild(el("span", { "class": "tag tag-soon" }, "Coming soon"));
  }
  if (isMatch) {
    head.appendChild(el("span", { "class": "match-label" }, "Relevant to your role"));
  }
  article.appendChild(head);

  if (project.plan) {
    article.appendChild(el("p", { "class": "note" }, project.plan));
  }

  var dl = el("dl");
  [["Problem", project.problem], ["What I built", project.built], ["Measured result", project.result]].forEach(function (row) {
    var wrap = el("div");
    wrap.appendChild(el("dt", null, row[0]));
    wrap.appendChild(el("dd", null, row[1]));
    dl.appendChild(wrap);
  });
  article.appendChild(dl);

  var tags = el("ul", { "class": "card-tags", "aria-label": "Tags" });
  project.tags.forEach(function (tag) {
    tags.appendChild(el("li", { "class": "tag" }, PATHS[tag] || tag));
  });
  article.appendChild(tags);

  var links = el("div", { "class": "card-links" });
  links.appendChild(renderLink("Demo", project.demo, project.title));
  links.appendChild(renderLink("Code", project.code, project.title));
  article.appendChild(links);

  li.appendChild(article);
  if (isMatch) {
    li.classList.add("is-match");
  }
  return li;
}

function sortProjects(path) {
  // Stable sort: matching cards first, original order otherwise.
  return PROJECTS.map(function (p, i) { return { p: p, i: i }; })
    .sort(function (a, b) {
      if (path === "all") { return a.i - b.i; }
      var am = a.p.tags.indexOf(path) !== -1 ? 0 : 1;
      var bm = b.p.tags.indexOf(path) !== -1 ? 0 : 1;
      return am - bm || a.i - b.i;
    })
    .map(function (x) { return x.p; });
}

function render(path) {
  var list = document.getElementById("card-list");
  list.textContent = "";
  var matches = 0;
  sortProjects(path).forEach(function (project) {
    var isMatch = path !== "all" && project.tags.indexOf(path) !== -1;
    if (isMatch) { matches += 1; }
    var card = renderCard(project, isMatch);
    list.appendChild(card);
  });

  var buttons = document.querySelectorAll("#path-selector button");
  Array.prototype.forEach.call(buttons, function (btn) {
    btn.setAttribute("aria-pressed", btn.getAttribute("data-path") === path ? "true" : "false");
  });

  var status = document.getElementById("selector-status");
  status.textContent = path === "all"
    ? "Showing all projects."
    : "Showing " + matches + " project" + (matches === 1 ? "" : "s") + " most relevant to " + PATHS[path] + " first.";
}

function pathFromHash() {
  var hash = window.location.hash.replace("#", "");
  var match = hash.match(/^for=(\w+)$/);
  if (match && PATHS[match[1]]) { return match[1]; }
  return null;
}

function setPath(path) {
  if (path === "all") {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  } else {
    history.replaceState(null, "", "#for=" + path);
  }
  render(path);
}

document.addEventListener("DOMContentLoaded", function () {
  var buttons = document.querySelectorAll("#path-selector button");
  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener("click", function () { setPath(btn.getAttribute("data-path")); });
  });

  // Placeholder contact links: prevent a jump, they are not filled in yet.
  Array.prototype.forEach.call(document.querySelectorAll(".placeholder-link"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  render(pathFromHash() || "all");

  window.addEventListener("hashchange", function () {
    var path = pathFromHash();
    if (path) { render(path); }
  });
});

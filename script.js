const form = document.getElementById('builderForm');
const preview = document.getElementById('preview');
const exportBtn = document.getElementById('exportBtn');

document.querySelectorAll('.sidebar button').forEach(button => {
  button.addEventListener('click', async () => {
    const block = button.getAttribute('data-block');
    const res = await fetch(`templates/${block}.html`);
    const html = await res.text();
    const div = document.createElement('div');
    div.innerHTML = html;
    preview.appendChild(div);
  });
});

 const container = document.createElement('div');
  container.classList.add('block-wrapper');
  container.innerHTML = `
    <div class="remove-btn">✖</div>
    <div class="block-content">${html}</div>
  `;

  preview.appendChild(container);

  container.querySelector('.remove-btn').addEventListener('click', () => {
    container.remove();
  });

exportBtn.addEventListener('click', () => {
  const content = preview.innerHTML;
  const finalHTML = `
    <html>
    <head>
      <title>Landing Page</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>${content}</body></html>`;

  const blob = new Blob([finalHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'landing-page.html';
  a.click();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const selected = Array.from(document.querySelectorAll('input[name="blocks"]:checked')).map(el => el.value);
  let content = "";

  for (const block of selected) {
    const res = await fetch(`templates/${block}.html`);
    const html = await res.text();
    content += html + "\n";
  }

  // Live Preview
  preview.innerHTML = content;

  // Save HTML for Export
  form.generatedHTML = `<html><head><title>Landing Page</title><link rel="stylesheet" href="style.css"></head><body>${content}</body></html>`;
});

exportBtn.addEventListener('click', () => {
  const clones = preview.cloneNode(true);

  // Remove remove buttons and wrappers
  clones.querySelectorAll('.remove-btn').forEach(btn => btn.remove());
  clones.querySelectorAll('.block-wrapper').forEach(wrapper => {
    const inner = wrapper.querySelector('.block-content');
    wrapper.replaceWith(inner);
  });

  const content = clones.innerHTML;

  const finalHTML = `
    <html>
    <head>
      <title>Landing Page</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>${content}</body></html>`;

  const blob = new Blob([finalHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'landing-page.html';
  a.click();
});

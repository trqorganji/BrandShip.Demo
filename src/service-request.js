import './service-request.css';
import './request-form-cta.css';

const form = document.querySelector('.service-request-form');
if (form) {
  const find = id => form.querySelector(`#${id}`);
  const editor = find('request-editor');
  const editorActions = form.querySelector('.request-editor-actions');
  const review = find('request-review');
  const success = find('request-success');
  const status = find('enquiry-status');
  const send = find('request-send');
  const services = [...form.querySelectorAll('input[name="services"]')];
  const other = find('request-other');
  const otherDescription = find('request-other-description');
  const picker = find('request-proposals');
  const dropzone = find('request-dropzone');
  const fileList = find('request-file-list');
  const uploadError = find('request-upload-error');
  const maxFileSize = 10 * 1024 * 1024;
  const maxTotalSize = 20 * 1024 * 1024;
  const acceptedTypes = {
    pdf: ['application/pdf'],
    doc: ['application/msword'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ppt: ['application/vnd.ms-powerpoint'],
    pptx: ['application/vnd.openxmlformats-officedocument.presentationml.presentation']
  };
  let files = [];
  let requestId;
  let pending = false;
  const sizeLabel = bytes => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  const announce = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', error);
  };

  // The destination is deployment configuration, never a URL query parameter.
  function endpoint() {
    const raw = import.meta.env.VITE_SERVICE_REQUEST_ENDPOINT || form.dataset.endpoint;
    if (!raw?.trim()) return null;
    try {
      const url = new URL(raw.trim(), location.href);
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
      if (url.username || url.password || url.hash || (url.protocol !== 'https:' && !(local && url.protocol === 'http:'))) return null;
      return url.href;
    } catch { return null; }
  }
  function updateConnection() {
    const connected = Boolean(endpoint());
    find('request-connection-note').textContent = connected
      ? 'Your request and any selected files will be sent only after you review and confirm.'
      : 'Preview mode · Backend connection pending. Requests and proposal files are not sent.';
    find('request-review-note').textContent = connected
      ? 'Ready to share? Send your request and the selected files to the connected enquiry service.'
      : 'Connection pending: nothing has been sent. Your answers and files stay in this tab. You can download a copy of your brief below.';
    send.disabled = !connected || pending;
    return connected;
  }
  function updateServices(showError = false) {
    const selected = services.filter(input => input.checked);
    const hasService = selected.length > 0;
    find('request-services-selection').textContent = hasService
      ? selected.map(input => input.closest('label').querySelector('span').textContent).join(', ')
      : 'Choose services';
    if (showError && (!hasService || (other.checked && !otherDescription.value.trim()))) find('request-service-picker').open = true;
    services[0].setCustomValidity(hasService ? '' : 'Choose at least one service.');
    find('request-services-error').hidden = hasService || !showError;
    form.querySelector('.request-services').setAttribute('aria-invalid', String(!hasService && showError));
    find('request-other-field').hidden = !other.checked;
    otherDescription.disabled = !other.checked;
    otherDescription.required = other.checked;
    otherDescription.setCustomValidity(other.checked && !otherDescription.value.trim() ? 'Describe the service you have in mind.' : '');
  }
  function validate() {
    updateServices(true);
    find('request-name').setCustomValidity(find('request-name').value.trim() ? '' : 'Enter your name.');
    updateBriefValidity();
    // A collapsed optional group must open before the browser focuses an invalid input.
    if ([...find('request-extra-details').querySelectorAll('input,select')].some(input => !input.validity.valid)) find('request-extra-details').open = true;
    return form.reportValidity();
  }
  function updateBriefValidity() {
    find('request-message').setCustomValidity(find('request-message').value.trim() || files.length ? '' : 'Write a short note or attach a proposal.');
  }
  services.forEach(input => input.addEventListener('change', () => updateServices(false)));
  otherDescription.addEventListener('input', () => updateServices(false));
  find('request-name').addEventListener('input', event => event.target.setCustomValidity(''));
  find('request-message').addEventListener('input', event => event.target.setCustomValidity(''));

  function renderFiles() {
    fileList.replaceChildren();
    files.forEach((file, index) => {
      const item = document.createElement('li');
      const copy = document.createElement('div');
      const name = document.createElement('span');
      const size = document.createElement('small');
      name.textContent = file.name;
      size.textContent = sizeLabel(file.size);
      copy.append(name, size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'request-remove-file';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.addEventListener('click', () => {
        files.splice(index, 1);
        uploadError.hidden = true;
        renderFiles();
        const next = fileList.querySelectorAll('button')[Math.min(index, files.length - 1)];
        (next || picker).focus();
      });
      item.append(copy, remove);
      fileList.append(item);
    });
    find('request-file-status').textContent = files.length
      ? `${files.length} of 3 files selected · ${sizeLabel(files.reduce((sum, file) => sum + file.size, 0))} in total. Not sent yet.`
      : '';
    updateBriefValidity();
  }
  function addFiles(incoming) {
    const additions = [...incoming].filter(file => !files.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified));
    const unique = additions.filter((file, index) => additions.findIndex(otherFile => otherFile.name === file.name && otherFile.size === file.size && otherFile.lastModified === file.lastModified) === index);
    let error = '';
    for (const file of unique) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!Object.hasOwn(acceptedTypes, extension) || (file.type && file.type !== 'application/octet-stream' && !acceptedTypes[extension].includes(file.type))) {
        error = 'Choose a PDF, Word (.doc or .docx), or PowerPoint (.ppt or .pptx) file.'; break;
      }
      if (!file.size) { error = 'Empty files cannot be attached. Choose a file with content.'; break; }
      if (file.size > maxFileSize) { error = 'Each proposal file must be 10 MB or smaller.'; break; }
    }
    if (!error && files.length + unique.length > 3) error = 'You can attach up to 3 files. Remove a file before adding another.';
    if (!error && [...files, ...unique].reduce((sum, file) => sum + file.size, 0) > maxTotalSize) error = 'The combined file size must be 20 MB or smaller.';
    uploadError.textContent = error;
    uploadError.hidden = !error;
    if (!error) { files.push(...unique); renderFiles(); }
    picker.value = '';
  }
  picker.addEventListener('change', () => addFiles(picker.files));
  ['dragenter', 'dragover'].forEach(name => dropzone.addEventListener(name, event => {
    event.preventDefault();
    dropzone.classList.add('is-dragging');
  }));
  dropzone.addEventListener('dragleave', event => {
    if (!dropzone.contains(event.relatedTarget)) dropzone.classList.remove('is-dragging');
  });
  dropzone.addEventListener('drop', event => {
    event.preventDefault();
    dropzone.classList.remove('is-dragging');
    addFiles(event.dataTransfer.files);
  });

  const text = name => String(new FormData(form).get(name) || '').trim();
  function summaryRows() {
    return [
      ['Name', text('name')], ['Email', text('email')],
      ['Services', services.filter(input => input.checked).map(input => input.closest('label').querySelector('span').textContent).join(', ')],
      ...(other.checked ? [['Other service', text('other_service')]] : []),
      ...(text('message') ? [['Project note', text('message')]] : []),
      ...[['Organisation', text('company')], ['Phone', text('phone')]].filter(([, value]) => value),
      ['Proposal files', files.length ? files.map(file => `${file.name} (${sizeLabel(file.size)})`).join('\n') : 'No files attached'],
      ['Permission to respond', 'Agreed']
    ];
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (pending || !validate()) return;
    const summary = find('request-summary');
    summary.replaceChildren();
    summaryRows().forEach(([label, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      summary.append(row);
    });
    requestId = crypto.randomUUID?.() || [...crypto.getRandomValues(new Uint8Array(16))].map(byte => byte.toString(16).padStart(2, '0')).join('');
    updateConnection();
    editor.hidden = true;
    editorActions.hidden = true;
    review.hidden = false;
    announce('Review your details below. Nothing has been sent.');
    find('request-review-title').focus();
  });
  function edit() {
    review.hidden = true;
    editor.hidden = false;
    editorActions.hidden = false;
    announce('');
    find('request-name').focus();
  }
  find('request-edit').addEventListener('click', edit);
  find('request-download').addEventListener('click', () => {
    const brief = ['BRANDSHIP / PROJECT ENQUIRY', 'Prepared locally. This is not a submission confirmation.', '', ...summaryRows().map(([label, value]) => `${label}\n${value}\n`), 'Documents are not embedded in this text file. Keep the original proposal files separately.'].join('\n');
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'brandship-project-brief.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  send.addEventListener('click', async () => {
    if (pending || review.hidden) return;
    const destination = endpoint();
    if (!destination) { updateConnection(); announce('Sending is unavailable until a secure backend endpoint is configured.', true); return; }
    if (!form.checkValidity()) { edit(); validate(); return; }
    const payload = new FormData(form);
    for (const [key, value] of payload) if (typeof value === 'string' && key !== 'services') payload.set(key, value.trim());
    files.forEach(file => payload.append('proposals', file, file.name));
    payload.set('client_request_id', requestId);
    payload.set('form_version', '2');
    pending = true;
    send.disabled = true;
    editor.disabled = true;
    find('request-edit').disabled = true;
    find('request-download').disabled = true;
    review.setAttribute('aria-busy', 'true');
    announce('Sending your request and selected files. Please keep this tab open.');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(destination, { method: 'POST', body: payload, headers: { Accept: 'application/json' }, signal: controller.signal, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer' });
      const receipt = await response.json().catch(() => null);
      if (!response.ok || receipt?.ok !== true) throw new Error(response.status === 429 ? 'rate-limit' : 'unconfirmed');
      review.hidden = true;
      success.hidden = false;
      find('request-connection-note').hidden = true;
      announce('Your request has been received by the connected enquiry service.');
      form.reset();
      find('request-service-picker').open = false;
      find('request-extra-details').open = false;
      find('request-summary').replaceChildren();
      requestId = undefined;
      files = [];
      renderFiles();
      uploadError.hidden = true;
      updateServices(false);
      find('request-success-title').focus();
    } catch (error) {
      announce(error.name === 'AbortError'
        ? 'We could not confirm receipt in time. Your details and files are still here. Retry with the same request, or contact Brandship directly.'
        : error.message === 'rate-limit'
          ? 'Too many requests. Please wait and try again. Your details and files are still here.'
          : 'We could not confirm receipt. Your details and files are still here. Try again or contact hello@ourbrandship.com.', true);
      status.focus();
    } finally {
      clearTimeout(timer);
      pending = false;
      editor.disabled = false;
      find('request-edit').disabled = false;
      find('request-download').disabled = false;
      review.removeAttribute('aria-busy');
      updateConnection();
    }
  });
  find('request-start-again').addEventListener('click', () => {
    success.hidden = true;
    find('request-connection-note').hidden = false;
    edit();
  });

  // Optional, allowlisted service preselection from a service-page link.
  const requested = new URLSearchParams(location.search).getAll('service');
  services.forEach(input => { if (requested.includes(input.value)) input.checked = true; });
  editor.disabled = false;
  form.noValidate = true;
  find('request-review-button').disabled = false;
  updateServices(false);
  updateConnection();
  form.dataset.requestReady = 'true';
}

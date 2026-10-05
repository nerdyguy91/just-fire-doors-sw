import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  acceptAttribute,
  checkUpload,
  fileBadge,
  fileExtension,
  formatSize,
  uploadLimits,
} from '../src/lib/enquiry/uploads.ts';

const MB = 1024 * 1024;

test('allowed types pass', () => {
  assert.equal(checkUpload({ name: 'Survey.PDF', size: MB, type: 'application/pdf' }), 'ok');
  assert.equal(checkUpload({ name: 'photo.heic', size: MB, type: '' }), 'ok');
  assert.equal(checkUpload({ name: 'list.csv', size: 10, type: 'application/vnd.ms-excel' }), 'ok');
  assert.equal(checkUpload({ name: 'a.jpeg', size: 10, type: 'image/jpeg; charset=x' }), 'ok');
  assert.equal(checkUpload({ name: 'a.docx', size: 10, type: 'application/octet-stream' }), 'ok');
});

test('other types are rejected by extension or by MIME type', () => {
  assert.equal(checkUpload({ name: 'run.exe', size: 10, type: '' }), 'type');
  assert.equal(checkUpload({ name: 'page.html', size: 10, type: 'text/html' }), 'type');
  assert.equal(checkUpload({ name: 'no-extension', size: 10, type: 'application/pdf' }), 'type');
  assert.equal(checkUpload({ name: '.pdf', size: 10, type: 'application/pdf' }), 'type');
  assert.equal(checkUpload({ name: 'fake.pdf', size: 10, type: 'text/html' }), 'type');
  assert.equal(checkUpload({ name: 'evil.pdf.exe', size: 10 }), 'type');
});

test('size limits', () => {
  const { maxFileBytes } = uploadLimits;
  assert.equal(checkUpload({ name: 'a.pdf', size: maxFileBytes }), 'ok');
  assert.equal(checkUpload({ name: 'a.pdf', size: maxFileBytes + 1 }), 'too-large');
  assert.equal(checkUpload({ name: 'a.pdf', size: 0 }), 'empty');
  assert.equal(checkUpload({ name: 'a.pdf', size: 2 * MB }, MB), 'too-large');
});

test('helpers', () => {
  assert.equal(fileExtension('Job sheet JS-1042.PDF'), 'pdf');
  assert.equal(fileExtension('README'), '');
  assert.equal(fileBadge('Remedial schedule.xlsx'), 'XLSX');
  assert.equal(fileBadge('README'), 'FILE');
  assert.equal(formatSize(4.2 * MB), '4.2 MB');
  assert.equal(formatSize(86 * 1024), '86 KB');
  assert.equal(formatSize(12), '1 KB');
  assert.ok(acceptAttribute.startsWith('.pdf,'));
});

const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../core.js');

test('a daily lesson is reused only for its local date', () => {
  const state = core.loadState({ getItem: () => null });
  const lesson = core.addLesson(state, { title: 'A discovery' }, '2026-11-16');
  assert.equal(core.getToday(state, '2026-11-16'), lesson);
  assert.equal(core.getToday(state, '2026-11-17'), null);
});

test('exploring a topic does not replace the daily lesson', () => {
  const state = core.loadState({ getItem: () => null });
  const daily = core.addLesson(state, { title: 'Daily' }, '2026-11-16');
  core.addLesson(state, { title: 'Explore' }, '2026-11-16', false);
  assert.equal(core.getToday(state, '2026-11-16'), daily);
});

test('saved state round trips and malformed storage recovers', () => {
  const storage = { value: null, getItem() { return this.value; }, setItem(key, value) { this.value = value; } };
  const state = core.loadState(storage);
  state.settings.topics = ['History'];
  core.saveState(storage, state);
  assert.deepEqual(core.loadState(storage).settings.topics, ['History']);
  storage.value = '{';
  assert.deepEqual(core.loadState(storage).lessons, []);
});

test('lesson validation rejects incomplete or inconsistent quizzes', () => {
  const lesson = { title: 'Title', category: 'History', summary: 'Summary', paragraphs: ['One', 'Two'], question: 'Question?', options: ['A', 'B'], answer: 'A', explanation: 'Explanation' };
  assert.equal(core.validateLesson(lesson), lesson);
  assert.throws(() => core.validateLesson({ ...lesson, answer: 'C' }));
  assert.throws(() => core.validateLesson({ ...lesson, paragraphs: [] }));
});
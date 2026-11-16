(function (root) {
  'use strict';

  const STORAGE_KEY = 'another-thing-v1';
  const DEFAULT_STATE = {
    settings: { apiKey: '', topics: [], fontScale: 100, voice: '', rate: 1, onboarded: false },
    lessons: [],
    todayId: null,
    todayDate: null,
  };

  function localDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function loadState(storage) {
    try {
      const saved = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
      return {
        ...DEFAULT_STATE,
        ...saved,
        settings: { ...DEFAULT_STATE.settings, ...saved.settings },
        lessons: Array.isArray(saved.lessons) ? saved.lessons : [],
      };
    } catch {
      return { ...DEFAULT_STATE, settings: { ...DEFAULT_STATE.settings }, lessons: [] };
    }
  }

  function saveState(storage, state) {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getToday(state, date = localDate()) {
    if (state.todayDate !== date) return null;
    return state.lessons.find((lesson) => lesson.id === state.todayId) || null;
  }

  function addLesson(state, lesson, date = localDate(), setToday = true) {
    const entry = { ...lesson, id: lesson.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, createdAt: new Date().toISOString(), saved: false, feedback: null };
    state.lessons.unshift(entry);
    if (setToday) {
      state.todayId = entry.id;
      state.todayDate = date;
    }
    return entry;
  }

  function validateLesson(value) {
    if (!value || typeof value !== 'object') throw new Error('The lesson was not in the expected format.');
    const required = ['title', 'category', 'summary', 'question', 'answer', 'explanation'];
    if (required.some((key) => typeof value[key] !== 'string' || !value[key].trim())) throw new Error('The lesson is missing some details. Please try again.');
    if (!Array.isArray(value.paragraphs) || value.paragraphs.length < 2 || value.paragraphs.some((paragraph) => typeof paragraph !== 'string' || !paragraph.trim())) throw new Error('The lesson text is incomplete. Please try again.');
    if (!Array.isArray(value.options) || value.options.length < 2 || value.options.some((option) => typeof option !== 'string' || !option.trim()) || !value.options.includes(value.answer)) throw new Error('The lesson quiz is incomplete. Please try again.');
    return value;
  }

  const api = { STORAGE_KEY, DEFAULT_STATE, localDate, loadState, saveState, getToday, addLesson, validateLesson };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.AnotherThing = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
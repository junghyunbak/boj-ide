import { act } from 'react';

import { renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useLanguage, useModifyEditor } from '@/renderer/hooks';

/**
 * element
 */
export function isSaveButtonDisabled(): boolean {
  const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');

  return $saveCodeButton.disabled;
}

export function getStaleBall(problem: ProblemInfo) {
  const $problemStaleBall = screen.queryByTestId(`stale-ball-${problem.number}`);

  return $problemStaleBall;
}

export function getEditor() {
  const $cmEditor = screen.getByTestId('cm-editor');

  return $cmEditor;
}

export function getProblemTab(problem: ProblemInfo) {
  const $problemTab = screen.getByText(`${problem.number}번: ${problem.name}`);

  return $problemTab;
}

export function getConfirmModalText() {
  const $confirmModalText = screen.getByTestId('confirm-modal-text');

  return $confirmModalText;
}

export function getEditingProblems() {
  const $editingProblems = screen.queryByTestId('editing-problems');

  return $editingProblems;
}

/**
 * user event
 */
export async function clickProblemTab(problem: ProblemInfo) {
  const $problemTab = getProblemTab(problem);

  await act(async () => {
    await userEvent.click($problemTab);
  });
}

export async function typeEditor(data: string) {
  await act(async () => {
    await userEvent.type(getEditor(), data);
  });
}

export async function typeVimWriteCommand() {
  await act(async () => {
    await userEvent.click(getEditor());
    await userEvent.keyboard('{Shift>}{;}{/Shift}w{Enter}');
  });
}

export async function pressKeySWithControl() {
  await act(async () => {
    await userEvent.keyboard('{Control>}s{/Control}');
  });
}

export async function pressKeySWithMeta() {
  await act(async () => {
    await userEvent.keyboard('{Meta>}s{/Meta}');
  });
}

export async function clickSaveCodeButton() {
  const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');

  await act(async () => {
    await userEvent.click($saveCodeButton);
  });
}

export async function clickSaveDefaultCodeButton() {
  const $saveDefaultCodeButton = screen.getByTestId<HTMLButtonElement>('save-default-code-button');

  await act(async () => {
    await userEvent.click($saveDefaultCodeButton);
  });
}

export async function clickConfirmOkButton() {
  const $confirmOkButton = screen.getByTestId<HTMLButtonElement>('confirm-ok-button');

  await act(async () => {
    await userEvent.click($confirmOkButton);
  });
}

export async function clickConfirmCancelButton() {
  const $confirmCancelButton = screen.getByTestId<HTMLButtonElement>('confirm-cancel-button');

  await act(async () => {
    await userEvent.click($confirmCancelButton);
  });
}

export async function clickSubmitCodeButton() {
  const $submitCodeButton = screen.getByTestId<HTMLButtonElement>('submit-code-button');

  await act(async () => {
    await userEvent.click($submitCodeButton);
  });
}

export async function clickExecuteCodeButton() {
  const $executeCodeButton = screen.getByTestId<HTMLButtonElement>('execute-code-button');

  await act(async () => {
    await userEvent.click($executeCodeButton);
  });
}

/**
 * state
 */
export function clearEditorState() {
  const { result } = renderHook(() => useModifyEditor());

  act(() => {
    result.current.updateEditorState(result.current.createEditorState(''));
  });
}

export function resetProblemStale(problem: ProblemInfo) {
  const { result } = renderHook(() => ({ ...useLanguage(), ...useModifyEditor() }));

  act(() => {
    const { language, syncEditorValue } = result.current;

    syncEditorValue(problem, language);
  });
}

export function clearProblemEditorValue(problem: ProblemInfo, language: Language) {
  const { result } = renderHook(() => ({ ...useLanguage(), ...useModifyEditor() }));

  act(() => {
    const { updateEditorValue, syncEditorValue } = result.current;

    updateEditorValue(problem, language, null);
    syncEditorValue(problem, language);
  });
}

export function changeVimEditorMode() {
  const { result } = renderHook(() => useModifyEditor());

  act(() => {
    result.current.updateEditorMode('vim');
  });
}

export async function changeProblemData(problem: ProblemInfo, data: string) {
  const { result } = renderHook(() => ({ ...useModifyEditor(), ...useLanguage() }));

  act(() => {
    const { language, updateEditorValue } = result.current;

    updateEditorValue(problem, language, data);
  });
}

export function deleteEditorValue(problem: ProblemInfo) {
  const { result } = renderHook(() => ({ ...useModifyEditor(), ...useLanguage() }));

  act(() => {
    const { removeEditorValue, language } = result.current;

    removeEditorValue(problem, language);
  });
}

export function getEditorCode(problem: ProblemInfo) {
  const { result } = renderHook(() => ({ ...useLanguage(), ...useModifyEditor() }));

  const { language, getEditorValue } = result.current;

  return getEditorValue(problem, language);
}

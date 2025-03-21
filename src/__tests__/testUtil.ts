import { act } from 'react';

import { renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useLanguage, useModifyEditor } from '@/renderer/hooks';

export function isSaveButtonDisabled(): boolean {
  const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');

  return $saveCodeButton.disabled;
}

export async function clickProblemTab(problem: ProblemInfo) {
  const $problemTab = screen.getByText(`${problem.number}번: ${problem.name}`);

  await act(async () => {
    await userEvent.click($problemTab);
  });
}

export async function typeEditor(data: string) {
  const $cmEditor = screen.getByTestId('cm-editor');

  await act(async () => {
    await userEvent.type($cmEditor, data);
  });
}

export async function typeVimWriteCommand() {
  const $cmEditor = screen.getByTestId('cm-editor');

  await act(async () => {
    await userEvent.click($cmEditor);
    await userEvent.keyboard('{Shift>}{;}{/Shift}w{Enter}');
  });
}

export function getStaleBall(problem: ProblemInfo) {
  const $problemStaleBall = screen.queryByTestId(`stale-ball-${problem.number}`);

  return $problemStaleBall;
}

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

export function clearProblemEditorValue(problem: ProblemInfo) {
  const { result } = renderHook(() => ({ ...useLanguage(), ...useModifyEditor() }));

  act(() => {
    const { language, updateEditorValue } = result.current;

    updateEditorValue(problem, language, null);
  });
}

export function changeVimEditorMode() {
  const { result } = renderHook(() => useModifyEditor());

  act(() => {
    result.current.updateEditorMode('vim');
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

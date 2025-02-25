import { useEffect, useRef } from 'react';

import { CodeBlock } from '@/renderer/components/atoms/pres/CodeBlock';
import { TextArea } from '@/renderer/components/atoms/textareas/TextArea';

import { useTestcaseDetailExampleContext } from '../TestcaseDetailExampleContext';

export function TestcaseDetailExampleContent() {
  const { value, setValue, isEditing } = useTestcaseDetailExampleContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 수정이 시작되면,
   *
   * 1. 포커싱
   * 2. 커서를 맨 끝으로 위치
   * 3. 스크롤을 맨 아래로 내림
   */
  useEffect(() => {
    if (isEditing) {
      if (textareaRef.current instanceof HTMLTextAreaElement) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <TextArea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ minHeight: '100px' }}
      />
    );
  }

  return <CodeBlock>{value}</CodeBlock>;
}

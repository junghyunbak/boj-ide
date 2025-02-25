import { CodeBlock } from '@/renderer/components/atoms/pres/CodeBlock';
import { TextArea } from '@/renderer/components/atoms/textareas/TextArea';
import { useTestcaseDetailExampleContext } from '../TestcaseDetailExampleContext';

export function TestcaseDetailExampleContent() {
  const { value, setValue, isEditing } = useTestcaseDetailExampleContext();

  if (isEditing) {
    return <TextArea value={value} onChange={(e) => setValue(e.target.value)} />;
  }

  return <CodeBlock>{value}</CodeBlock>;
}

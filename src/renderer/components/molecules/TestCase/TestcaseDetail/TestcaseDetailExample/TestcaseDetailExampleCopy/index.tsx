import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';
import { useTestcaseDetailExampleContext } from '../TestcaseDetailExampleContext';

export function TestcaseDetailExampleCopy() {
  const { value } = useTestcaseDetailExampleContext();

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(value);
  };

  return <TextButton onClick={handleCopyButtonClick}>복사</TextButton>;
}

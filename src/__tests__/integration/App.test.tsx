import { PaintButton } from '@/renderer/components/atoms/buttons/PaintButton';
import { render } from '@/renderer/utils';

describe('App', () => {
  it('should render', () => {
    expect(render(<PaintButton />)).toBeTruthy();
  });
});

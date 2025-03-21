/**
 * point
 */
document.elementFromPoint = jest.fn().mockImplementation((x, y) => null);

/**
 * dom rect
 */
const domRectList = [{ x: 0, y: 0, width: 0, height: 0 }] as unknown as DOMRectList;

Element.prototype.getClientRects = () => domRectList;
Range.prototype.getClientRects = () => domRectList;

/**
 * scroll
 */
window.HTMLElement.prototype.scrollIntoView = jest.fn();

/**
 * getComputedStyle
 *
 * 이 함수가 존재하지 않으면 userEvent가 올바르게 동작하지 않는다.
 *
 * https://github.com/NickColley/jest-axe/issues/147#issuecomment-758804533
 */
{
  const { getComputedStyle } = window;

  window.getComputedStyle = (elt) => getComputedStyle(elt);
}

/**
 * ai/react 패키지 내부 브라우저 종속 TransformStream 사용으로 인한 polyfill
 */
import 'web-streams-polyfill/polyfill';

/**
 * DOMRect API 사용 불가로 인한 polyfill
 */
import 'geometry-polyfill';

const readable = new ReadableStream();

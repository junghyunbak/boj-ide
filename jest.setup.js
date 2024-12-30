/**
 * ai/react 패키지 내부 브라우저 종속 TransformStream 사용으로 인해 polyfill 적용
 */
import 'web-streams-polyfill/polyfill';

const readable = new ReadableStream();

import { useRef } from 'react';

import { css } from '@emotion/react';

import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';
import { OutputHeader } from '@/renderer/components/organisms/OutputHeader';
import { OutputContent } from '@/renderer/components/organisms/OutputContent';
import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function Output() {
  const tourRef = useRef<HTMLDivElement>(null);

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <OutputHeader />
      <RowLine />
      <div
        css={css`
          flex: 1;
          overflow-y: scroll;
        `}
        ref={tourRef}
      >
        <OutputContent />

        <TourOverlay title="알고리즘 실행 결과" myTourStep={5} guideLoc="top" tourRef={tourRef}>
          <p>코드를 실행한 결과가 출력됩니다.</p>
          <br />
          <ul>
            <li>
              {' '}
              상세 컬럼의 <b>열기</b> 버튼을 눌러 자세한 정보를 확인할 수 있습니다.{' '}
            </li>
            <li>
              {' '}
              테스트케이스 <b>삭제</b>와 <b>수정</b>은 사용자 테스트케이스만 가능합니다.{' '}
            </li>
          </ul>
        </TourOverlay>
      </div>
    </div>
  );
}

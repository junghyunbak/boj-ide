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

        <TourOverlay title="테스트 결과 및 디버깅" myTourStep={6} guideLoc="leftTop" tourRef={tourRef}>
          <p>테스트 결과가 표시되는 테이블과, 테스트케이스를 추가할 수 있는 생성기가 존재합니다.</p>
          <br />
          <ul>
            <li>
              테이블의 상세 컬럼의 <b>열기</b> 버튼을 눌러 자세한 테스트 결과를 확인할 수 있습니다.
            </li>
            <li>
              사용자가 추가한 테스트케이스의 경우에만 <b>삭제</b>와 <b>수정</b>이 가능합니다.
            </li>
          </ul>
        </TourOverlay>
      </div>
    </div>
  );
}

type Problem = ProblemInfo | null;

type ProblemInfo = {
  name: string;
  number: string;
  testCase: {
    inputs: string[];
    outputs: string[];
  };
  /**
   * ai 입력 템플릿 생성 기능 구현을 위해 이후에 추가된 속성이라 optional로 설정
   * 기능 구현 이전에 zustand persist에 의해 로컬 스토리지에 저장된 데이터는 해당 속성이 없기 때문에
   * 필수로 값을 지정해버리면 오작동하게 됨.
   */
  inputDesc?: string;
};

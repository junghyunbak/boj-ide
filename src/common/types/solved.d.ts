declare global {
  namespace SolvedAC {
    namespace API {
      interface SearchResponse {
        count: number;
        items: {
          problemId: number;
          titleKo: string;
          level: number;
        }[];
      }
    }
  }
}

export {};

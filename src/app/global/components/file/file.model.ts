export interface FileResponseModel {
  id: number;
  isLoadingDelete: boolean;
  object: {
    id: number;
    uuid: string;
    test: string;
    docfile: string;
    title: string;
    description: string;
  };
}

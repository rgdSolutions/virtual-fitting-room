export type RootStackParamList = {
  PhotoUpload: { reset?: boolean } | undefined;
  TryOnResult: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

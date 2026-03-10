export type RootStackParamList = {
  PhotoUpload: undefined;
  TryOnResult: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

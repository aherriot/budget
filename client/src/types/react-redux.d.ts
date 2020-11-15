import "react-redux";

import { RootState } from "store";

declare module "react-redux" {
  interface DefaultRootState extends RootState {}
}

export interface IContext {
  mode: 'development' | 'production';
}
export interface ICli {
  run(context: IContext): void;
}

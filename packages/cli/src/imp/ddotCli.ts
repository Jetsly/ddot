import { ddotContainer, ICli, injectable, TYPES } from '@ddot/utils';

@injectable()
class DDotCli implements ICli {
  public run(context: import("/Users/dot/code/github/ddot/packages/utils/lib/interfaces").IContext): void {
    throw new Error("Method not implemented.");
  }
}

ddotContainer.bind<ICli>(TYPES.ICli).to(DDotCli);

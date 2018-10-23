import { ICli, TYPES, ddotContainer, injectable } from '@ddot/utils';

@injectable()
class DDotCli implements ICli {
  run() {
    console.log(1)
  }
}

ddotContainer.bind<ICli>(TYPES.ICli).to(DDotCli);

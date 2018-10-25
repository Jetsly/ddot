import { ddotContainer, ICli, TYPES } from '@ddot/utils';

import './imp/ddotCli';

ddotContainer.get<ICli>(TYPES.ICli);

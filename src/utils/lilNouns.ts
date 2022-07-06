import ethers from 'ethers';
import {
  NounsTokenFactory,
  NounsDescriptorFactory,
  NounsSeederFactory,
} from '@nouns/contracts';

export const addresses = {
  seeder: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
  descriptor: '0x11fb55d9580cdbfb83de3510ff5ba74309800ad1',
  token: '0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b',
};

export const getContractsForChainOrThrow = (
  chainId: number,
  provider: ethers.providers.JsonRpcProvider,
) => {
  return {
    nounsTokenContract: NounsTokenFactory.connect(addresses.token, provider),
    nounsDescriptorContract: NounsDescriptorFactory.connect(
      addresses.descriptor,
      provider,
    ),
    nounsSeederContract: NounsSeederFactory.connect(addresses.seeder, provider),
  };
};

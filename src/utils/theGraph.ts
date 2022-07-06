import axios from 'axios';

const subgraph = () => {
  switch(process.env.TOKEN) {
    case "lilNouns":
      return 'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph'
    case "nouns":
    default:
      return 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph'
  }
}

export const allNouns = async () =>
  (
    await axios.post(
      subgraph(),
      {
        query: `{
  nouns(first: 1000) {
    id
    seed {
      background
      body
      accessory
      head
      glasses
    }
    owner {
      id
			delegate {
				id
			}
    }
  }
}
`,
      },
    )
  ).data.data.nouns;

export const addressNouns = async (address: string) =>
  (
    await axios.post(
      subgraph(),
      {
        query: `{
  nouns(where: {
    owner: "${address}"
  }, first: 1000) {
    id
    seed {
      background
      body
      accessory
      head
      glasses
    }
    owner {
      id
			delegate {
				id
			}
    }
  }
}
`,
      },
    )
  ).data.data.nouns;

export const nounsForAddress = async (addr: string, delegate: boolean = false) => {
  return (await addressNouns(addr.toLowerCase()))
    .filter(
      (noun) => {
				const isOwned = noun.owner.id.toLocaleLowerCase() === addr.toLocaleLowerCase()
				const isDelegate = noun.owner.delegate.id.toLocaleLowerCase() === addr.toLocaleLowerCase()
				return isOwned || (delegate && isDelegate)
			}
    )
    .map(normalizeNoun);
}

const normalizeSeed = (seed) => ({
  accessory: Number(seed.accessory),
  background: Number(seed.background),
  body: Number(seed.body),
  glasses: Number(seed.glasses),
  head: Number(seed.head),
});

const normalizeNoun = (noun) => ({
  ...noun,
  id: Number(noun.id),
  seed: normalizeSeed(noun.seed),
});

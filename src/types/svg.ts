import { CallOverrides } from "ethers";

export type SVGOptions = Partial<ISVGOptions>;

export interface ISVGOptions {
	removeBackground?: boolean;
	overrides?: CallOverrides 
}
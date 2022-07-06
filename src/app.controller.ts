import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import * as fs from 'fs';
import { cachePath as computeCachePath } from './utils/cachePath';
import { getRandomGlasses } from './utils/glasses';
import * as R from 'ramda';
import { generateHexFromNumber } from './utils/number';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello(): string {
    return '';
  }

  @Get('tokenUri/:id')
  async getTokenUri(@Param('id') id: number) {
    return this.appService.getTokenUri(id);
  }

  @Get('/block/:blockTag/:id')
  async getImageAtBlock(
    @Param('id') id: string,
    @Param('blockTag') blockTag: string,
    @Res() res: Response,
    @Query('size') size: string,
    @Query('removeBackground') removeBackground: boolean,
  ) {
    const imageSize = this.flattenSize(size);
    const idParts = id.split('.');
    const nounId = parseInt(idParts[0]);
    const format = idParts[1] || 'png';

    const noun = await this.appService.generateNounSvgAtBlock(nounId, blockTag)
    noun.toFormat(format).pipe(res);
    return;
  }

  @Get(':id.svg')
  async getSvg(
    @Param('id') id: number,
    @Res() res: Response,
    @Query('removeBackground') removeBackground: boolean,
  ) {
    const cacheName = [id, removeBackground ? "rmb" : ""].join('_');
    // return (await this.appService.getRawSvg(id)).toString();
    const cachePath = `/tmp/nouns/${cacheName}.svg`;
    if (!fs.existsSync(cachePath)) {
      const svg = (await this.appService.getRawSvg(id, { removeBackground })).toString();
      fs.writeFileSync(cachePath, svg);
    }
    res.sendFile(cachePath);
    return;
  }

  @Get('0x:address')
  async getAddressNouns(
    @Param('address') addr: string,
    @Res() res: Response,
    @Query('includeDelegates') includeDelegates: string,
    @Query('size') size: string,
  ) {
    const addrParts = addr.split('.');
    const address = addrParts[0];
    const format = addrParts[1] || 'png';
    const fullAddress = `0x${address}`;

    const nounTile = await this.appService.getAddressNounTile(
      fullAddress,
      includeDelegates === 'true',
    );
    nounTile.toFormat(format).pipe(res);
  }

  @Get(':ens.eth:ext?')
  async getEnsNameNouns(
    @Param('ens') ens: string,
    @Param('ext') ext: string,
    @Res() res: Response,
    @Query('includeDelegates') includeDelegates: string,
    @Query('size') size: string,
  ) {
    const format = ext ? ext.replace('.', '') : 'png'
    const fullAddress = await this.appService.resolveEnsName(`${ens}.eth`);

    const nounTile = await this.appService.getAddressNounTile(
      fullAddress,
      includeDelegates === 'true',
    );
    nounTile.toFormat(format).pipe(res);
  }


  @Get(':id')
  async getImage(
    @Param('id') id: string,
    @Res() res: Response,
    @Query('size') size: string,
    @Query('removeBackground') removeBackground: boolean,
  ) {
    const imageSize = this.flattenSize(size);
    const idParts = id.split('.');
    const nounId = parseInt(idParts[0]);
    const format = idParts[1] || 'png';

    const png = await this.appService.getPng(nounId, imageSize, { removeBackground });
    png.toFormat(format).pipe(res);
    return;
  }


  private flattenSize = (size: number | string) =>
    R.min(size ? Number(size) : 320, 1600);
}

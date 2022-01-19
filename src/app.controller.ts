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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello(): string {
    return '';
  }

  @Get('tokenUri/:id')
  async getTokenUri(@Param('id') id: number) {
    return this.appService.getTokenUri(id);
  }

  @Get(':id.svg')
  async getSvg(@Param('id') id: number, @Res() res: Response) {
    // return (await this.appService.getRawSvg(id)).toString();
    const cachePath = `/tmp/nouns/${id}.svg`;
    if (!fs.existsSync(cachePath)) {
      const svg = (await this.appService.getRawSvg(id)).toString();
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
    const fullAddress = `0x${addr}`;
    const nounTile = await this.appService.getAddressNounTile(
      fullAddress,
      includeDelegates === 'true',
    );
    nounTile.toFormat('png').pipe(res);
  }

  @Get(':ens.eth')
  async getEnsNameNouns(
    @Param('ens') ens: string,
    @Res() res: Response,
    @Query('includeDelegates') includeDelegates: string,
    @Query('size') size: string,
  ) {
    const fullAddress = await this.appService.resolveEnsName(`${ens}.eth`);
    const nounTile = await this.appService.getAddressNounTile(
      fullAddress,
      includeDelegates === 'true',
    );
    nounTile.toFormat('png').pipe(res);
  }

  @Get(':id')
  async getImage(
    @Param('id') id: string,
    @Res() res: Response,
    @Query('size') size: string,
  ) {
    const imageSize = this.flattenSize(size);
    const idParts = id.split('.');
    const nounId = parseInt(idParts[0]);
    const format = idParts[1] || 'png';

    const png = await this.appService.getPng(nounId, imageSize);
    png.toFormat(format).pipe(res);
    return;
  }
  
   private flattenSize = (size: number | string) => R.min(size ? Number(size) : 320, 1600);
}

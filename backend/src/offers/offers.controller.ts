import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  createOffer(@Req() req, @Body() offer: CreateOfferDto) {
    return this.offersService.createOffer(req.user, offer);
  }

  @UseGuards(JwtGuard)
  @Get()
  getOffers() {
    return this.offersService.getOffers();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOffer(@Param('id') id: string) {
    return this.offersService.getOffer(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  public async updateOffer(
    @Req() req,
    @Param('id') id: string,
    @Body() offer: UpdateOfferDto,
  ) {
    const currentOffer = await this.offersService.getOffer(+id);
    if (!currentOffer) {
      throw new NotFoundException();
    }
    if (currentOffer.user.id !== req.user.id) {
      throw new ForbiddenException();
    }
    await this.offersService.updateOffer(+id, offer);
    return { ...currentOffer, ...offer };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async deleteOffer(@Req() req, @Param('id') id: string) {
    const offer = await this.offersService.getOffer(+id);
    if (!offer) {
      throw new NotFoundException();
    }
    if (offer.user.id !== req.user.id) {
      throw new ForbiddenException();
    }
    return this.offersService.deleteOffer(+id);
  }
}

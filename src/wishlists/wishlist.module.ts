import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist-service';
import { WishlistsController } from './wishlist-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersModule } from 'src/users/users.module';
import { WishesModule } from 'src/wishes/wishes.module';

@Module({
  imports: [UsersModule, WishesModule, TypeOrmModule.forFeature([Wishlist])],
  providers: [WishlistService],
  controllers: [WishlistsController],
  exports: [WishlistService],
})
export class WishlistModule {}

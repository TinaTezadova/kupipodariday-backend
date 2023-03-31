import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Offer } from './offers/offer.entity';
import { OffersModule } from './offers/offer.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Wish } from './wishes/wish.entity';
import { WishesModule } from './wishes/wishes.module';
import { Wishlist } from './wishlists/wishlist.entity';
import { WishlistModule } from './wishlists/wishlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5431,
      username: 'postgres',
      password: 'password',
      database: 'kupipodaridaydb',
      entities: [User, Offer, Wish, Wishlist],
      migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    OffersModule,
    WishesModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

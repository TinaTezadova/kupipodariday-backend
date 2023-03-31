import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Offer } from './offers/entities/offer.entity';
import { OffersModule } from './offers/offer.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Wish } from './wishes/entities/wish.entity';
import { WishesModule } from './wishes/wishes.module';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { WishlistModule } from './wishlists/wishlist.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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

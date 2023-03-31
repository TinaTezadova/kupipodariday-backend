import { forwardRef, Module } from '@nestjs/common';
import { WishesService } from './wishes-service';
import { WishesController } from './wishes-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Wish])],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}

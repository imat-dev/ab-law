import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './client/client.module';
import { CaseModule } from './case/case.module';
import { S3Service } from './common/aws/s3/s3.service';
import awsConfig from './common/config/aws.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    AuthModule,
    ClientModule,
    CaseModule,
  ],
  providers: [S3Service],
})
export class AppModule {}

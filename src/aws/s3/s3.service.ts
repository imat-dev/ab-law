import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('aws.s3BucketName');

    AWS.config.update({
      accessKeyId: this.configService.get('aws.accessKeyId'),
      secretAccessKey: this.configService.get('aws.secretAccessKey'),
      region: this.configService.get('aws.region'),
    });

    this.s3 = new AWS.S3();
  }

  async uploadFile(file: any) {
    const params = {
      Bucket: this.bucketName,
      Key: file.key,
      Body: file.buffer,
    };

    return this.s3.upload(params).promise();
  }

  filenameToS3Key(filename: string): string {
    let key = filename.replace(/\s+/g, '-');
    key = key.replace(/[?&#]/g, '');
    key = key.toLowerCase();
    return key;
  }


  testfunction() {
    console.log('hey')
    console.log('he2')

  }


}

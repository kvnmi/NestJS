import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('appe2e', () => {
  let app: INestApplication;
  beforeAll(async function () {
    const moduleRef = Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = (await moduleRef).createNestApplication();
  });

  /*  afterAll(() => {
    app.close();
  }); */

  it.todo('should pass');
});

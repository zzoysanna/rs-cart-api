import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { Client } from 'pg';
let server: Handler;

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
  try {
    const {user, host, port, database, password} = process.env;
    const client = new Client({
      user,
      host,
      database,
      password,
      port,
    });
    await client.connect();
  } catch (error) {
    console.log('error while trying to connect to db:', error.message);
  }
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};


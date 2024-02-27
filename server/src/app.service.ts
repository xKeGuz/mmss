import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Welcome to the MMSS API REST</title>
      </head>
      <body>
        <h1>Hello World!</h1>
        <p>Welcome to the MMSS API REST</p>
      </body>
    </html>  
    `;
  }
}

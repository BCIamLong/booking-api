import { Request, Response, Router } from 'express'
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc'
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express'
import { version } from '../../package.json'

const swagger = Router()

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Prepare API for application',
    version,
    description: 'This is a REST API application made with Express using Typescript',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html'
    },
    contact: {
      name: 'longhoang',
      url: 'https://google.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3009',
      description: 'Development server'
    }
  ]
}

const swaggerOptions: SwaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./src/api/routes/*.ts', './src/api/validators/*.ts', './src/api/database/models/*.ts']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

const options = {
  // customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Booking API'
  // customfavIcon: '/assets/favicon.ico'
}

swagger.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options))

swagger.get('/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

export default swagger

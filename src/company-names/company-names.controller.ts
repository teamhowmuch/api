import { Controller, Get } from '@nestjs/common'
import { GraphQLClient, gql } from 'graphql-request'

interface Company {
  displayNameCompany: string
}

const banksQuery = gql`
  query BanksQuery {
    companies(where: { sellsBankaccount: true }, first: 100) {
      displayNameCompany
    }
  }
`

const travelQuery = gql`
  query TravelQuery {
    companies(where: { sellsTravelInsurance: true }, first: 100) {
      displayNameCompany
    }
  }
`

const carQuery = gql`
  query CarQuery {
    companies(where: { sellsCarInsurance: true }, first: 100) {
      displayNameCompany
    }
  }
`

const healthQuery = gql`
  query HealthQuery {
    companies(where: { sellsHealthInsurance: true }, first: 100) {
      displayNameCompany
    }
  }
`

// async function fetchHealth() {
//   const {
//     data: { companies },
//   } = await client.query<{ companies: Company[] }>({
//     query: healthQuery,
//   })

//   return companies.map((c) => c.displayNameCompany)
// }

// async function fetchTravel() {
//   const {
//     data: { companies },
//   } = await client.query<{ companies: Company[] }>({
//     query: travelQuery,
//   })

//   return companies.map((c) => c.displayNameCompany)
// }

@Controller('company-names')
export class CompanyNamesController {
  private client = new GraphQLClient(process.env.HYGRAPH_ENDPOINT, {
    headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN as string}` },
  })

  @Get('/banks')
  async getBankNames() {
    const res = await this.client.request(banksQuery)
    return res.companies.map((c: Company) => c.displayNameCompany)
  }

  @Get('/health')
  async getHealthNames() {
    const res = await this.client.request(healthQuery)
    return res.companies.map((c: Company) => c.displayNameCompany)
  }

  @Get('/car')
  async getCarInsuranceNames() {
    const res = await this.client.request(carQuery)
    return res.companies.map((c: Company) => c.displayNameCompany)
  }

  @Get('/travel')
  async getTravelNames() {
    const res = await this.client.request(travelQuery)
    return res.companies.map((c: Company) => c.displayNameCompany)
  }

  //   @Get('/health')
  //   async getHealthNames() {
  //     return fetchHealth()
  //   }

  //   @Get('/travel')
  //   async getTravelNames() {
  //     return fetchTravel()
  //   }
}

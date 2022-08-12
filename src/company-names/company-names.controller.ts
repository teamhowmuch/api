import { Controller, Get } from '@nestjs/common'
import { execute, makePromise } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

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
  @Get('/banks')
  async getBankNames() {
    const uri = process.env.HYGRAPH_ENDPOINT
    const link = createHttpLink({
      uri,
      headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN as string}` },
    })
    const { data } = await makePromise(
      execute(link, {
        query: banksQuery,
      }),
    )
    return data.companies.map((c: Company) => c.displayNameCompany)
  }

  @Get('/health')
  async getHealthNames() {
    const uri = process.env.HYGRAPH_ENDPOINT
    const link = createHttpLink({
      uri,
      headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN as string}` },
    })
    const { data } = await makePromise(
      execute(link, {
        query: healthQuery,
      }),
    )
    return data.companies.map((c: Company) => c.displayNameCompany)
  }

  @Get('/travel')
  async getTravelNames() {
    const uri = process.env.HYGRAPH_ENDPOINT
    const link = createHttpLink({
      uri,
      headers: { Authorization: `Bearer ${process.env.HYGRAPH_TOKEN as string}` },
    })
    const { data } = await makePromise(
      execute(link, {
        query: travelQuery,
      }),
    )
    return data.companies.map((c: Company) => c.displayNameCompany)
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

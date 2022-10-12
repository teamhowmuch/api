import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import mailchimp from '@mailchimp/mailchimp_marketing'
import { createHash } from 'crypto'

const LIST_ID = 'e79e2993f2'

@Injectable()
export class McService {
  constructor(private httpService: HttpService) {
    mailchimp.setConfig({
      server: 'us14',
      apiKey: '36842b73adcf75555f76139755ac15f8-us14',
    })
  }

  async updateContactTags(email: string, tags?: string[]) {
    if (tags && tags.length > 0) {
      const emailHash = createHash('md5').update(email.toLowerCase()).digest('hex')
      const tagsObj = tags.map((tag) => ({
        name: tag,
        status: 'active',
      }))
      console.log('updating', email, emailHash, 'with tags', tagsObj)
      try {
        await mailchimp.lists.updateListMemberTags(LIST_ID, emailHash, tagsObj)
        console.log('updated', email, 'tags')
        return
      } catch (error) {
        console.error('error updating tags')
        console.error(error)
        throw error
      }
    } else {
      console.log('no tags to add')
      return
    }
  }

  async signupContact(email: string, tags?: string[]) {
    try {
      await mailchimp.lists.addListMember(LIST_ID, {
        email_address: email,
        tags: tags ? [...tags] : [],
        status: 'subscribed',
      })
      console.log('Successfully signed up', email)
      return true
    } catch (error) {
      if (error.response && error.response.body && error.response.body.title === 'Member Exists') {
        this.updateContactTags(email, tags)
      } else {
        console.error(error)
        throw error
      }
    }
    return true
  }
}

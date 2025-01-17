import {NextApiRequest, NextApiResponse} from 'next'
import {convertkitAxios} from '@skillrecordings/axios'
import serverCookie from 'cookie'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'

const TRIGGER_EMAIL_COURSE_TAG_ID = 2514021

const subscriber = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {
        email_address,
        first_name,
        fields,
        tag = TRIGGER_EMAIL_COURSE_TAG_ID,
      } = req.body

      const url = `/tags/${tag}/subscribe`
      const subscriber = await convertkitAxios
        .post(url, {
          email: email_address,
          first_name,
          fields,
          api_key: process.env.NEXT_PUBLIC_CONVERTKIT_TOKEN,
        })
        .then(({data}) => {
          return data.subscription.subscriber
        })

      const convertkitCookie = serverCookie.serialize(
        CK_SUBSCRIBER_KEY,
        subscriber.id,
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 31556952,
        },
      )

      res.setHeader('Set-Cookie', convertkitCookie)

      res.status(200).json(subscriber)
    } catch (error) {
      console.log(error)
      res.status(200).end(error.message)
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default subscriber

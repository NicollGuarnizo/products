import {NextApiRequest, NextApiResponse} from 'next'
import {convertkitAxios} from '@skillrecordings/axios'
import serverCookie from 'cookie'
import {
  CONVERTKIT_SIGNUP_FORM,
  CONVERTKIT_TOKEN,
  CK_SUBSCRIBER_KEY,
} from '@skillrecordings/config'

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {
        email_address,
        first_name,
        fields,
        form = CONVERTKIT_SIGNUP_FORM,
        tag,
        sequence,
      } = req.body
      const getEndpoint = () => {
        if (tag) {
          return `/tags/${tag}/subscribe`
        }
        if (sequence) {
          return `/sequences/${sequence}/subscribe`
        }
        return `/forms/${form}/subscribe`
      }
      const subscriber = await convertkitAxios
        .post(getEndpoint(), {
          email: email_address,
          first_name,
          fields,
          api_key: CONVERTKIT_TOKEN,
        })
        .then(({data}) => {
          return data.subscription.subscriber
        })

      const convertkitCookie = serverCookie.serialize(
        CK_SUBSCRIBER_KEY as string,
        subscriber.id,
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 31556952,
        },
      )

      res.setHeader('Set-Cookie', convertkitCookie)

      res.status(200).json(subscriber)
    } catch (error: any) {
      console.log(error)
      res.status(200).end(error.message)
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default subscribe

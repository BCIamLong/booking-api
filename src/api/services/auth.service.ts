import axios from 'axios'
import qs from 'qs'
import { Guest, User } from '../database/models'
import { IGuest } from '../interfaces'
import { AppError } from '../utils'
import { oauthConfig } from '~/config'

const { OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_REDIRECT_URL, OAUTH_GOOGLE_SECRET } = oauthConfig

const loginService = async function (email: string, password: string) {
  let user = await Guest.findOne({ email })

  if (!user) user = await User.findOne({ email })

  if (!user) throw new AppError(404, 'User is not exist')

  // @ts-ignore
  const checked = await user?.checkPwd(password, user.password)

  if (!checked) throw new AppError(400, 'Password is not correct!')

  return user
}

const signupService = async function (data: Omit<IGuest, '_id' | 'createdAt' | 'updatedAt'>) {
  const isExist = await User.findOne({ email: data.email })
  if (isExist) throw new AppError(409, 'This email is already exist')

  const newUser = await Guest.create(data)

  return newUser
}

const checkEmailExist = async function (role: 'user' | 'admin', email: string) {
  let isExist
  if (role === 'user') isExist = await Guest.findOne({ email })
  if (role === 'admin') isExist = await User.findOne({ email })
  // console.log(isExist)

  if (isExist) throw new AppError(409, 'This email is already exist')
}

interface GoogleOauthTokens {
  access_token: string
  id_token: string
  expires_in: string
  refresh_token: string
  scope: string
}

const getGoogleOauthTokens = async function ({ code }: { code: string }): Promise<GoogleOauthTokens> {
  const url = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: OAUTH_GOOGLE_CLIENT_ID,
    client_secret: OAUTH_GOOGLE_SECRET,
    redirect_uri: OAUTH_GOOGLE_REDIRECT_URL,
    grant_type: 'authorization_code'
  }
  const res = await axios.post<GoogleOauthTokens>(url, qs.stringify(values), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return res.data
}

interface GoogleUser {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

const getGoogleUser = async function ({
  id_token,
  access_token
}: {
  id_token: string
  access_token: string
}): Promise<GoogleUser> {
  const res = await axios.get<GoogleUser>(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    }
  )
  return res.data
}

export default { loginService, signupService, checkEmailExist, getGoogleOauthTokens, getGoogleUser }

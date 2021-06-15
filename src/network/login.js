import {request} from './request'

export function Login(loginForm)
{
  return request({
    url: 'login',
    method: 'post',
    params: {
      username:loginForm.username,
      password:loginForm.password
    }
  }).catch(err => err)
}
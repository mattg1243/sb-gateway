import { object, string, TypeOf, z } from 'zod';

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Please enter your password to login',
    }),
  }),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];

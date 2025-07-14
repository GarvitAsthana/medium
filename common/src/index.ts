import { z }from 'zod';

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6 , "Password must be at least 6 characters long"),
    name: z.string().optional()
})


export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string()
   
})


export const createBlogSchema = z.object({
    title: z.string(),
    content: z.string(),
    publishedDate: z.string().optional()
})


export const updateBlogSchema = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string().uuid()
})

export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type CreateBlogSchema = z.infer<typeof createBlogSchema>;
export type UpdateBlogSchema = z.infer<typeof updateBlogSchema>;
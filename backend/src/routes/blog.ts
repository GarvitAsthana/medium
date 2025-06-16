import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import { createBlogSchema , updateBlogSchema } from '@garvit02/medium-common';

export const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string
    JWT_SECRET: string
  }, 
  Variables: {
    userId: string,
   }
}>();

blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("Authorization")||"";

    try {
      const token = authHeader?.split(' ')[1];
    const user =await verify(token, c.env.JWT_SECRET) as { id: string };
    if(user) {
        c.set('userId', user.id);
        await next();
    } else {
        c.status(403);

        return c.json({
            message: "You are not signed in"
        })
    }
    }
    catch(e) {
      c.status(403);
      return c.json({
        message: "Your are not logged in"
      })
    }
    

})

blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const authorId = c.get('userId');
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const { success } = createBlogSchema.safeParse(body);
if(!success) {
    c.status(411);
    return c.json({
        error: "Invalid inputs for the blog, can't be created"
    })
}

const blog = await prisma.blog.create({
    data: {
        title: body.title,
        content: body.content,
        authorId: authorId
    }
})

  return c.json({
    id: blog.id
  })
})

blogRouter.put('/', async (c) => {
   const body = await c.req.json();
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const { success } = updateBlogSchema.safeParse(body);
if(!success) {
    c.status(411);
    return c.json({
        error: "Invalid inputs for the blog, can't be updated"
    })
}

const blog = await prisma.blog.update({
    where: {
        id: body.id
    },
    data: {
        title: body.title,
        content: body.content,
        
    }
})

  return c.json({
    id: blog.id
  })
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const blogs = await prisma.blog.findMany();
  return c.json({
    blogs
  })
})

blogRouter.get('/:id', async (c) => {
    const id =  c.req.param("id");
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

try {
    const blog = await prisma.blog.findFirst({
    where: {
        id: id
    }
})

  return c.json({
    blog
  })
} catch(e) {
    c.status(411);
    return c.json({
        message: "blog not found"
    })
}


})


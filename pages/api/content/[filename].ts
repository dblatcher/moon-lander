import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import { join } from 'path'

const contentDirectory = join(process.cwd(), 'public/content')

type Data = {
  content?: string
  filename?: string
  error?:any
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let { filename } = req.query
  filename = typeof filename === 'string' ? filename : filename[0];

  const path = join(contentDirectory, filename + ".md");

  if (!fs.existsSync(path)) {
    res.status(404).send({error:"file not found"});
    return
  }

  try {
    const content = fs.readFileSync(path, {encoding:'utf-8'})
    res.status(200).json({ content, filename })
  } catch (error) {
    console.log({error})
    res.status(500).send({error:"read error"});
  }
}

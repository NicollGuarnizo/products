import * as React from 'react'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'

const Blog: React.FC = (allArticles: any) => {
  return (
    <div className="mx-auto max-w-screen-xl">
      <h1 className="py-16 mb-10 text-center lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tighter max-w-screen-lg m-auto">
        Recursos escritos para dominar el ecosistema de JavaScript.
      </h1>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
        {allArticles.allArticles.map((resource: any) => {
          return (
            <div key={resource.path}>
              <HorizontalResourceCard resource={resource} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Blog

const allArticlesQuery = groq`
*[_type == "post" && publishedAt < now()]|order(publishedAt desc) {
  title,
  slug,
  path,
  publishedAt,
  "author": collaborators[0]->{
    title,
    'slug': person->slug.current,
    'name': person->name,
    'path': person->website,
    'twitter': person->twitter,
    'image': person->image.url
  },
  "image":{
    'url': image.url
  },
  "tag": softwarelibraries[0]-> {
    name,
    "image": image.url
  }
}
`

export async function getStaticProps() {
  const allArticles = await sanityClient.fetch(allArticlesQuery)

  return {
    props: {
      allArticles,
    },
  }
}

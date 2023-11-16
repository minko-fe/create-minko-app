import Head from 'next/head'

export type TDKProps<T = string> = {
  title?: T
  description?: T
  keywords?: T
  name?: T
}

export default function TDK(props: TDKProps) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta property='og:title' content={props.title} />
      <meta property='title' content={props.title} />
      {props.name && <meta property='og:site_name' content={props.name} />}
      <meta name='description' content={props.description} />
      <meta name='keywords' content={props.keywords} />
    </Head>
  )
}

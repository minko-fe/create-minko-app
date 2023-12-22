import NextLink from 'next/link'

const Link = (props: React.ComponentProps<typeof NextLink>) => {
  if (props.href) {
    return <NextLink {...props} prefetch={false}></NextLink>
  }
  return <span {...props}></span>
}

export type LinkProps = React.ComponentProps<typeof NextLink>

export default Link

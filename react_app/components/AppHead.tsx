import Head from 'next/head'
import React from 'react'

function GoogleTagManagerScript() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GTAG}');
        `}
      </script>
    </>
  )
}

export default function AppHead({ title = 'Chegados' }: { title?: string }) {
  const description = "Chegados"

  return (
    <Head>
      <title>{`${title} | Chegados`}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content="Chegados" />

      <meta property="og:title" content="Chegados" />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      <meta name="twitter:description" content={description} />

      {process.env.NODE_ENV === 'production' && <GoogleTagManagerScript />}
    </Head>
  )
}

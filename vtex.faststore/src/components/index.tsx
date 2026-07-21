import dynamic from 'next/dynamic'

const MfeHost = dynamic(() => import('./sections/MfeHost/MfeHost'), { ssr: false })

const components: Record<string, any> = {
  MfeHost,
}

export default components
